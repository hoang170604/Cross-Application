package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.entity.MealLog;

public interface DiaryService {

    public MealLog addFoodToMeal(Long id, LocalDate date, String mealType, MealLog mealLog);

    public List<Meal> getDailyDiary(Long id, LocalDate date);

    public void removeFoodFromLog(Long mealLogId);

    public Meal createMeal(Long userId, LocalDate date, String mealType);

    public MealLog updateMealLog(Long mealLogId, com.crossapplication.main.dto.MealLogDTO update);

    public List<Meal> getMealsBetween(Long userId, LocalDate start, LocalDate end);

    /** Meal log lines (food entries) for the given date range, ordered by date and meal type. */
    public List<MealLog> getMealLogsBetween(Long userId, LocalDate start, LocalDate end);
}
