package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;

import com.crossapplication.main.dto.MealDTO;
import com.crossapplication.main.entity.Meal;

@Mapper(componentModel = "spring")
public interface MealMapper {
    MealDTO toDto(Meal entity);

    @org.mapstruct.Mapping(target = "id", ignore = true)
    @org.mapstruct.Mapping(target = "user", ignore = true)
    Meal toEntity(MealDTO dto);
}
