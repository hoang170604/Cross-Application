package com.crossapplication.main.dto;

import java.sql.Date;

public class MealDTO {
    private String mealType;
    private Date date;
    
    public MealDTO() {}

    public MealDTO(String mealType, Date date) {
        this.mealType = mealType;
        this.date = date;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
