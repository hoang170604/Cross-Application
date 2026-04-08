package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;

public interface DailyNutritionService {
    void adjustDailyTotals(Long userId, LocalDate date, double deltaCalories, double deltaProtein, double deltaCarb, double deltaFat);
}
