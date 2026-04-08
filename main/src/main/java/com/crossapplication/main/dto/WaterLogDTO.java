package com.crossapplication.main.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class WaterLogDTO {
    private Long id;
    private Long userId;
    private LocalDate logDate;
    private double amountMl;
    private String source;
    private String externalId;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public double getAmountMl() {
        return amountMl;
    }

    public void setAmountMl(double amountMl) {
        this.amountMl = amountMl;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
