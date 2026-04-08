package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.WaterLogDTO;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.WaterLog;

@Mapper(componentModel = "spring")
public interface WaterLogMapper {
    @Mapping(source = "user.id", target = "userId")
    WaterLogDTO toDto(WaterLog entity);

    @Mapping(source = "userId", target = "user")
    WaterLog toEntity(WaterLogDTO dto);

    default User map(Long userId) {
        if (userId == null) return null;
        User u = new User();
        u.setId(userId);
        return u;
    }
}
