package com.crossapplication.main.repository.interfaces;

import java.time.LocalDate;
import java.util.List;

import com.crossapplication.main.entity.Meal;

public interface MealRepositoryInterface {
    public List<Meal> findByUserIdAndDate(Long userId, LocalDate date);

    public List<Meal> findByUserIdAndMealType(Long userId, String mealType);

    public List<Meal> findByDateAndMealType(LocalDate date, String mealType);

    public Meal save(Meal meal);
}
