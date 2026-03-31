package com.crossapplication.main.dto;

import java.time.LocalDate;

public class NutritionGoalDTO {
    private double targetCalories;
    private double targetProtein;
    private double targetCarb;
    private double targetFat;
    private LocalDate createdAt;

    public NutritionGoalDTO() {}

    public NutritionGoalDTO(double targetCalories, double targetProtein, double targetCarb, double targetFat, LocalDate createdAt) {
        this.targetCalories = targetCalories;
        this.targetProtein = targetProtein;
        this.targetCarb = targetCarb;
        this.targetFat = targetFat;
        this.createdAt = createdAt;
    }

    public double getTargetCalories() {
        return targetCalories;
    }

    public void setTargetCalories(double targetCalories) {
        this.targetCalories = targetCalories;
    }

    public double getTargetProtein() {
        return targetProtein;
    }

    public void setTargetProtein(double targetProtein) {
        this.targetProtein = targetProtein;
    }

    public double getTargetCarb() {
        return targetCarb;
    }

    public void setTargetCarb(double targetCarb) {
        this.targetCarb = targetCarb;
    }

    public double getTargetFat() {
        return targetFat;
    }

    public void setTargetFat(double targetFat) {
        this.targetFat = targetFat;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
