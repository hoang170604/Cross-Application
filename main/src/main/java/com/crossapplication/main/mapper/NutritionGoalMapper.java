package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.NutritionGoalDTO;
import com.crossapplication.main.entity.NutritionGoal;

@Mapper(componentModel = "spring")
public interface NutritionGoalMapper {
    NutritionGoalDTO toDto(NutritionGoal entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    NutritionGoal toEntity(NutritionGoalDTO dto);
}
