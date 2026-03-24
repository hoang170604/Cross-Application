package com.crossapplication.main.repository.repo;

import java.util.ArrayList;
import java.util.List;

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
    public ArrayList<Food> findAllFood() {
        List<Food> list = em.createQuery("SELECT f FROM Food f", Food.class)
                            .getResultList();
        return new ArrayList<>(list);
    }

    @Override
    public ArrayList<Food> findByCategory(Long categoryId) {
        List<Food> list = em.createQuery(
                "SELECT f FROM Food f WHERE f.category.id = :catId", Food.class)
                .setParameter("catId", categoryId)
                .getResultList();
        return new ArrayList<>(list);
    }

    @Override
    public Food findById(Long id) {
        return em.find(Food.class, id);
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
        
        return 0;
    }
}
