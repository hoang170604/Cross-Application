package com.crossapplication.main.service.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.WorkoutChallenge;
import com.crossapplication.main.mapper.WorkoutChallengeMapper;
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

    @Autowired
    private WorkoutChallengeMapper workoutChallengeMapper;

    @Override
    @Transactional
    public WorkoutChallengeDTO create(WorkoutChallengeDTO dto) {
        if (dto.getUserId() == null) throw new IllegalArgumentException("userId required");
        User u = userRepository.findById(dto.getUserId()).orElseThrow(() -> new IllegalArgumentException("user not found"));
        WorkoutChallenge e = workoutChallengeMapper.toEntity(dto);
        e.setUser(u);
        // if initial currentValue already meets target, mark inactive
        if (e.getTargetValue() != null && e.getCurrentValue() != null && e.getCurrentValue() >= e.getTargetValue()) {
            e.setIsActive(false);
        }
        WorkoutChallenge saved = workoutChallengeRepository.save(e);
        return workoutChallengeMapper.toDto(saved);
    }

    @Override
    public Optional<WorkoutChallengeDTO> getById(Long id) {
        return workoutChallengeRepository.findById(id)
            .map(workoutChallengeMapper::toDto);
    }

    @Override
    public List<WorkoutChallengeDTO> listByUser(Long userId) {
        return workoutChallengeRepository.findByUserId(userId)
            .stream()
            .map(workoutChallengeMapper::toDto)
            .toList();
    }

    @Override
    public List<WorkoutChallengeDTO> listAll() {
        return workoutChallengeRepository.findAll()
            .stream()
            .map(workoutChallengeMapper::toDto)
            .toList();
    }

    @Override
    @Transactional
    public WorkoutChallengeDTO update(Long id, WorkoutChallengeDTO dto) {
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
        return workoutChallengeMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        workoutChallengeRepository.deleteById(id);
    }
}
