package com.crossapplication.main.service.interfaces;

import java.util.Optional;

import com.crossapplication.main.dto.FastingStateDTO;

public interface FastingStateService {
    FastingStateDTO createOrUpdate(FastingStateDTO dto);
    Optional<FastingStateDTO> getByUserId(Long userId);
    void startFasting(Long userId, java.time.LocalDateTime startTime, Integer goalHours);
    void stopFasting(Long userId, java.time.LocalDateTime endTime);
}
