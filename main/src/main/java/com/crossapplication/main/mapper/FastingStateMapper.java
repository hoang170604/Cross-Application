package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.FastingStateDTO;
import com.crossapplication.main.entity.FastingState;

@Mapper(componentModel = "spring")
public interface FastingStateMapper {
    @org.mapstruct.Mapping(source = "user.id", target = "userId")
    @org.mapstruct.Mapping(target = "endTime", ignore = true)
    FastingStateDTO toDto(FastingState entity);

    @Mapping(target = "user", ignore = true)
    FastingState toEntity(FastingStateDTO dto);
}
