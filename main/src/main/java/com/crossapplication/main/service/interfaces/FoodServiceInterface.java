package com.crossapplication.main.service.interfaces;

import java.util.List;
import java.util.Map;

import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.FoodCategory;

public interface FoodServiceInterface {
    public List<Food> getAllFood();

    public List<Food> searchByFoodName(String name);
    
    public List<Food> getFoodsByCategory(Long categoryId);

    public List<FoodCategory> getAllCategories();

    public Map<String, Double> calculateNutrition(Long id, double weightInGrams);
}
