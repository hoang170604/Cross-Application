package com.crossapplication.main.service.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.FastingSessionDTO;
import com.crossapplication.main.entity.FastingSession;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.interfaces.FastingSessionRepository;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.FastingSessionService;

@Service
public class FastingSessionServiceImpl implements FastingSessionService {

    @Autowired
    private FastingSessionRepository fastingSessionRepository;

    @Autowired
    private UserRepositoryInterface userRepository;

    @Override
    @Transactional
    public FastingSession create(FastingSessionDTO dto) {
        if (dto.getUserId() == null) throw new IllegalArgumentException("userId required");
        User u = userRepository.findById(dto.getUserId()).orElseThrow(() -> new IllegalArgumentException("user not found"));
        FastingSession e = new FastingSession();
        e.setUser(u);
        e.setStartTime(dto.getStartTime());
        e.setEndTime(dto.getEndTime());
        e.setDurationMinutes(dto.getDurationMinutes());
        e.setIsCompleted(dto.getIsCompleted());
        return fastingSessionRepository.save(e);
    }

    @Override
    public Optional<FastingSession> getById(Long id) {
        return fastingSessionRepository.findById(id);
    }

    @Override
    public List<FastingSession> listByUser(Long userId) {
        return fastingSessionRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public FastingSession update(Long id, FastingSessionDTO dto) {
        FastingSession e = fastingSessionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("not found"));
        if (dto.getStartTime() != null) e.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) e.setEndTime(dto.getEndTime());
        if (dto.getDurationMinutes() != null) e.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getIsCompleted() != null) e.setIsCompleted(dto.getIsCompleted());
        return fastingSessionRepository.save(e);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        fastingSessionRepository.deleteById(id);
    }
}
