package com.crossapplication.main.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
import com.crossapplication.main.entity.WaterLog;
import com.crossapplication.main.service.interfaces.WaterServiceInterface;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/water")
public class WaterController {

    @Autowired
    private WaterServiceInterface waterService;

    // POST /api/water/log
    @PostMapping("/log")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> logWater(@Valid @RequestBody LogWaterRequest request) {
        try {
            if (request.getUserId() == null || request.getAmountMl() == null || request.getAmountMl() <= 0) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId and amountMl (>0) are required", "INVALID_PARAMS"));
            }
            LocalDateTime timestamp = request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now();
            WaterLog logged = waterService.logWater(
                    request.getUserId(),
                    timestamp,
                    request.getAmountMl(),
                    request.getSource(),
                    request.getExternalId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(logged, "Water logged successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "LOG_WATER_FAILED"));
        }
    }

    // GET /api/water/daily-total?userId=1&date=2024-01-15
    @GetMapping("/daily-total")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getDailyTotal(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            if (userId == null || date == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId and date are required", "INVALID_PARAMS"));
            }
            double total = waterService.getDailyTotal(userId, date);
            return ResponseEntity.ok(ApiResponse.success(total, "Daily water total retrieved"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "DAILY_TOTAL_FAILED"));
        }
    }

    // GET /api/water/logs?userId=1&startDate=2024-01-01&endDate=2024-01-31
    @GetMapping("/logs")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getLogsBetween(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (userId == null || startDate == null || endDate == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("userId, startDate, and endDate are required", "INVALID_PARAMS"));
            }
            List<WaterLog> logs = waterService.getLogsBetween(userId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage(), "LOGS_FAILED"));
        }
    }

    // Helper DTO for log water request
    public static class LogWaterRequest {
        private Long userId;
        private LocalDateTime timestamp;
        private Double amountMl;
        private String source;
        private String externalId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        public Double getAmountMl() {
            return amountMl;
        }

        public void setAmountMl(Double amountMl) {
            this.amountMl = amountMl;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public String getExternalId() {
            return externalId;
        }

        public void setExternalId(String externalId) {
            this.externalId = externalId;
        }
    }
}
