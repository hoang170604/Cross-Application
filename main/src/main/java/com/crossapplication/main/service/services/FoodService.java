package com.crossapplication.main.service.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.crossapplication.main.dto.FoodDTO;
import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.FoodCategory;
import com.crossapplication.main.repository.interfaces.FoodCategoryRepository;
import com.crossapplication.main.repository.interfaces.FoodRepositoryInterface;
import com.crossapplication.main.service.interfaces.FoodServiceInterface;

@Service
public class FoodService implements FoodServiceInterface {

    @Autowired
    private FoodRepositoryInterface foodRepo;

    @Autowired
    private FoodCategoryRepository categoryRepo;

    @Override
    public List<Food> getAllFood() {
        return foodRepo.findAllFood();
    }

    @Override
    public List<Food> searchByFoodName(String name) {
        if (name == null || name.isBlank()) return List.of();
        return foodRepo.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Food> getFoodsByCategory(Long categoryId) {
        if (categoryId == null) return List.of();
        return foodRepo.findByCategory(categoryId);
    }

    @Override
    public List<FoodCategory> getAllCategories() {
        return categoryRepo.findAll();
    }

    @Override
    public Map<String, Double> calculateNutrition(Long id, double weightInGrams) {
        Map<String, Double> map = new HashMap<>();
        Optional<Food> fopt = foodRepo.findById(id);
        if (fopt.isEmpty()) return map;
        Food f = fopt.get();
        double factor = weightInGrams / 100.0;
        map.put("calories", (double) f.getCaloriesPer100g() * factor);
        map.put("protein", (double) f.getProteinPer100g() * factor);
        map.put("carb", (double) f.getCarbPer100g() * factor);
        map.put("fat", (double) f.getFatPer100g() * factor);
        return map;
    }

    @Override
    public FoodDTO createFood(FoodDTO dto) {
        if (dto == null) return null;
        Food f = new Food();
        f.setName(dto.getName());
        f.setCaloriesPer100g(dto.getCaloriesPer100g());
        f.setProteinPer100g(dto.getProteinPer100g());
        f.setCarbPer100g(dto.getCarbPer100g());
        f.setFatPer100g(dto.getFatPer100g());
        Food saved = foodRepo.saveFood(f);
        FoodDTO out = new FoodDTO(saved.getCaloriesPer100g(), saved.getProteinPer100g(), saved.getCarbPer100g(), saved.getFatPer100g());
        out.setName(saved.getName());
        return out;
    }

    @Override
    public FoodDTO updateFood(Long id, FoodDTO dto) {
        if (id == null || dto == null) return null;
        Optional<Food> fopt = foodRepo.findById(id);
        if (fopt.isEmpty()) return null;
        Food existing = fopt.get();
        if (dto.getName() != null) existing.setName(dto.getName());
        existing.setCaloriesPer100g(dto.getCaloriesPer100g());
        existing.setProteinPer100g(dto.getProteinPer100g());
        existing.setCarbPer100g(dto.getCarbPer100g());
        existing.setFatPer100g(dto.getFatPer100g());
        Food saved = foodRepo.saveFood(existing);
        FoodDTO out = new FoodDTO(saved.getCaloriesPer100g(), saved.getProteinPer100g(), saved.getCarbPer100g(), saved.getFatPer100g());
        out.setName(saved.getName());
        return out;
    }

    @Override
    public void deleteFood(Long id) {
        if (id == null) return;
        foodRepo.deleteFood(id);
    }

    @Override
    public Page<Food> getAllFood(Pageable p) {
        List<Food> all = foodRepo.findAllFood();
        int total = all.size();
        int start = (int) p.getOffset();
        int end = Math.min(start + p.getPageSize(), total);
        List<Food> content = start > end ? List.of() : all.subList(start, end);
        return new PageImpl<>(content, p, total);
    }
}
