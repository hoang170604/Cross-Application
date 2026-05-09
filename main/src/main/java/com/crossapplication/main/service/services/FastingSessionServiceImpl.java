package com.crossapplication.main.service.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.FastingSessionDTO;
import com.crossapplication.main.entity.FastingSession;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.mapper.FastingSessionMapper;
import com.crossapplication.main.repository.interfaces.FastingSessionRepository;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.FastingSessionService;

@Service
public class FastingSessionServiceImpl implements FastingSessionService {

    @Autowired
    private FastingSessionRepository fastingSessionRepository;

    @Autowired
    private UserRepositoryInterface userRepository;

    @Autowired
    private FastingSessionMapper fastingSessionMapper;

    @Override
    @Transactional
    public FastingSessionDTO create(FastingSessionDTO dto) {
        if (dto.getUserId() == null) throw new IllegalArgumentException("userId required");
        User u = userRepository.findById(dto.getUserId()).orElseThrow(() -> new IllegalArgumentException("user not found"));
        FastingSession e = fastingSessionMapper.toEntity(dto);
        e.setUser(u);
        FastingSession saved = fastingSessionRepository.save(e);
        return fastingSessionMapper.toDto(saved);
    }

    @Override
    public Optional<FastingSessionDTO> getById(Long id) {
        return fastingSessionRepository.findById(id)
            .map(fastingSessionMapper::toDto);
    }

    @Override
    public List<FastingSessionDTO> listByUser(Long userId) {
        return fastingSessionRepository.findByUserId(userId)
            .stream()
            .map(fastingSessionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional
    public FastingSessionDTO update(Long id, FastingSessionDTO dto) {
        FastingSession e = fastingSessionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("not found"));
        if (dto.getStartTime() != null) e.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) e.setEndTime(dto.getEndTime());
        if (dto.getDurationMinutes() != null) e.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getIsCompleted() != null) e.setIsCompleted(dto.getIsCompleted());
        FastingSession saved = fastingSessionRepository.save(e);
        return fastingSessionMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        fastingSessionRepository.deleteById(id);
    }
}
