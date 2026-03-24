package com.crossapplication.main.service.services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.DailyNutrition;
import com.crossapplication.main.repository.repo.DailyNutritionRepository;
import com.crossapplication.main.service.interfaces.DailyNutritionServiceInterface;

@Service
public class DailyNutritionService implements DailyNutritionServiceInterface{

    @Autowired
    private DailyNutritionRepository dailyNutrition;

    @Override
    public DailyNutrition getTodayNutrition(int userId) {
        LocalDate today = LocalDate.now();
        return dailyNutrition.findByUserIdAndDate(userId, today)
                .orElseGet(() -> {
                    DailyNutrition newRecord = new DailyNutrition();
                    newRecord.setUserId(userId);
                    newRecord.setDate(today);
                    return newRecord;
                });
    }

    @Override
    public DailyNutrition saveOrUpdate(DailyNutrition nutrition) {
        return dailyNutrition.save(nutrition);
    }
}