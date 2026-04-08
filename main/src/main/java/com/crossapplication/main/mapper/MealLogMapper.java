package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;

import com.crossapplication.main.dto.MealLogDTO;
import com.crossapplication.main.entity.MealLog;

@Mapper(componentModel = "spring")
public interface MealLogMapper {
    MealLogDTO toDto(MealLog entity);

    @org.mapstruct.Mapping(target = "id", ignore = true)
    @org.mapstruct.Mapping(target = "food", ignore = true)
    @org.mapstruct.Mapping(target = "meal", ignore = true)
    MealLog toEntity(MealLogDTO dto);
}
