package com.crossapplication.main.service.services;

import java.time.LocalDate;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.DailyNutrition;
import com.crossapplication.main.repository.interfaces.DailyNutritionRepository;
import com.crossapplication.main.service.interfaces.DailyNutritionService;

@Service
public class DailyNutritionServiceImpl implements DailyNutritionService {

    @Autowired
    private DailyNutritionRepository dailyRepo;
    private static final ConcurrentMap<String, Object> locks = new ConcurrentHashMap<>();
    
    @Autowired
    private com.crossapplication.main.repository.interfaces.MealLogRepository mealLogRepo;
    @Autowired
    private com.crossapplication.main.repository.interfaces.ActivityRepository activityRepo;

    @Override
    public void adjustDailyTotals(Long userId, LocalDate date, double deltaCalories, double deltaProtein, double deltaCarb, double deltaFat) {
        if (userId == null || date == null) return;
        String key = userId + "|" + date.toString();
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        synchronized (lock) {
            try {
                
                double totalCalories = mealLogRepo.sumCaloriesByUserIdAndDate(userId, date);
                double totalProtein = mealLogRepo.sumProteinByUserIdAndDate(userId, date);
                double totalCarb = mealLogRepo.sumCarbByUserIdAndDate(userId, date);
                double totalFat = mealLogRepo.sumFatByUserIdAndDate(userId, date);

                double burned = activityRepo.sumCaloriesByUserIdAndLogDate(userId, date);
                double netCalories = totalCalories - burned;

                Optional<DailyNutrition> opt = dailyRepo.findByUserIdAndDate(userId, date);
                if (opt.isPresent()) {
                    DailyNutrition d = opt.get();
                    d.setTotalCalories(netCalories);
                    d.setTotalProtein(totalProtein);
                    d.setTotalCarb(totalCarb);
                    d.setTotalFat(totalFat);
                    dailyRepo.save(d);
                } else {
                    DailyNutrition d = new DailyNutrition();
                    d.setUserId(userId);
                    d.setDate(date);
                    d.setTotalCalories(netCalories);
                    d.setTotalProtein(totalProtein);
                    d.setTotalCarb(totalCarb);
                    d.setTotalFat(totalFat);
                    dailyRepo.save(d);
                }
            } finally {
                locks.remove(key);
            }
        }
    }
}
