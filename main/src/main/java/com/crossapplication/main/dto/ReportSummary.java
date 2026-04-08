package com.crossapplication.main.dto;

import java.time.LocalDate;

public class ReportSummary {
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private double totalCalories;
    private double averageCaloriesPerDay;
    private double totalProtein;
    private double totalCarbs;
    private double totalFat;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public double getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(double totalCalories) {
        this.totalCalories = totalCalories;
    }

    public double getAverageCaloriesPerDay() {
        return averageCaloriesPerDay;
    }

    public void setAverageCaloriesPerDay(double averageCaloriesPerDay) {
        this.averageCaloriesPerDay = averageCaloriesPerDay;
    }

    public double getTotalProtein() {
        return totalProtein;
    }

    public void setTotalProtein(double totalProtein) {
        this.totalProtein = totalProtein;
    }

    public double getTotalCarbs() {
        return totalCarbs;
    }

    public void setTotalCarbs(double totalCarbs) {
        this.totalCarbs = totalCarbs;
    }

    public double getTotalFat() {
        return totalFat;
    }

    public void setTotalFat(double totalFat) {
        this.totalFat = totalFat;
    }
}