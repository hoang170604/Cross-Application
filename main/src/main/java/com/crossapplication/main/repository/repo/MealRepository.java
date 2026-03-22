package com.crossapplication.main.repository.repo;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.repository.interfaces.MealRepositoryInterface;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class MealRepository implements MealRepositoryInterface{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Meal> finByDateAndMealType(Date date, String mealType) {
        
        return null;
    }

    @Override
    public List<Meal> findByUserIdAndDate(Long userId, Date date) {
        String jpql = "SELECT m FROM Meal m WHERE m.user.id = :userId AND m.date = :date";

        return entityManager.createQuery(jpql, Meal.class)
                .setParameter("userId", userId)
                .setParameter("date", date)
                .getResultList();
    }

    @Override
    public List<Meal> findByUserIdAndMealType(Long userId, String mealType) {
        String jpql = "SELECT m FROM Meal m WHERE m.user.id = :userId AND m.mealType = :mealType";

        return entityManager.createQuery(jpql, Meal.class)
                .setParameter("userId", userId)
                .setParameter("mealType", mealType)
                .getResultList();
    }

    @Override
    public Meal save(Meal meal) {
        if (meal.getId() == null) {
            entityManager.persist(meal);
            return meal;
        } else {
            return entityManager.merge(meal);
        }
    }
}
