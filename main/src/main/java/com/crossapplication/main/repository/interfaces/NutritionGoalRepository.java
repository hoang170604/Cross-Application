package com.crossapplication.main.repository.interfaces;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.NutritionGoal;

@Repository
public interface NutritionGoalRepository extends JpaRepository<NutritionGoal, Long>{

    public Optional<NutritionGoal> findFirstByUserIdOrderByCreatedAtDesc(Long userId);

    public void deleteByUserId(Long id);
}
