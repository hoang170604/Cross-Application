package com.crossapplication.main.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "food")
public class Food {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String name;

    @Column(name="calories_per_100g")
    private float caloriesPer100g;

    @Column(name="protein_per_100g")
    private float proteinPer100g;

    @Column(name="carb_per_100g")
    private float carbPer100g;

    @Column(name="fat_per_100g")
    private float fatPer100g;

    @ManyToOne
    @JoinColumn(name="category_id")
    private FoodCategory category;

    public Food(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getCaloriesPer100g() {
        return caloriesPer100g;
    }

    public void setCaloriesPer100g(float caloriesPer100g) {
        this.caloriesPer100g = caloriesPer100g;
    }

    public float getProteinPer100g() {
        return proteinPer100g;
    }

    public void setProteinPer100g(float proteinPer100g) {
        this.proteinPer100g = proteinPer100g;
    }

    public float getCarbPer100g() {
        return carbPer100g;
    }

    public void setCarbPer100g(float carbPer100g) {
        this.carbPer100g = carbPer100g;
    }

    public float getFatPer100g() {
        return fatPer100g;
    }

    public void setFatPer100g(float fatPer100g) {
        this.fatPer100g = fatPer100g;
    }

    public FoodCategory getCategory() {
        return category;
    }

    public void setCategory(FoodCategory categoryID) {
        this.category = categoryID;
    }
}
