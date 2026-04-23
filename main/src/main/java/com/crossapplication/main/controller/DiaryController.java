package com.crossapplication.main.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.dto.MealLogDTO;
import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.entity.MealLog;
import com.crossapplication.main.service.interfaces.DiaryService;

@RestController
@RequestMapping("/api/diaries")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;

    @PostMapping("/users/{userId}/meals/{mealType}")
    public ResponseEntity<ApiResponse<?>> addFood(@PathVariable Long userId, @PathVariable String mealType,
            @RequestBody MealLogDTO mealLogDto, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            LocalDate d = date != null ? date : LocalDate.now();
            MealLog mealLog = new MealLog();
            if (mealLogDto.getFoodId() != null) {
                Food f = new Food();
                f.setId(mealLogDto.getFoodId());
                mealLog.setFood(f);
            }
            if (mealLogDto.getQuantity() != null) mealLog.setQuantity(mealLogDto.getQuantity());
            if (mealLogDto.getCalories() != null) mealLog.setCalories(mealLogDto.getCalories());
            if (mealLogDto.getProtein() != null) mealLog.setProtein(mealLogDto.getProtein());
            if (mealLogDto.getCarb() != null) mealLog.setCarb(mealLogDto.getCarb());
            if (mealLogDto.getFat() != null) mealLog.setFat(mealLogDto.getFat());
            Meal m = new Meal();
            m.setDate(d);
            mealLog.setMeal(m);
            MealLog saved = diaryService.addFoodToMeal(userId, d, mealType, mealLog);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved, "Food added successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "FOOD_ADD_FAILED"));
        }
    }

    @PutMapping("/meal-logs/{id}")
    public ResponseEntity<ApiResponse<?>> updateMealLog(@PathVariable Long id, @RequestBody MealLogDTO update) {
        try {
            MealLog saved = diaryService.updateMealLog(id, update);
            return ResponseEntity.ok(ApiResponse.success(saved, "Meal log updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "MEAL_LOG_UPDATE_FAILED"));
        }
    }

    @DeleteMapping("/meal-logs/{id}")
    public ResponseEntity<ApiResponse<?>> deleteMealLog(@PathVariable Long id) {
        try {
            diaryService.removeFoodFromLog(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "MEAL_LOG_DELETE_FAILED"));
        }
    }
}