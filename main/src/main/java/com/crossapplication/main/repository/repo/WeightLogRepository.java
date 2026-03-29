package com.crossapplication.main.repository.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.WeightLog;

@Repository
public interface WeightLogRepository extends JpaRepository<WeightLog, Integer>{
    
    List<WeightLog> findByUserIdOrderByDateAsc(int userId);

    List<WeightLog> findByUserIdAndDateBetweenOrderByDateAsc(
            int userId,
            LocalDate startDate,
            LocalDate endDate
    );

    WeightLog findByUserIdAndDate(int userId, LocalDate date);

    WeightLog findTopByUserIdOrderByDateDesc(int userId);

    void deleteByUserId(int userId);
}
