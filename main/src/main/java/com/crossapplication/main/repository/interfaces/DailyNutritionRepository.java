package com.crossapplication.main.repository.interfaces;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.DailyNutrition;

@Repository
public interface DailyNutritionRepository extends JpaRepository<DailyNutrition, Long>{
    
    public Optional<DailyNutrition> findByUserIdAndDate(Long userId, LocalDate date);
    
    public List<DailyNutrition> findAllByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
