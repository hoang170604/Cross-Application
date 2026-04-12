package com.crossapplication.main.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="user_profile")
public class UserProfile {
    @Id
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "user_id",
                foreignKey = @ForeignKey(name = "fk_profile_user"))
    private User user;

    @Column(name="age")
    private int age;

    @Column(name="gender", length=20, nullable=false)
    private String gender;

    @Column(name="height")
    private double height;

    @Column(name="weight")
    private double weight;

    @Column(name="activity_level")
    private double activityLevel;

    @Column(name="goal", length=20, nullable=false)
    private String goal;

    @Column(name="name", length=100)
    private String name;

    @Column(name="fasting_goal", length=20)
    private String fastingGoal;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(double activityLevel) {
        this.activityLevel = activityLevel;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFastingGoal() {
        return fastingGoal;
    }

    public void setFastingGoal(String fastingGoal) {
        this.fastingGoal = fastingGoal;
    }
}
