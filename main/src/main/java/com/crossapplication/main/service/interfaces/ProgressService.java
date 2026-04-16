package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import com.crossapplication.main.dto.ReportSummary;
import com.crossapplication.main.entity.DailyNutrition;
import com.crossapplication.main.entity.WeightLog;

public interface ProgressService {
    
    public List<WeightLog> getWeightHistory(Long userId, LocalDate startDate, LocalDate endDate);
    
    public List<DailyNutrition> getNutritionReport(Long userId, LocalDate startDate, LocalDate endDate);
    
    public WeightLog getLatestWeight(Long userId);
    
    public WeightLog logWeight(Long userId, double weight, LocalDate date);

    public DailyNutrition getDailyNutrition(Long userId, LocalDate date);

    public ReportSummary getNutritionSummary(Long userId, LocalDate start, LocalDate end);

    // called when a workout challenge completes to update progress/achievements
    public void onChallengeCompleted(Long userId, Long challengeId);
}
