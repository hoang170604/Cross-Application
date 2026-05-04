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

import com.crossapplication.main.dto.ActivityDTO;
import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.entity.Activity;
import com.crossapplication.main.service.interfaces.ActivityServiceInterface;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityServiceInterface activityService;

    @GetMapping("/types")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> getActivityTypes() {
        // Trả về danh sách các loại bài tập hỗ trợ
        List<java.util.Map<String, Object>> types = List.of(
            java.util.Map.of("id", "WALKING", "name", "Đi bộ", "met", 3.5),
            java.util.Map.of("id", "RUNNING", "name", "Chạy bộ", "met", 8.0),
            java.util.Map.of("id", "CYCLING", "name", "Đạp xe", "met", 6.0),
            java.util.Map.of("id", "SWIMMING", "name", "Bơi lội", "met", 7.0),
            java.util.Map.of("id", "YOGA", "name", "Yoga", "met", 2.5),
            java.util.Map.of("id", "GYM", "name", "Tập Gym", "met", 5.0)
        );
        return ResponseEntity.ok(ApiResponse.success(types));
    }

    // GET /api/activities/users/{userId}/history?startDate=2024-01-01&endDate=2024-01-31
    @GetMapping("/users/{userId}/history")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getActivityHistory(
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
            List<Activity> activities = activityService.getActivitiesBetween(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(activities));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "ACTIVITY_HISTORY_FAILED"));
        }
    }

    // GET /api/activities/users/{userId}/calories-daily?date=2024-01-15
    @GetMapping("/users/{userId}/calories-daily")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getCaloriesBurnedForDay(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            if (userId == null || date == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId and date are required", "INVALID_PARAMS"));
            }
            double total = activityService.getCaloriesBurned(userId, date);
            return ResponseEntity.ok(ApiResponse.success(total, "Calories burned for day"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "CALORIES_DAILY_FAILED"));
        }
    }

    @PostMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> addActivity(@PathVariable Long userId, @RequestBody ActivityDTO activityDTO) {
        try {
            Activity saved = activityService.addActivity(
                userId,
                activityDTO.getActivityType(),
                activityDTO.getDurationMinutes(),
                activityDTO.getCaloriesBurned(),
                activityDTO.getStartTime(),
                activityDTO.getDistanceKm(),
                activityDTO.getSteps(),
                activityDTO.getSource(),
                activityDTO.getExternalId()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved, "Activity added successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "ACTIVITY_ADD_FAILED"));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> updateActivity(@PathVariable Long id, @RequestBody ActivityDTO update) {
        try {
            Activity saved = activityService.updateActivity(id, update);
            return ResponseEntity.ok(ApiResponse.success(saved, "Activity updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "ACTIVITY_UPDATE_FAILED"));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<?>> deleteActivity(@PathVariable Long id) {
        try {
            activityService.deleteActivity(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "ACTIVITY_DELETE_FAILED"));
        }
    }
}
