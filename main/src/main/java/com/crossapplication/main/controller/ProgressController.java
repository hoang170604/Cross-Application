package com.crossapplication.main.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.dto.ReportSummary;
import com.crossapplication.main.entity.DailyNutrition;
import com.crossapplication.main.entity.WeightLog;
import com.crossapplication.main.service.interfaces.ProgressService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    // GET /api/progress/weight?userId=1&startDate=2024-01-01&endDate=2024-01-31
    @GetMapping("/weight")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getWeightHistory(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (userId == null || startDate == null || endDate == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId, startDate, and endDate are required", "INVALID_PARAMS"));
            }
            List<WeightLog> history = progressService.getWeightHistory(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "WEIGHT_HISTORY_FAILED"));
        }
    }

    // GET /api/progress/report?userId=1&startDate=2024-01-01&endDate=2024-01-31
    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getNutritionReport(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (userId == null || startDate == null || endDate == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId, startDate, and endDate are required", "INVALID_PARAMS"));
            }
            List<DailyNutrition> report = progressService.getNutritionReport(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "NUTRITION_REPORT_FAILED"));
        }
    }

    // GET /api/progress/nutrition?userId=1&date=2024-01-15
    @GetMapping("/nutrition")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getDailyNutrition(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            if (userId == null || date == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId and date are required", "INVALID_PARAMS"));
            }
            DailyNutrition nutrition = progressService.getDailyNutrition(userId, date);
            return ResponseEntity.ok(ApiResponse.success(nutrition));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "DAILY_NUTRITION_FAILED"));
        }
    }

    // GET /api/progress/nutrition/summary?userId=1&startDate=2024-01-01&endDate=2024-01-31
    @GetMapping("/nutrition/summary")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getNutritionSummary(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (userId == null || startDate == null || endDate == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId, startDate, and endDate are required", "INVALID_PARAMS"));
            }
            ReportSummary summary = progressService.getNutritionSummary(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "SUMMARY_FAILED"));
        }
    }

    // GET /api/progress/latest-weight?userId=1
    @GetMapping("/latest-weight")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getLatestWeight(@RequestParam Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId is required", "INVALID_PARAMS"));
            }
            WeightLog latest = progressService.getLatestWeight(userId);
            return ResponseEntity.ok(ApiResponse.success(latest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "LATEST_WEIGHT_FAILED"));
        }
    }

    // POST /api/progress/log-weight
    @PostMapping("/log-weight")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> logWeight(@Valid @RequestBody LogWeightRequest request) {
        try {
            if (request.getUserId() == null || request.getWeight() == null || request.getWeight() <= 0) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId and weight (>0) are required", "INVALID_PARAMS"));
            }
            LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();
            WeightLog logged = progressService.logWeight(request.getUserId(), request.getWeight(), date);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(logged, "Weight logged successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "LOG_WEIGHT_FAILED"));
        }
    }

    // Helper DTO for log weight request
    public static class LogWeightRequest {
        private Long userId;
        private Double weight;
        private LocalDate date;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Double getWeight() {
            return weight;
        }

        public void setWeight(Double weight) {
            this.weight = weight;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }
    }
}
