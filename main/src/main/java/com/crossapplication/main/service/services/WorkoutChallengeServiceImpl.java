package com.crossapplication.main.service.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.WorkoutChallenge;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.repository.interfaces.WorkoutChallengeRepository;
import com.crossapplication.main.service.interfaces.WorkoutChallengeService;

@Service
public class WorkoutChallengeServiceImpl implements WorkoutChallengeService {

    @Autowired
    private WorkoutChallengeRepository workoutChallengeRepository;

    @Autowired
    private UserRepositoryInterface userRepository;

    @Autowired
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public WorkoutChallenge create(WorkoutChallengeDTO dto) {
        if (dto.getUserId() == null) throw new IllegalArgumentException("userId required");
        User u = userRepository.findById(dto.getUserId()).orElseThrow(() -> new IllegalArgumentException("user not found"));
        WorkoutChallenge e = new WorkoutChallenge();
        e.setUser(u);
        e.setChallengeName(dto.getChallengeName());
        e.setTargetValue(dto.getTargetValue());
        e.setCurrentValue(dto.getCurrentValue() != null ? dto.getCurrentValue() : 0.0);
        e.setUnit(dto.getUnit());
        e.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        e.setStartDate(dto.getStartDate());
        e.setEndDate(dto.getEndDate());
        // if initial currentValue already meets target, mark inactive
        if (e.getTargetValue() != null && e.getCurrentValue() != null && e.getCurrentValue() >= e.getTargetValue()) {
            e.setIsActive(false);
        }
        return workoutChallengeRepository.save(e);
    }

    @Override
    public Optional<WorkoutChallenge> getById(Long id) {
        return workoutChallengeRepository.findById(id);
    }

    @Override
    public List<WorkoutChallenge> listByUser(Long userId) {
        return workoutChallengeRepository.findByUserId(userId);
    }

    @Override
    public List<WorkoutChallenge> listAll() {
        return workoutChallengeRepository.findAll();
    }

    @Override
    @Transactional
    public WorkoutChallenge update(Long id, WorkoutChallengeDTO dto) {
        WorkoutChallenge e = workoutChallengeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("not found"));
        if (dto.getChallengeName() != null) e.setChallengeName(dto.getChallengeName());
        if (dto.getTargetValue() != null) e.setTargetValue(dto.getTargetValue());
        if (dto.getCurrentValue() != null) e.setCurrentValue(dto.getCurrentValue());
        if (dto.getUnit() != null) e.setUnit(dto.getUnit());
        if (dto.getIsActive() != null) e.setIsActive(dto.getIsActive());
        if (dto.getStartDate() != null) e.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) e.setEndDate(dto.getEndDate());
        WorkoutChallenge saved = workoutChallengeRepository.save(e);
        // if reached target, mark as completed/inactive and publish event
        if (saved.getTargetValue() != null && saved.getCurrentValue() != null && saved.getCurrentValue() >= saved.getTargetValue()) {
            if (Boolean.TRUE.equals(saved.getIsActive())) {
                saved.setIsActive(false);
                workoutChallengeRepository.save(saved);
                // publish completed event
                eventPublisher.publishEvent(new com.crossapplication.main.events.ChallengeCompletedEvent(this, saved.getId(), saved.getUser() != null ? saved.getUser().getId() : null));
            }
        }
        return saved;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        workoutChallengeRepository.deleteById(id);
    }
}
