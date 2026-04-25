package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.FoodDTO;
import com.crossapplication.main.entity.Food;

@Mapper(componentModel = "spring")
public interface FoodMapper {
    FoodDTO toDTO(Food entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    Food toEntity(FoodDTO dto);
}
