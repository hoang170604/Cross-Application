package com.crossapplication.main.service.interfaces;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.crossapplication.main.entity.Food;

public interface FoodServiceInterface {
    public ArrayList<Food> getAllFood();

    public List<Food> findByCategory(Long id);
    
    public Food getById(Long id);

    public Food saveFood(Food food);

    public void deleteFood(Long id);

    public Map<String, Double> calculateNutrition(Long id, double weightInGrams);
}
