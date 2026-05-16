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
import com.crossapplication.main.dto.MealDTO;
import com.crossapplication.main.dto.MealLogDTO;
import com.crossapplication.main.entity.MealLog;
import com.crossapplication.main.mapper.MealLogMapper;
import com.crossapplication.main.mapper.MealMapper;
import com.crossapplication.main.service.interfaces.DiaryService;

@RestController
@RequestMapping("/api/diaries")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;

    @Autowired
    private MealMapper mealMapper;

    @Autowired
    private MealLogMapper mealLogMapper;

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getDiary(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            if (userId == null || date == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId and date are required", "INVALID_PARAMS"));
            }
            List<MealDTO> meals = diaryService.getMealsBetween(userId, date, date).stream()
                    .map(mealMapper::toDto).toList();
            return ResponseEntity.ok(ApiResponse.success(meals));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "DIARY_FETCH_FAILED"));
        }
    }

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
            List<MealLogDTO> logs = diaryService.getMealLogsBetween(userId, startDate, endDate).stream()
                    .map(mealLogMapper::toDto).toList();
            return ResponseEntity.ok(ApiResponse.success(logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "MEAL_LOGS_FETCH_FAILED"));
        }
    }

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
            List<MealDTO> meals = diaryService.getMealsBetween(userId, startDate, endDate).stream()
                    .map(mealMapper::toDto).toList();
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
            MealLog mealLog = mealLogMapper.toEntity(mealLogDto);
            MealLog result = diaryService.addFoodToMeal(userId, d, mealType, mealLog);
            MealLogDTO saved = mealLogMapper.toDto(result);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved, "Food added successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "FOOD_ADD_FAILED"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi server khi thêm món ăn: " + e.getMessage(), "FOOD_ADD_ERROR"));
        }
    }

    @PutMapping("/meal-logs/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> updateMealLog(@PathVariable Long id, @RequestBody MealLogDTO update) {
        try {
            MealLog result = diaryService.updateMealLog(id, update);
            MealLogDTO saved = mealLogMapper.toDto(result);
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