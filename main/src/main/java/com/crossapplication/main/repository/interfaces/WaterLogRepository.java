package com.crossapplication.main.repository.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.WaterLog;

@Repository
public interface WaterLogRepository extends JpaRepository<WaterLog, Long> {
    List<WaterLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    @Query("SELECT COALESCE(SUM(w.amountMl),0) FROM WaterLog w WHERE w.user.id = :userId AND w.logDate = :logDate")
    double sumAmountByUserIdAndLogDate(@Param("userId") Long userId, @Param("logDate") LocalDate logDate);

    List<WaterLog> findByUserIdAndLogDateBetween(Long userId, LocalDate start, LocalDate end);
}
