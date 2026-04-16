package com.crossapplication.main.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "fasting_state")
public class FastingState {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "is_fasting")
    private Boolean isFasting = false;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "fasting_goal_hours")
    private Integer fastingGoalHours;

    public FastingState() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getIsFasting() { return isFasting; }
    public void setIsFasting(Boolean isFasting) { this.isFasting = isFasting; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public Integer getFastingGoalHours() { return fastingGoalHours; }
    public void setFastingGoalHours(Integer fastingGoalHours) { this.fastingGoalHours = fastingGoalHours; }
}
