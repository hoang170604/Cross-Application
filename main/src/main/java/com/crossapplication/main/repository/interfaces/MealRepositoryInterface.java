package com.crossapplication.main.repository.interfaces;

import java.sql.Date;
import java.util.List;

import com.crossapplication.main.entity.Meal;

public interface MealRepositoryInterface {
    List<Meal> findByUserIdAndDate(Long userId, Date date);

    List<Meal> findByUserIdAndMealType(Long userId, String mealType);

    List<Meal> findByDateAndMealType(Date date, String mealType);

    Meal save(Meal meal);
}
