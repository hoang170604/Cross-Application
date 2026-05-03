package com.crossapplication.main.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    // GET /api/diaries/users/{userId}/meal-logs?startDate=2024-01-01&endDate=2024-01-31
    @GetMapping("/users/{userId}/meal-logs")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getMealLogs(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (userId == null || startDate == null || endDate == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId, startDate, and endDate are required", "INVALID_PARAMS"));
            }
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("startDate must be on or before endDate", "INVALID_DATE_RANGE"));
            }
            List<MealLog> logs = diaryService.getMealLogsBetween(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "MEAL_LOGS_FETCH_FAILED"));
        }
    }

    // GET /api/diaries/users/{userId}/meals?startDate=&endDate= — meal slots (breakfast/lunch/…) per day without duplicating log lines
    @GetMapping("/users/{userId}/meals")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getMealsInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (userId == null || startDate == null || endDate == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId, startDate, and endDate are required", "INVALID_PARAMS"));
            }
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("startDate must be on or before endDate", "INVALID_DATE_RANGE"));
            }
            List<Meal> meals = diaryService.getMealsBetween(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(meals));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "MEALS_FETCH_FAILED"));
        }
    }

    @PostMapping("/users/{userId}/meals/{mealType}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> updateMealLog(@PathVariable Long id, @RequestBody MealLogDTO update) {
        try {
            MealLog saved = diaryService.updateMealLog(id, update);
            return ResponseEntity.ok(ApiResponse.success(saved, "Meal log updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "MEAL_LOG_UPDATE_FAILED"));
        }
    }

    @DeleteMapping("/meal-logs/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> deleteMealLog(@PathVariable Long id) {
        try {
            diaryService.removeFoodFromLog(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "MEAL_LOG_DELETE_FAILED"));
        }
    }
}