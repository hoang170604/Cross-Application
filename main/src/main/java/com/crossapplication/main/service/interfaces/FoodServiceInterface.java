package com.crossapplication.main.service.interfaces;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.crossapplication.main.dto.FoodDTO;
import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.FoodCategory;

public interface FoodServiceInterface {
    List<Food> getAllFood();

    List<Food> searchByFoodName(String name);
    
    List<Food> getFoodsByCategory(Long categoryId);

    List<FoodCategory> getAllCategories();

    Map<String, Double> calculateNutrition(Long id, double weightInGrams);

    FoodDTO createFood(FoodDTO dto);

    FoodDTO updateFood(Long id, FoodDTO dto);

    void deleteFood(Long id);

    Page<Food> getAllFood(Pageable p);
}
