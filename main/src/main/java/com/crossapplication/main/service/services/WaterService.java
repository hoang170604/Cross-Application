package com.crossapplication.main.service.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.WaterLog;
import com.crossapplication.main.repository.interfaces.WaterLogRepository;
import com.crossapplication.main.service.interfaces.WaterServiceInterface;

import jakarta.transaction.Transactional;

@Service
public class WaterService implements WaterServiceInterface {

    @Autowired
    private WaterLogRepository waterLogRepository;

    @Override
    @Transactional
    public WaterLog logWater(Long userId, LocalDateTime timestamp, double amountMl, String source, String externalId) {
        WaterLog w = new WaterLog();
        User u = new User();
        u.setId(userId);
        w.setUser(u);
        w.setLogDate(timestamp.toLocalDate());
        w.setAmountMl(amountMl);
        w.setSource(source);
        w.setExternalId(externalId);
        w.setCreatedAt(timestamp);
        return waterLogRepository.save(w);
    }

    @Override
    public double getDailyTotal(Long userId, LocalDate date) {
        return waterLogRepository.sumAmountByUserIdAndLogDate(userId, date);
    }

    @Override
    public List<WaterLog> getLogsBetween(Long userId, LocalDate start, LocalDate end) {
        return waterLogRepository.findByUserIdAndLogDateBetween(userId, start, end);
    }
}
