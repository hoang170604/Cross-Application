package com.crossapplication.main.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.MealLogDTO;
import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.interfaces.DailyNutritionRepository;
import com.crossapplication.main.repository.interfaces.FoodRepositoryInterface;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.ActivityServiceInterface;
import com.crossapplication.main.service.interfaces.DiaryService;

@SpringBootTest
@Transactional
public class DailyNutritionIntegrationTest {

    @Autowired
    private UserRepositoryInterface userRepo;

    @Autowired
    private FoodRepositoryInterface foodRepo;

    @Autowired
    private DiaryService diaryService;

    @Autowired
    private ActivityServiceInterface activityService;

    @Autowired
    private DailyNutritionRepository dailyRepo;

    @Test
    public void netCaloriesUpdatedWhenAddingMealsAndActivity() {
        User u = new User();
        u.setEmail("test@example.com");
        u.setPassword("pwd");
        u.setCreatedAt(LocalDate.now());
        userRepo.save(u);
        Long userId = u.getId();

        Food f = new Food();
        f.setName("TestFood");
        f.setCaloriesPer100g(200);
        f.setProteinPer100g(10);
        f.setCarbPer100g(20);
        f.setFatPer100g(5);
        foodRepo.saveFood(f);

        LocalDate date = LocalDate.now();

        // add 3 meal logs
        MealLogDTO m1 = new MealLogDTO();
        m1.setFoodId(f.getId());
        m1.setQuantity(100.0);
        m1.setCalories(200.0);
        m1.setProtein(10.0);
        m1.setCarb(20.0);
        m1.setFat(5.0);
        diaryService.addFoodToMeal(userId, date, "breakfast", m1);

        MealLogDTO m2 = new MealLogDTO();
        m2.setFoodId(f.getId());
        m2.setQuantity(100.0);
        m2.setCalories(300.0);
        m2.setProtein(15.0);
        m2.setCarb(30.0);
        m2.setFat(8.0);
        diaryService.addFoodToMeal(userId, date, "lunch", m2);

        MealLogDTO m3 = new MealLogDTO();
        m3.setFoodId(f.getId());
        m3.setQuantity(100.0);
        m3.setCalories(250.0);
        m3.setProtein(12.0);
        m3.setCarb(25.0);
        m3.setFat(6.0);
        diaryService.addFoodToMeal(userId, date, "dinner", m3);

        double eaten = 200 + 300 + 250;

        // add activity burning 400 calories
        activityService.addActivity(userId, "gym", 120, 400.0, null, 0.0, 0, "app", null);

        var opt = dailyRepo.findByUserIdAndDate(userId, date);
        assertThat(opt).isPresent();
        var daily = opt.get();
        assertThat(daily.getTotalCalories()).isEqualTo(eaten - 400.0);
    }
}
