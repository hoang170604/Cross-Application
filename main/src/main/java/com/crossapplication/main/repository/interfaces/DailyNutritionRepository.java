package com.crossapplication.main.repository.interfaces;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.crossapplication.main.entity.DailyNutrition;

@Repository
public interface DailyNutritionRepository extends JpaRepository<DailyNutrition, Long>{
    
    public Optional<DailyNutrition> findByUserIdAndDate(Long userId, LocalDate date);
    
    public List<DailyNutrition> findAllByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

        @Modifying
        @Query("UPDATE DailyNutrition d SET d.totalCalories = d.totalCalories + :deltaCalories, d.totalProtein = d.totalProtein + :deltaProtein, d.totalCarb = d.totalCarb + :deltaCarb, d.totalFat = d.totalFat + :deltaFat WHERE d.userId = :userId AND d.date = :date")
        public int incrementTotals(
            @Param("userId") Long userId,
            @Param("date") LocalDate date,
            @Param("deltaCalories") double deltaCalories,
            @Param("deltaProtein") double deltaProtein,
            @Param("deltaCarb") double deltaCarb,
            @Param("deltaFat") double deltaFat
        );
}
