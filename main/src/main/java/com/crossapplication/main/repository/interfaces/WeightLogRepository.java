package com.crossapplication.main.repository.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.WeightLog;

@Repository
public interface WeightLogRepository extends JpaRepository<WeightLog, Long>{
    
    public List<WeightLog> findByUserIdOrderByDateAsc(Long userId);

    public List<WeightLog> findByUserIdAndDateBetweenOrderByDateAsc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

    public WeightLog findByUserIdAndDate(Long userId, LocalDate date);

    public WeightLog findTopByUserIdOrderByDateDesc(Long userId);

    public void deleteByUserId(Long userId);
}
