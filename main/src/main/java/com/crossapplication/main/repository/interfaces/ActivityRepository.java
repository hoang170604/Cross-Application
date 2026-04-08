package com.crossapplication.main.repository.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdAndLogDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(a.caloriesBurned),0) FROM Activity a WHERE a.user.id = :userId AND a.logDate = :logDate")
    double sumCaloriesByUserIdAndLogDate(@Param("userId") Long userId, @Param("logDate") LocalDate logDate);

    List<Activity> findByUserIdAndLogDate(Long userId, LocalDate logDate);
}
