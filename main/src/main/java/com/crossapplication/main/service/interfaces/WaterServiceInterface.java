package com.crossapplication.main.service.interfaces;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.crossapplication.main.dto.WaterLogDTO;

public interface WaterServiceInterface {
    public WaterLogDTO logWater(Long userId, LocalDateTime timestamp, double amountMl, String source, String externalId);

    public double getDailyTotal(Long userId, LocalDate date);

    public List<WaterLogDTO> getLogsBetween(Long userId, LocalDate start, LocalDate end);
}
