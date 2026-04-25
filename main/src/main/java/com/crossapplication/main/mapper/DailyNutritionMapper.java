package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;

import com.crossapplication.main.dto.DailyNutritionDTO;
import com.crossapplication.main.entity.DailyNutrition;

@Mapper(componentModel = "spring")
public interface DailyNutritionMapper {
    DailyNutritionDTO toDto(DailyNutrition entity);

    DailyNutrition toEntity(DailyNutritionDTO dto);
}
