package com.crossapplication.main.dto;

public class FoodCategoryDTO {
    private String name;

    public FoodCategoryDTO(){}

    public FoodCategoryDTO(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
