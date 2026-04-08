package com.crossapplication.main.dto;

import java.time.LocalDate;

public class DailyNutritionDTO {
    private Long userId;
    private LocalDate date;
    private double totalCalories;
    private double totalProtein;
    private double totalCarb;
    private double totalFat;

    public DailyNutritionDTO(){}

    public DailyNutritionDTO(Long userId, LocalDate date, double totalCalories, double totalProtein, double totalCarb, double totalFat) {
        this.userId = userId;
        this.date = date;
        this.totalCalories = totalCalories;
        this.totalProtein = totalProtein;
        this.totalCarb = totalCarb;
        this.totalFat = totalFat;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(double totalCalories) {
        this.totalCalories = totalCalories;
    }

    public double getTotalProtein() {
        return totalProtein;
    }

    public void setTotalProtein(double totalProtein) {
        this.totalProtein = totalProtein;
    }

    public double getTotalCarb() {
        return totalCarb;
    }

    public void setTotalCarb(double totalCarb) {
        this.totalCarb = totalCarb;
    }

    public double getTotalFat() {
        return totalFat;
    }

    public void setTotalFat(double totalFat) {
        this.totalFat = totalFat;
    }
}
