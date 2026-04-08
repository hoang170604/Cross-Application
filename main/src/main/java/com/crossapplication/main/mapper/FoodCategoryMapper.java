package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;

import com.crossapplication.main.dto.FoodCategoryDTO;
import com.crossapplication.main.entity.FoodCategory;

@Mapper(componentModel = "spring")
public interface FoodCategoryMapper {
    FoodCategoryDTO toDto(FoodCategory entity);

    @org.mapstruct.Mapping(target = "id", ignore = true)
    FoodCategory toEntity(FoodCategoryDTO dto);
}
