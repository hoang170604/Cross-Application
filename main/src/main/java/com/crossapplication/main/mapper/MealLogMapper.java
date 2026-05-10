package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.crossapplication.main.dto.MealLogDTO;
import com.crossapplication.main.entity.MealLog;

@Mapper(componentModel = "spring")
public interface MealLogMapper {

    @Mapping(source = "food.id", target = "foodId")
    @Mapping(source = "meal.id", target = "mealId")
    @Mapping(source = "food.name", target = "foodName")
    @Mapping(source = "meal.mealType", target = "mealType")
    MealLogDTO toDto(MealLog entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "food", ignore = true)
    @Mapping(target = "meal", ignore = true)
    MealLog toEntity(MealLogDTO dto);
}
