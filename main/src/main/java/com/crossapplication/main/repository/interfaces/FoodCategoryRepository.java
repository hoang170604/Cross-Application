package com.crossapplication.main.repository.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.FoodCategory;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Integer>{
    
    public List<FoodCategory> findByName(String name);

    public List<FoodCategory> findByNameContainingIgnoreCase(String keyword);
}
