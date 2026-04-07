package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;

import com.crossapplication.main.dto.UserDTO;
import com.crossapplication.main.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDto(User user);
    User toEntity(UserDTO dto);
}
