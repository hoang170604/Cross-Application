package com.crossapplication.main.repository.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.entity.Food;

public interface FoodRepositoryInterface {
    public Food saveFood(Food food);

    public void deleteFood(Long id);

    public Optional<Food> findById(Long id);

    public List<Food> findAllFood();

    public List<Food> findByCategory(Long categoryId);

    public double calculateFood(double foodPer100g);
}
