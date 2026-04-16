package com.crossapplication.main.service.interfaces;

import java.util.Optional;

import com.crossapplication.main.dto.FastingStateDTO;
import com.crossapplication.main.entity.FastingState;

public interface FastingStateService {
    FastingState createOrUpdate(FastingStateDTO dto);
    Optional<FastingState> getByUserId(Long userId);
    void startFasting(Long userId, java.time.LocalDateTime startTime, Integer goalHours);
    void stopFasting(Long userId, java.time.LocalDateTime endTime);
}
