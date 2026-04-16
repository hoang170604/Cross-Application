package com.crossapplication.main.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public class FastingStateDTO {
    @NotNull
    private Long userId;
    private Boolean isFasting;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer fastingGoalHours;

    public FastingStateDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Boolean getIsFasting() { return isFasting; }
    public void setIsFasting(Boolean isFasting) { this.isFasting = isFasting; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Integer getFastingGoalHours() { return fastingGoalHours; }
    public void setFastingGoalHours(Integer fastingGoalHours) { this.fastingGoalHours = fastingGoalHours; }
}
