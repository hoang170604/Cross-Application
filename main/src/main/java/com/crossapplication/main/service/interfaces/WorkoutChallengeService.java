package com.crossapplication.main.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.WorkoutChallenge;

public interface WorkoutChallengeService {
    WorkoutChallenge create(WorkoutChallengeDTO dto);
    Optional<WorkoutChallenge> getById(Long id);
    List<WorkoutChallenge> listByUser(Long userId);
    List<WorkoutChallenge> listAll();
    WorkoutChallenge update(Long id, WorkoutChallengeDTO dto);
    void delete(Long id);
}
