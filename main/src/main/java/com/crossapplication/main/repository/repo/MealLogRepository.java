package com.crossapplication.main.repository.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crossapplication.main.entity.MealLog;

public interface MealLogRepository extends JpaRepository<MealLog, Long>{
    
    public List<MealLog> findByMealId(Long id);

    public void deleteByMealId(Long id);
}
