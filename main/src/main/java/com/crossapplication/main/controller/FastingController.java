package com.crossapplication.main.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<?> start(@jakarta.validation.Valid @RequestBody FastingStateDTO dto) {
        try {
            if (dto.getUserId() == null || dto.getStartTime() == null) {
                return ResponseEntity.badRequest().body("userId and startTime are required");
            }
            fastingStateService.startFasting(dto.getUserId(), dto.getStartTime(), dto.getFastingGoalHours());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stop")
    public ResponseEntity<?> stop(@jakarta.validation.Valid @RequestBody FastingStateDTO dto) {
        try {
            if (dto.getUserId() == null || dto.getEndTime() == null) {
                return ResponseEntity.badRequest().body("userId and endTime are required");
            }
            fastingStateService.stopFasting(dto.getUserId(), dto.getEndTime());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sessions/{userId}")
    public ResponseEntity<?> sessions(@PathVariable Long userId) {
        return ResponseEntity.ok(fastingSessionService.listByUser(userId));
    }

    @GetMapping("/sessions/{userId}/open")
    public ResponseEntity<?> openSession(@PathVariable Long userId) {
        Optional<FastingSession> opt = fastingSessionService.listByUser(userId).stream().filter(s -> Boolean.FALSE.equals(s.getIsCompleted())).findFirst();
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }
}
