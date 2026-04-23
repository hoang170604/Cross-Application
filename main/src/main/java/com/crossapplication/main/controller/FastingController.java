package com.crossapplication.main.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.dto.FastingStateDTO;
import com.crossapplication.main.entity.FastingSession;
import com.crossapplication.main.service.interfaces.FastingSessionService;
import com.crossapplication.main.service.interfaces.FastingStateService;

@RestController
@RequestMapping("/api/fasting")
public class FastingController {

    @Autowired
    private FastingStateService fastingStateService;

    @Autowired
    private FastingSessionService fastingSessionService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<?>> start(@jakarta.validation.Valid @RequestBody FastingStateDTO dto) {
        try {
            if (dto.getUserId() == null || dto.getStartTime() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("UserId and startTime are required"));
            }
            fastingStateService.startFasting(dto.getUserId(), dto.getStartTime(), dto.getFastingGoalHours());
            return ResponseEntity.ok(ApiResponse.success(null, "Fasting started successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "FASTING_START_FAILED"));
        }
    }

    @PostMapping("/stop")
    public ResponseEntity<ApiResponse<?>> stop(@jakarta.validation.Valid @RequestBody FastingStateDTO dto) {
        try {
            if (dto.getUserId() == null || dto.getEndTime() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("UserId and endTime are required"));
            }
            fastingStateService.stopFasting(dto.getUserId(), dto.getEndTime());
            return ResponseEntity.ok(ApiResponse.success(null, "Fasting stopped successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "FASTING_STOP_FAILED"));
        }
    }

    @GetMapping("/sessions/{userId}")
    public ResponseEntity<ApiResponse<?>> sessions(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(ApiResponse.success(fastingSessionService.listByUser(userId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "SESSIONS_FETCH_FAILED"));
        }
    }

    @GetMapping("/sessions/{userId}/open")
    public ResponseEntity<ApiResponse<?>> openSession(@PathVariable Long userId) {
        try {
            Optional<FastingSession> opt = fastingSessionService.listByUser(userId).stream()
                    .filter(s -> Boolean.FALSE.equals(s.getIsCompleted()))
                    .findFirst();
            if (opt.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(opt.get()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("No open fasting session found", "NO_OPEN_SESSION"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "OPEN_SESSION_FETCH_FAILED"));
        }
    }
}
