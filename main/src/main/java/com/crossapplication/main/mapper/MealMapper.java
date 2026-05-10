package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.crossapplication.main.dto.MealDTO;
import com.crossapplication.main.entity.Meal;

@Mapper(componentModel = "spring", uses = {MealLogMapper.class})
public interface MealMapper {

    @Mapping(target = "mealLogs", source = "mealLogs")
    MealDTO toDto(Meal entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "mealLogs", ignore = true)
    Meal toEntity(MealDTO dto);
}