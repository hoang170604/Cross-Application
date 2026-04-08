package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.crossapplication.main.entity.Activity;

public interface ActivityServiceInterface {
    Activity addActivity(Long userId, String type, Integer durationMinutes, Double caloriesBurned, LocalDateTime startTime, Double distanceKm, Integer steps, String source, String externalId);

    List<Activity> getActivitiesBetween(Long userId, LocalDate start, LocalDate end);

    double getCaloriesBurned(Long userId, LocalDate date);
}
