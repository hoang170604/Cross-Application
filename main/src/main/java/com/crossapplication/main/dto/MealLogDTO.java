package com.crossapplication.main.dto;

import java.io.Serializable;

public class MealLogDTO implements Serializable {
    private Long id;
    private Long foodId;
    private Long mealId;
    private Double quantity;
    private Double calories;
    private Double protein;
    private Double carb;
    private Double fat;

    private String foodName;
    private String mealType;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }
    public Long getMealId() { return mealId; }
    public void setMealId(Long mealId) { this.mealId = mealId; }
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public Double getCalories() { return calories; }
    public void setCalories(Double calories) { this.calories = calories; }
    public Double getProtein() { return protein; }
    public void setProtein(Double protein) { this.protein = protein; }
    public Double getCarb() { return carb; }
    public void setCarb(Double carb) { this.carb = carb; }
    public Double getFat() { return fat; }
    public void setFat(Double fat) { this.fat = fat; }
}
