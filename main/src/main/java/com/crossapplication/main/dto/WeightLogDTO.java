package com.crossapplication.main.dto;

import java.time.LocalDate;

public class WeightLogDTO {
    private LocalDate date;
    private double weight;

    public WeightLogDTO() {}

    public WeightLogDTO(LocalDate date, double weight) {
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
}
