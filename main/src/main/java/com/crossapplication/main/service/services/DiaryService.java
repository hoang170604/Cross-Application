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
}
