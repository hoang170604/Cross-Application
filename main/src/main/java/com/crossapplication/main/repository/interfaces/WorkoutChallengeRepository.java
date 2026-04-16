package com.crossapplication.main.repository.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.WorkoutChallenge;

@Repository
public interface WorkoutChallengeRepository extends JpaRepository<WorkoutChallenge, Long> {
    List<WorkoutChallenge> findByUserId(Long userId);
}
