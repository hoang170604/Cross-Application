package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.crossapplication.main.entity.WaterLog;

public interface WaterServiceInterface {
    public WaterLog logWater(Long userId, LocalDateTime timestamp, double amountMl, String source, String externalId);

    public double getDailyTotal(Long userId, LocalDate date);

    public List<WaterLog> getLogsBetween(Long userId, LocalDate start, LocalDate end);
}
