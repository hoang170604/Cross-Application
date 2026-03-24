package com.crossapplication.main.repository.interfaces;

import java.util.ArrayList;

import com.crossapplication.main.entity.Food;

public interface FoodRepositoryInterface {
    public Food saveFood(Food food);

    public void deleteFood(Long id);

    public Food findById(Long id);

    public ArrayList<Food> findAllFood();

    public ArrayList<Food> findByCategory(Long categoryId);

    public double calculateFood(double foodPer100g);
}
