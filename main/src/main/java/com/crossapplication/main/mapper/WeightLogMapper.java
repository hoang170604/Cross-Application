package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.WeightLogDTO;
import com.crossapplication.main.entity.WeightLog;
import com.crossapplication.main.entity.User;

@Mapper(componentModel = "spring")
public interface WeightLogMapper {
    @Mapping(source = "user.id", target = "userId")
    WeightLogDTO toDto(WeightLog entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "userId", target = "user")
    WeightLog toEntity(WeightLogDTO dto);

    default User map(Long userId) {
        if (userId == null) return null;
        User u = new User();
        u.setId(userId);
        return u;
    }
}
