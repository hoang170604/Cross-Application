package com.crossapplication.main.service.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.entity.MealLog;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.impl.MealRepository;
import com.crossapplication.main.repository.interfaces.MealLogRepository;
import com.crossapplication.main.service.interfaces.DailyNutritionService;

import jakarta.transaction.Transactional;

@Service
public class DiaryService implements com.crossapplication.main.service.interfaces.DiaryService{

    @Autowired
    private MealRepository mealRepo;

    @Autowired
    private MealLogRepository mealLogRepo;

    @Autowired
    private DailyNutritionService dailyNutritionService;

    @Override
    @Transactional
    public MealLog addFoodToMeal(Long id, LocalDate date, String mealType, MealLog mealLog) {
        List<Meal> existingMeal = mealRepo.findByUserIdAndMealType(id, mealType);
        Meal targetMeal = existingMeal.stream()
                .filter(m -> m.getDate() != null && m.getDate().equals(date))
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
        MealLog saved = mealLogRepo.save(mealLog);
        // update daily totals
        dailyNutritionService.adjustDailyTotals(id, date, saved.getCalories(), saved.getProtein(), saved.getCarb(), saved.getFat());
        return saved;
    }

    @Override
    public List<Meal> getDailyDiary(Long id, LocalDate date) {
        List<Meal> meals = mealRepo.findByUserIdAndDate(id, date);
        return meals;
    }

    @Override
    @Transactional
    public void removeFoodFromLog(Long mealLogId) {
        var opt = mealLogRepo.findById(mealLogId);
        if (opt.isPresent()) {
            MealLog m = opt.get();
            if (m.getMeal() != null && m.getMeal().getUser() != null) {
                Long userId = m.getMeal().getUser().getId();
                LocalDate date = m.getMeal().getDate();
                dailyNutritionService.adjustDailyTotals(userId, date, -m.getCalories(), -m.getProtein(), -m.getCarb(), -m.getFat());
            }
            mealLogRepo.deleteById(mealLogId);
        }
    }

    @Override
    public Meal createMeal(Long userId, LocalDate date, String mealType) {
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
    @Transactional
    public MealLog updateMealLog(Long mealLogId, com.crossapplication.main.dto.MealLogDTO update) {
        var opt = mealLogRepo.findById(mealLogId);
        if (opt.isEmpty()) throw new IllegalArgumentException("MealLog not found: " + mealLogId);
        MealLog existing = opt.get();
        double oldCalories = existing.getCalories();
        double oldProtein = existing.getProtein();
        double oldCarb = existing.getCarb();
        double oldFat = existing.getFat();

        if (update.getFoodId() != null) {
            com.crossapplication.main.entity.Food f = new com.crossapplication.main.entity.Food();
            f.setId(update.getFoodId());
            existing.setFood(f);
        }
        if (update.getMealId() != null) {
            com.crossapplication.main.entity.Meal m = new com.crossapplication.main.entity.Meal();
            m.setId(update.getMealId());
            existing.setMeal(m);
        }
        if (update.getQuantity() != null) existing.setQuantity(update.getQuantity());
        if (update.getCalories() != null) existing.setCalories(update.getCalories());
        if (update.getProtein() != null) existing.setProtein(update.getProtein());
        if (update.getCarb() != null) existing.setCarb(update.getCarb());
        if (update.getFat() != null) existing.setFat(update.getFat());

        MealLog saved = mealLogRepo.save(existing);
        // compute delta and update daily totals
        double dCal = saved.getCalories() - oldCalories;
        double dP = saved.getProtein() - oldProtein;
        double dC = saved.getCarb() - oldCarb;
        double dF = saved.getFat() - oldFat;
        if (saved.getMeal() != null && saved.getMeal().getUser() != null) {
            Long userId = saved.getMeal().getUser().getId();
            LocalDate date = saved.getMeal().getDate();
            dailyNutritionService.adjustDailyTotals(userId, date, dCal, dP, dC, dF);
        }
        return saved;
    }

    @Override
    public List<Meal> getMealsBetween(Long userId, LocalDate start, LocalDate end) {
        if (start == null || end == null) return List.of();
        List<Meal> result = new java.util.ArrayList<>();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            List<Meal> daily = mealRepo.findByUserIdAndDate(userId, d);
            if (daily != null && !daily.isEmpty()) result.addAll(daily);
        }
        return result;
    }
}
