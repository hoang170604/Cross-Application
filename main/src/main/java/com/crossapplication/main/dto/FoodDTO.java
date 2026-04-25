package com.crossapplication.main.dto;

public class FoodDTO {
    @jakarta.validation.constraints.NotBlank(message = "Food name is required")
    private String name;
    private float caloriesPer100g;
    private float proteinPer100g;
    private float carbPer100g;
    private float fatPer100g;

    public FoodDTO(){}

    public FoodDTO(float caloriesPer100g, float proteinPer100g, float carbPer100g, float fatPer100g) {
        this.caloriesPer100g = caloriesPer100g;
        this.proteinPer100g = proteinPer100g;
        this.carbPer100g = carbPer100g;
        this.fatPer100g = fatPer100g;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getCaloriesPer100g() {
        return caloriesPer100g;
    }

    public void setCaloriesPer100g(float caloriesPer100g) {
        this.caloriesPer100g = caloriesPer100g;
    }

    public float getProteinPer100g() {
        return proteinPer100g;
    }

    public void setProteinPer100g(float proteinPer100g) {
        this.proteinPer100g = proteinPer100g;
    }

    public float getCarbPer100g() {
        return carbPer100g;
    }

    public void setCarbPer100g(float carbPer100g) {
        this.carbPer100g = carbPer100g;
    }

    public float getFatPer100g() {
        return fatPer100g;
    }

    public void setFatPer100g(float fatPer100g) {
        this.fatPer100g = fatPer100g;
    }
}
