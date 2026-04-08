package com.crossapplication.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.entity.Activity;
import com.crossapplication.main.service.interfaces.ActivityServiceInterface;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired
    private ActivityServiceInterface activityService;

    @PostMapping("/users/{userId}")
    public ResponseEntity<Activity> addActivity(@PathVariable Long userId, @RequestBody Activity a) {
        Activity saved = activityService.addActivity(userId, a.getActivityType(), a.getDurationMinutes(), a.getCaloriesBurned(), a.getStartTime(), a.getDistanceKm(), a.getSteps(), a.getSource(), a.getExternalId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody com.crossapplication.main.dto.ActivityDTO update) {
        Activity saved = activityService.updateActivity(id, update);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}
