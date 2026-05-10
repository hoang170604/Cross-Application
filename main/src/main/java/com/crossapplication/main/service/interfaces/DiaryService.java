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

    public List<MealDTO> getMealsBetween(Long userId, LocalDate start, LocalDate end);
    public List<com.crossapplication.main.dto.MealLogDTO> getMealLogsBetween(Long userId, LocalDate start, LocalDate end);
}
