package com.crossapplication.main.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.dto.WorkoutChallengeDTO;

public interface WorkoutChallengeService {
    WorkoutChallengeDTO create(WorkoutChallengeDTO dto);
    Optional<WorkoutChallengeDTO> getById(Long id);
    List<WorkoutChallengeDTO> listByUser(Long userId);
    List<WorkoutChallengeDTO> listAll();
    WorkoutChallengeDTO update(Long id, WorkoutChallengeDTO dto);
    void delete(Long id);
}
