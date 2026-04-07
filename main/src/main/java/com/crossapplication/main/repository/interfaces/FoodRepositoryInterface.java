package com.crossapplication.main.repository.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.entity.Food;

public interface FoodRepositoryInterface {
    Food saveFood(Food food);

    void deleteFood(Long id);

    Optional<Food> findById(Long id);

    List<Food> findAllFood();

    List<Food> findByCategory(Long categoryId);

    double calculateFood(double foodPer100g);
}
