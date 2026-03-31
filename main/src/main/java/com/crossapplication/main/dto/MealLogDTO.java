package com.crossapplication.main.dto;

public class MealLogDTO {
    private double quantity;
    private double calories;
    private double protein;
    private double carb;
    private double fat;

    public MealLogDTO() {}

    public MealLogDTO(double quantity, double calories, double protein, double carb, double fat) {
        this.quantity = quantity;
        this.calories = calories;
        this.protein = protein;
        this.carb = carb;
        this.fat = fat;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getCalories() {
        return calories;
    }

    public void setCalories(double calories) {
        this.calories = calories;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getCarb() {
        return carb;
    }

    public void setCarb(double carb) {
        this.carb = carb;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }
}
