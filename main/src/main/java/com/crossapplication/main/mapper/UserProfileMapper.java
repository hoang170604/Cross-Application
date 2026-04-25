package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.UserProfileDTO;
import com.crossapplication.main.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfileDTO toDto(UserProfile entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "userId", ignore = true)
    UserProfile toEntity(UserProfileDTO dto);
}
