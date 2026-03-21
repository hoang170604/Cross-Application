package com.crossapplication.main.repository.interfaces;

import java.sql.Date;
import java.util.List;

import com.crossapplication.main.entity.Meal;

public interface MealRepositoryInterface {
    public List<Meal> findByUserIdAndDate(Long userId, Date date);

    public List<Meal> findByUserIdAndMealType(Long userId, String mealType);

    public List<Meal> finByDateAndMealType(Date date, String mealType);

    public Meal save(Meal meal);
}
