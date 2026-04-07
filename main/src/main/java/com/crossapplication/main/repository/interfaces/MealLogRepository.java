package com.crossapplication.main.repository.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.MealLog;

@Repository
public interface MealLogRepository extends JpaRepository<MealLog, Long>{
    //Sửa lại kiểu dữ liệu. 
    public List<MealLog> findByMealId(Long id);

    public void deleteByMealId(Long id);
}
