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

                // QUAN TRỌNG: totalCalories chỉ lưu lượng calo từ thức ăn (food intake).
                // Calo đốt cháy (activity burned) được frontend tính riêng qua activityCalories.
                // Nếu trộn burned vào đây sẽ gây lỗi double-counting trên giao diện.

                Optional<DailyNutrition> opt = dailyRepo.findByUserIdAndDate(userId, date);
                if (opt.isPresent()) {
                    DailyNutrition d = opt.get();
                    d.setTotalCalories(totalCalories);
                    d.setTotalProtein(totalProtein);
                    d.setTotalCarb(totalCarb);
                    d.setTotalFat(totalFat);
                    dailyRepo.save(d);
                } else {
                    DailyNutrition d = new DailyNutrition();
                    d.setUserId(userId);
                    d.setDate(date);
                    d.setTotalCalories(totalCalories);
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
