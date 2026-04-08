package com.crossapplication.main.service.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.Activity;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.interfaces.ActivityRepository;
import com.crossapplication.main.service.interfaces.ActivityServiceInterface;

import jakarta.transaction.Transactional;

@Service
public class ActivityService implements ActivityServiceInterface {

    @Autowired
    private ActivityRepository activityRepository;

    @Override
    @Transactional
    public Activity addActivity(Long userId, String type, Integer durationMinutes, Double caloriesBurned, LocalDateTime startTime, Double distanceKm, Integer steps, String source, String externalId) {
        Activity a = new Activity();
        User u = new User();
        u.setId(userId);
        a.setUser(u);
        a.setActivityType(type);
        a.setDurationMinutes(durationMinutes);
        a.setCaloriesBurned(caloriesBurned);
        a.setStartTime(startTime);
        a.setLogDate(startTime != null ? startTime.toLocalDate() : LocalDate.now());
        a.setDistanceKm(distanceKm);
        a.setSteps(steps);
        a.setSource(source);
        a.setExternalId(externalId);
        a.setCreatedAt(LocalDateTime.now());
        return activityRepository.save(a);
    }

    @Override
    public List<Activity> getActivitiesBetween(Long userId, LocalDate start, LocalDate end) {
        return activityRepository.findByUserIdAndLogDateBetween(userId, start, end);
    }

    @Override
    public double getCaloriesBurned(Long userId, LocalDate date) {
        return activityRepository.sumCaloriesByUserIdAndLogDate(userId, date);
    }
}
