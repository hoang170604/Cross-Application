package com.crossapplication.main.repository.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.MealLog;

@Repository
public interface MealLogRepository extends JpaRepository<MealLog, Long>{
    //Sửa lại kiểu dữ liệu.
    public List<MealLog> findByMealId(Long id);

    public void deleteByMealId(Long id);

    @Query("SELECT COALESCE(SUM(ml.calories),0) FROM MealLog ml WHERE ml.meal.user.id = :userId AND ml.meal.date = :date")
    double sumCaloriesByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(ml.protein),0) FROM MealLog ml WHERE ml.meal.user.id = :userId AND ml.meal.date = :date")
    double sumProteinByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(ml.carb),0) FROM MealLog ml WHERE ml.meal.user.id = :userId AND ml.meal.date = :date")
    double sumCarbByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(ml.fat),0) FROM MealLog ml WHERE ml.meal.user.id = :userId AND ml.meal.date = :date")
    double sumFatByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT DISTINCT ml FROM MealLog ml JOIN FETCH ml.meal m JOIN FETCH ml.food f LEFT JOIN FETCH f.category c "
            + "WHERE m.user.id = :userId AND m.date BETWEEN :start AND :end ORDER BY m.date ASC, m.mealType ASC, ml.id ASC")
    List<MealLog> findByUserIdAndMealDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);
}
