package com.crossapplication.main.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.entity.MealLog;
import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.service.interfaces.DiaryService;

@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;

    @PostMapping("/users/{userId}/meals/{mealType}")
    public ResponseEntity<MealLog> addFood(@PathVariable Long userId, @PathVariable String mealType, @RequestBody com.crossapplication.main.dto.MealLogDTO mealLogDto, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate d = date != null ? date : LocalDate.now();
        MealLog mealLog = new MealLog();
        if (mealLogDto.getFoodId() != null) { com.crossapplication.main.entity.Food f = new com.crossapplication.main.entity.Food(); f.setId(mealLogDto.getFoodId()); mealLog.setFood(f); }
        if (mealLogDto.getQuantity() != null) mealLog.setQuantity(mealLogDto.getQuantity());
        if (mealLogDto.getCalories() != null) mealLog.setCalories(mealLogDto.getCalories());
        if (mealLogDto.getProtein() != null) mealLog.setProtein(mealLogDto.getProtein());
        if (mealLogDto.getCarb() != null) mealLog.setCarb(mealLogDto.getCarb());
        if (mealLogDto.getFat() != null) mealLog.setFat(mealLogDto.getFat());
        Meal m = new Meal(); m.setDate(d); mealLog.setMeal(m);
        MealLog saved = diaryService.addFoodToMeal(userId, d, mealType, mealLog);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/meallogs/{id}")
    public ResponseEntity<MealLog> updateMealLog(@PathVariable Long id, @RequestBody com.crossapplication.main.dto.MealLogDTO update) {
        MealLog saved = diaryService.updateMealLog(id, update);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/meallogs/{id}")
    public ResponseEntity<Void> deleteMealLog(@PathVariable Long id) {
        diaryService.removeFoodFromLog(id);
        return ResponseEntity.noContent().build();
    }
}