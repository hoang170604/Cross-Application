package com.crossapplication.main.service.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.FastingStateDTO;
import com.crossapplication.main.entity.FastingState;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.interfaces.FastingStateRepository;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.FastingStateService;

@Service
public class FastingStateServiceImpl implements FastingStateService {

    @Autowired
    private FastingStateRepository fastingStateRepository;

    @Autowired
    private UserRepositoryInterface userRepository;

    @Autowired
    private com.crossapplication.main.repository.interfaces.FastingSessionRepository fastingSessionRepository;

    @Override
    @Transactional
    public FastingState createOrUpdate(FastingStateDTO dto) {
        if (dto.getUserId() == null) throw new IllegalArgumentException("userId required");
        User u = userRepository.findById(dto.getUserId()).orElseThrow(() -> new IllegalArgumentException("user not found"));
        Optional<FastingState> opt = fastingStateRepository.findById(dto.getUserId());
        FastingState e = opt.orElseGet(FastingState::new);
        e.setUser(u);
        e.setIsFasting(dto.getIsFasting());
        e.setStartTime(dto.getStartTime());
        e.setFastingGoalHours(dto.getFastingGoalHours());
        return fastingStateRepository.save(e);
    }

    @Override
    public Optional<FastingState> getByUserId(Long userId) {
        return fastingStateRepository.findById(userId);
    }

    @Override
    @Transactional
    public void startFasting(Long userId, LocalDateTime startTime, Integer goalHours) {
        User u = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));
        FastingState state = fastingStateRepository.findById(userId).orElseGet(FastingState::new);
        state.setUser(u);
        state.setIsFasting(true);
        state.setStartTime(startTime);
        state.setFastingGoalHours(goalHours);
        fastingStateRepository.save(state);
        // prevent duplicate open sessions
        java.util.Optional<com.crossapplication.main.entity.FastingSession> openOpt = fastingSessionRepository.findFirstByUserIdAndIsCompletedFalseOrderByStartTimeDesc(userId);
        if (openOpt.isPresent()) {
            throw new IllegalArgumentException("An open fasting session already exists for user");
        }

        // create a fasting session record when starting
        com.crossapplication.main.entity.FastingSession session = new com.crossapplication.main.entity.FastingSession();
        session.setUser(u);
        session.setStartTime(startTime);
        session.setIsCompleted(false);
        fastingSessionRepository.save(session);
    }

    @Override
    @Transactional
    public void stopFasting(Long userId, LocalDateTime endTime) {
        FastingState state = fastingStateRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("fasting state not found"));
        state.setIsFasting(false);
        fastingStateRepository.save(state);

        // close the most recent open fasting session for the user
        java.util.Optional<com.crossapplication.main.entity.FastingSession> openOpt = fastingSessionRepository.findFirstByUserIdAndIsCompletedFalseOrderByStartTimeDesc(userId);
        if (openOpt.isPresent()) {
            com.crossapplication.main.entity.FastingSession sess = openOpt.get();
            LocalDateTime start = sess.getStartTime();
            if (start != null && endTime != null) {
                long minutes = Duration.between(start, endTime).toMinutes();
                sess.setEndTime(endTime);
                sess.setDurationMinutes((int) minutes);
            } else {
                sess.setEndTime(endTime);
            }
            sess.setIsCompleted(true);
            fastingSessionRepository.save(sess);
        }
    }
}
