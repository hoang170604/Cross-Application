package com.crossapplication.main.service.services;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.entity.MealLog;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.repo.MealLogRepository;
import com.crossapplication.main.repository.repo.MealRepository;

import jakarta.transaction.Transactional;

@Service
public class DiaryService implements com.crossapplication.main.service.interfaces.DiaryService{

    @Autowired
    private MealRepository mealRepo;

    @Autowired
    private MealLogRepository mealLogRepo;

    @Override
    @Transactional
    public MealLog addFoodToMeal(Long id, Date date, String mealType, MealLog mealLog) {
        List<Meal> existingMeal = mealRepo.findByUserIdAndMealType(id, mealType);
        Meal targetMeal = existingMeal.stream()
                .filter(m -> m.getDate().toString().equals(date.toString()))
                .findFirst()
                .orElse(null);

        if(targetMeal == null) {
            targetMeal = new Meal();
            targetMeal.setDate(date);
            targetMeal.setMealType(mealType);

            User user = new User();
            user.setId(id);
            targetMeal.setUser(user);

            targetMeal = mealRepo.save(targetMeal);
        }
        mealLog.setMeal(targetMeal);
        return mealLogRepo.save(mealLog);
    }

    @Override
    public List<Meal> getDailyDiary(Long id, Date date) {
        List<Meal> meals = mealRepo.findByUserIdAndDate(id, date);
        return meals;
    }

    @Override
    @Transactional
    public void removeFoodFromLog(Long mealLogId) {
        mealLogRepo.deleteById(mealLogId);
    }

    @Override
    public Meal createMeal(Long userId, Date date, String mealType) {
        List<Meal> existingMeal = mealRepo.findByUserIdAndMealType(userId, mealType);
        Meal targetMeal = existingMeal.stream()
                .filter(m -> m.getDate() != null && m.getDate().equals(date))
                .findFirst()
                .orElse(null);

        if (targetMeal == null) {
            targetMeal = new Meal();
            targetMeal.setDate(date);
            targetMeal.setMealType(mealType);

            User user = new User();
            user.setId(userId);
            targetMeal.setUser(user);

            targetMeal = mealRepo.save(targetMeal);
        }

        return targetMeal;
    }

    @Override
    public MealLog updateMealLog(Long mealLogId, MealLog update) {
        return mealLogRepo.findById(mealLogId).map(existing -> {
            if (update.getFood() != null) existing.setFood(update.getFood());
            if (update.getMeal() != null) existing.setMeal(update.getMeal());
            if (update.getQuantity() != 0) existing.setQuantity(update.getQuantity());
            if (update.getCalories() != 0) existing.setCalories(update.getCalories());
            if (update.getProtein() != 0) existing.setProtein(update.getProtein());
            if (update.getCarb() != 0) existing.setCarb(update.getCarb());
            if (update.getFat() != 0) existing.setFat(update.getFat());
            return mealLogRepo.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("MealLog not found: " + mealLogId));
    }

    @Override
    public List<Meal> getMealsBetween(Long userId, Date start, Date end) {
        if (start == null || end == null) return List.of();
        java.time.LocalDate s = start.toLocalDate();
        java.time.LocalDate e = end.toLocalDate();
        List<Meal> result = new java.util.ArrayList<>();
        for (java.time.LocalDate d = s; !d.isAfter(e); d = d.plusDays(1)) {
            Date current = Date.valueOf(d);
            List<Meal> daily = mealRepo.findByUserIdAndDate(userId, current);
            if (daily != null && !daily.isEmpty()) result.addAll(daily);
        }
        return result;
    }
}
