package com.crossapplication.main.service.interfaces;

import java.sql.Date;
import java.util.List;

import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.entity.MealLog;

public interface DiaryService {

    public MealLog addFoodToMeal(Long id, Date date, String mealType, MealLog mealLog);

    public List<Meal> getDailyDiary(Long id, Date date);

    public void removeFoodFromLog(Long mealLogId);
}
