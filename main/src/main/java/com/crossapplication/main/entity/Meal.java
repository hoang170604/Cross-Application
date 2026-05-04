package com.crossapplication.main.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="meal")
public class Meal {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name="meal_type", length=20, nullable=false)
    private String mealType;

    @Column(name="date")
    private LocalDate date;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    @jakarta.persistence.OneToMany(mappedBy = "meal", fetch = jakarta.persistence.FetchType.EAGER)
    private java.util.List<MealLog> mealLogs;

    public java.util.List<MealLog> getMealLogs() {
        return mealLogs;
    }

    public void setMealLogs(java.util.List<MealLog> mealLogs) {
        this.mealLogs = mealLogs;
    }
}
