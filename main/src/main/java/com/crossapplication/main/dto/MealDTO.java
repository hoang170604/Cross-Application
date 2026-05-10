package com.crossapplication.main.dto;

import java.time.LocalDate;
import java.util.List;

public class MealDTO {
    private String mealType;
    private LocalDate date;
    private List<MealLogDTO> mealLogs;

    public MealDTO() {}

    public MealDTO(String mealType, LocalDate date) {
        this.mealType = mealType;
        this.date = date;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<MealLogDTO> getMealLogs() {
        return mealLogs;
    }

    public void setMealLogs(List<MealLogDTO> mealLogs) {
        this.mealLogs = mealLogs;
    }
}
