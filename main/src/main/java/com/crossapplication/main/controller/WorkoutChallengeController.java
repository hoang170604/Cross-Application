package com.crossapplication.main.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.WorkoutChallenge;
import com.crossapplication.main.service.interfaces.WorkoutChallengeService;

@RestController
@RequestMapping("/api/workout-challenges")
public class WorkoutChallengeController {

    @Autowired
    private WorkoutChallengeService workoutChallengeService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> listAll() {
        try {
            List<WorkoutChallenge> challenges = workoutChallengeService.listAll();
            return ResponseEntity.ok(ApiResponse.success(challenges));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "LIST_FAILED"));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    public ResponseEntity<ApiResponse<?>> listForUser(@PathVariable Long userId) {
        try {
            List<WorkoutChallenge> challenges = workoutChallengeService.listByUser(userId);
            return ResponseEntity.ok(ApiResponse.success(challenges));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "LIST_FAILED"));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> get(@PathVariable Long id) {
        try {
            Optional<WorkoutChallenge> opt = workoutChallengeService.getById(id);
            if (opt.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(opt.get()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Workout challenge not found", "CHALLENGE_NOT_FOUND"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "GET_FAILED"));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> create(@jakarta.validation.Valid @RequestBody WorkoutChallengeDTO dto) {
        try {
            WorkoutChallenge created = workoutChallengeService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Workout challenge created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "CREATE_FAILED"));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> update(@PathVariable Long id, @RequestBody WorkoutChallengeDTO dto) {
        try {
            WorkoutChallenge updated = workoutChallengeService.update(id, dto);
            return ResponseEntity.ok(ApiResponse.success(updated, "Workout challenge updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPDATE_FAILED"));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long id) {
        try {
            workoutChallengeService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "DELETE_FAILED"));
        }
    }
}
