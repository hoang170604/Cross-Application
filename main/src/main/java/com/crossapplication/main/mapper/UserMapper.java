package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;

import com.crossapplication.main.dto.UserDTO;
import com.crossapplication.main.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDto(User user);

    @org.mapstruct.Mapping(target = "password", ignore = true)
    User toEntity(UserDTO dto);
}
