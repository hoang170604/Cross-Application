package com.crossapplication.main.dto;

import java.time.LocalDate;

public class WeightLogDTO {
    private Long userId;
    private LocalDate date;
    private double weight;

    public WeightLogDTO() {}

    public WeightLogDTO(Long userId, LocalDate date, double weight) {
        this.userId = userId;
        this.date = date;
        this.weight = weight;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
