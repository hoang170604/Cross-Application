package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import com.crossapplication.main.dto.MealDTO;
import com.crossapplication.main.dto.MealLogDTO;

public interface DiaryService {

    public MealLogDTO addFoodToMeal(Long id, LocalDate date, String mealType, MealLogDTO mealLog);

    public List<MealDTO> getDailyDiary(Long id, LocalDate date);

    public void removeFoodFromLog(Long mealLogId);

    public MealDTO createMeal(Long userId, LocalDate date, String mealType);

    public MealLogDTO updateMealLog(Long mealLogId, com.crossapplication.main.dto.MealLogDTO update);

// <<<<<<< HEAD
//     public List<Meal> getMealsBetween(Long userId, LocalDate start, LocalDate end);

//     /** Meal log lines (food entries) for the given date range, ordered by date and meal type. */
//     public List<MealLog> getMealLogsBetween(Long userId, LocalDate start, LocalDate end);
// =======
//     public List<MealDTO> getMealsBetween(Long userId, LocalDate start, LocalDate end);
// >>>>>>> 921f5c6a854fc1f1739ba6107cbdd835894af5f1
}
