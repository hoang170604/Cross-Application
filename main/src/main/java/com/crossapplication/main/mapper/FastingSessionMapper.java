package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.FastingSessionDTO;
import com.crossapplication.main.entity.FastingSession;

@Mapper(componentModel = "spring")
public interface FastingSessionMapper {
    @org.mapstruct.Mapping(source = "user.id", target = "userId")
    FastingSessionDTO toDto(FastingSession entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    FastingSession toEntity(FastingSessionDTO dto);
}
