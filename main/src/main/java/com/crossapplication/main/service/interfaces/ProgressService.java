package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import com.crossapplication.main.entity.DailyNutrition;
import com.crossapplication.main.entity.WeightLog;

public interface ProgressService {
    
    List<WeightLog> getWeightHistory(int userId, LocalDate startDate, LocalDate endDate);
    
    List<DailyNutrition> getNutritionReport(int userId, LocalDate startDate, LocalDate endDate);
    
    WeightLog getLatestWeight(int userId);
    
    WeightLog logWeight(int userId, double weight, LocalDate date);
}
