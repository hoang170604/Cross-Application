package com.crossapplication.main.service.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.Food;
import com.crossapplication.main.repository.interfaces.FoodRepositoryInterface;
import com.crossapplication.main.service.interfaces.FoodServiceInterface;

@Service
public class FoodService implements FoodServiceInterface{

    @Autowired
    private FoodRepositoryInterface foodRepository;

    @Override
    public Map<String, Double> calculateNutrition(Long id, double weightInGrams) {
        Food food = foodRepository.findById(id);
        if (food == null) {
            throw new RuntimeException("Thực phẩm không tồn tại!");
        }

        double ratio = weightInGrams / 100.0;

        Map<String, Double> result = new HashMap<>();
        result.put("calories", (double) (food.getCaloriesPer100g() * ratio));
        result.put("protein", (double) (food.getProteinPer100g() * ratio));
        result.put("carbs", (double) (food.getCarbPer100g() * ratio));
        result.put("fat", (double) (food.getFatPer100g() * ratio));
        result.put("weight", weightInGrams);

        return result;
    }

    @Override
    public void deleteFood(Long id) {
        foodRepository.deleteFood(id);
    }

    @Override
    public ArrayList<Food> getAllFood() {
        return foodRepository.findAllFood();
    }

    @Override
    public List<Food> findByCategory(Long id) {
        return foodRepository.findByCategory(id);
    }

    @Override
    public Food getById(Long id) {
        return foodRepository.findById(id);
    }

    @Override
    public Food saveFood(Food food) {
        return foodRepository.saveFood(food);
    }
}
