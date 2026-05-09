package com.crossapplication.main.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.dto.FastingSessionDTO;

public interface FastingSessionService {
    FastingSessionDTO create(FastingSessionDTO dto);
    Optional<FastingSessionDTO> getById(Long id);
    List<FastingSessionDTO> listByUser(Long userId);
    FastingSessionDTO update(Long id, FastingSessionDTO dto);
    void delete(Long id);
}
