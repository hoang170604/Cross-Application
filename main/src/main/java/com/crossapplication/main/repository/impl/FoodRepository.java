package com.crossapplication.main.repository.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.Food;
import com.crossapplication.main.repository.interfaces.FoodRepositoryInterface;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class FoodRepository implements FoodRepositoryInterface{
    @PersistenceContext
    private EntityManager em;

    @Override
    public void deleteFood(Long id) {
        Food food = em.find(Food.class, id);
        if (food != null) {
            em.remove(food);
        }
    }

    @Override
    public List<Food> findAllFood() {
        return em.createQuery("SELECT f FROM Food f", Food.class)
                .getResultList();
    }

    @Override
    public List<Food> findByNameContainingIgnoreCase(String keyword) {
        return em.createQuery("SELECT f FROM Food f WHERE LOWER(f.name) LIKE :kw", Food.class)
                .setParameter("kw", "%" + (keyword == null ? "" : keyword.toLowerCase()) + "%")
                .getResultList();
    }

    @Override
    public List<Food> findByCategory(Long categoryId) {
        return em.createQuery(
                "SELECT f FROM Food f WHERE f.category.id = :catId", Food.class)
                .setParameter("catId", categoryId)
                .getResultList();
    }

    @Override
    public Optional<Food> findById(Long id) {
        return Optional.ofNullable(em.find(Food.class, id));
    }

    @Override
    public Food saveFood(Food food) {
        if (food.getId() == null) {
            em.persist(food);  
            return food;
        } else {
            return em.merge(food);
        }
    }

    @Override
    public double calculateFood(double foodPer100g) {
        return foodPer100g; // placeholder: consider renaming and/or adding amount param
    }
}
