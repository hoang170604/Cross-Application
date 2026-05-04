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
import com.crossapplication.main.service.interfaces.DailyNutritionService;

import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityService implements ActivityServiceInterface {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private DailyNutritionService dailyNutritionService;

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
        Activity saved = activityRepository.save(a);
        
        // Activity calories KHÔNG trừ vào DailyNutrition (chỉ chứa food intake).
        // Frontend quản lý activityCalories riêng qua store.
        return saved;
    }

    @Override
    @Transactional
    public Activity updateActivity(Long activityId, com.crossapplication.main.dto.ActivityDTO update) {
        var opt = activityRepository.findById(activityId);
        if (opt.isEmpty()) throw new IllegalArgumentException("Activity not found: " + activityId);
        Activity existing = opt.get();
        Double oldCaloriesObj = existing.getCaloriesBurned();
        double oldCalories = oldCaloriesObj == null ? 0.0 : oldCaloriesObj.doubleValue();

        if (update.getActivityType() != null) existing.setActivityType(update.getActivityType());
        if (update.getDurationMinutes() != null) existing.setDurationMinutes(update.getDurationMinutes());
        if (update.getCaloriesBurned() != null) existing.setCaloriesBurned(update.getCaloriesBurned());
        if (update.getStartTime() != null) existing.setStartTime(update.getStartTime());
        if (update.getDistanceKm() != null) existing.setDistanceKm(update.getDistanceKm());
        if (update.getSteps() != null) existing.setSteps(update.getSteps());
        if (update.getSource() != null) existing.setSource(update.getSource());
        if (update.getExternalId() != null) existing.setExternalId(update.getExternalId());

        Activity saved = activityRepository.save(existing);
        Double newCaloriesObj = saved.getCaloriesBurned();
        double newCalories = newCaloriesObj == null ? 0.0 : newCaloriesObj.doubleValue();
        double delta = newCalories - oldCalories;
        // Activity calories KHÔNG ảnh hưởng đến DailyNutrition.
        return saved;
    }

    @Override
    @Transactional
    public void deleteActivity(Long activityId) {
        var opt = activityRepository.findById(activityId);
        if (opt.isEmpty()) return;
        Activity a = opt.get();
        // Activity calories KHÔNG ảnh hưởng đến DailyNutrition.
        activityRepository.deleteById(activityId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Activity> getActivitiesBetween(Long userId, LocalDate start, LocalDate end) {
        return activityRepository.findByUserIdAndLogDateBetween(userId, start, end);
    }

    @Override
    public double getCaloriesBurned(Long userId, LocalDate date) {
        return activityRepository.sumCaloriesByUserIdAndLogDate(userId, date);
    }
}
