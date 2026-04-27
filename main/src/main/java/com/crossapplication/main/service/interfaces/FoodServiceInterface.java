package com.crossapplication.main.service.interfaces;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.crossapplication.main.dto.FoodDTO;
import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.FoodCategory;
import com.crossapplication.main.entity.MealLog;

public interface FoodServiceInterface {
    public List<Food> getAllFood();

    public List<Food> searchByFoodName(String name);
    
    public List<Food> getFoodsByCategory(Long categoryId);

    public List<FoodCategory> getAllCategories();

    public Map<String, Double> calculateNutrition(Long id, double weightInGrams);

    public MealLog addFoodToMeal(Long userId, Long mealId, Long foodId, double weightInGrams);

    public FoodDTO updateFood(Long id, FoodDTO dto);

    public void deleteFood(Long id);

    public java.util.Optional<Food> getFoodById(Long id);

    public Page<Food> getAllFood(Pageable p);
    
    /**
     * ADMIN: Create/Add new food to library
     */
    public Food createFood(FoodDTO dto);
}
