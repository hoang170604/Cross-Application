package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.crossapplication.main.entity.Activity;

public interface ActivityServiceInterface {
    public Activity addActivity(Long userId, String type, Integer durationMinutes, Double caloriesBurned, LocalDateTime startTime, Double distanceKm, Integer steps, String source, String externalId);

    public List<Activity> getActivitiesBetween(Long userId, LocalDate start, LocalDate end);

    public double getCaloriesBurned(Long userId, LocalDate date);

    public Activity updateActivity(Long activityId, com.crossapplication.main.dto.ActivityDTO update);
    
    public void deleteActivity(Long activityId);
}
