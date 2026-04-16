package com.crossapplication.main.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.dto.FastingSessionDTO;
import com.crossapplication.main.entity.FastingSession;

public interface FastingSessionService {
    FastingSession create(FastingSessionDTO dto);
    Optional<FastingSession> getById(Long id);
    List<FastingSession> listByUser(Long userId);
    FastingSession update(Long id, FastingSessionDTO dto);
    void delete(Long id);
}
