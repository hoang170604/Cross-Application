package com.crossapplication.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @PostMapping("/users/{userId}")
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
    public ResponseEntity<ApiResponse<?>> updateActivity(@PathVariable Long id, @RequestBody ActivityDTO update) {
        try {
            Activity saved = activityService.updateActivity(id, update);
            return ResponseEntity.ok(ApiResponse.success(saved, "Activity updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "ACTIVITY_UPDATE_FAILED"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteActivity(@PathVariable Long id) {
        try {
            activityService.deleteActivity(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "ACTIVITY_DELETE_FAILED"));
        }
    }
}
