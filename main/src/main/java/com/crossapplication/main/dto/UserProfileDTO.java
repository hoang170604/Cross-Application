package com.crossapplication.main.dto;

public class UserProfileDTO {
    private int age;
    private String gender;
    private double height;
    private double weight;
    private double activityLevel;
    private String goal;
    private String name;
    private String fastingGoal;

    public UserProfileDTO() {}

    public UserProfileDTO(String gender, double height, double weight, double activityLevel, String goal) {
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.activityLevel = activityLevel;
        this.goal = goal;
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
