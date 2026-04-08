package com.crossapplication.main.service.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.dto.ReportSummary;
import com.crossapplication.main.entity.DailyNutrition;
import com.crossapplication.main.entity.WeightLog;
import com.crossapplication.main.repository.interfaces.DailyNutritionRepository;
import com.crossapplication.main.repository.interfaces.WeightLogRepository;
import com.crossapplication.main.service.interfaces.ProgressService;

@Service
public class ProgressServiceImpl implements ProgressService {

    @Autowired
    private WeightLogRepository weightRepo;

    @Autowired
    private DailyNutritionRepository dailyRepo;

    @Override
    public List<WeightLog> getWeightHistory(Long userId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) return List.of();
        return weightRepo.findByUserIdAndDateBetweenOrderByDateAsc(userId, startDate, endDate);
    }

    @Override
    public List<DailyNutrition> getNutritionReport(Long userId, LocalDate startDate, LocalDate endDate) {
        return dailyRepo.findAllByUserIdAndDateBetween(userId, startDate, endDate);
    }

    @Override
    public WeightLog getLatestWeight(Long userId) {
        return weightRepo.findTopByUserIdOrderByDateDesc(userId);
    }

    @Override
    public WeightLog logWeight(Long userId, double weight, LocalDate date) {
        WeightLog existing = weightRepo.findByUserIdAndDate(userId, date);
        if (existing != null) {
            existing.setWeight(weight);
            return weightRepo.save(existing);
        }
        WeightLog w = new WeightLog();
        com.crossapplication.main.entity.User u = new com.crossapplication.main.entity.User();
        u.setId(userId);
        w.setUser(u);
        w.setWeight(weight);
        w.setDate(date);
        return weightRepo.save(w);
    }

    @Override
    public DailyNutrition getDailyNutrition(Long userId, LocalDate date) {
        Optional<DailyNutrition> opt = dailyRepo.findByUserIdAndDate(userId, date);
        return opt.orElseGet(() -> {
            DailyNutrition d = new DailyNutrition();
            d.setUserId(userId);
            d.setDate(date);
            d.setTotalCalories(0);
            d.setTotalProtein(0);
            d.setTotalCarb(0);
            d.setTotalFat(0);
            return d;
        });
    }

    @Override
    public ReportSummary getNutritionSummary(Long userId, LocalDate start, LocalDate end) {
        List<DailyNutrition> list = dailyRepo.findAllByUserIdAndDateBetween(userId, start, end);
        ReportSummary r = new ReportSummary();
        r.setUserId(userId);
        r.setStartDate(start);
        r.setEndDate(end);
        double totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
        for (DailyNutrition d : list) {
            totalCal += d.getTotalCalories();
            totalP += d.getTotalProtein();
            totalC += d.getTotalCarb();
            totalF += d.getTotalFat();
        }
        r.setTotalCalories(totalCal);
        int days = (int) (end.toEpochDay() - start.toEpochDay() + 1);
        r.setAverageCaloriesPerDay(days > 0 ? totalCal / days : 0);
        r.setTotalProtein(totalP);
        r.setTotalCarbs(totalC);
        r.setTotalFat(totalF);
        return r;
    }
}
