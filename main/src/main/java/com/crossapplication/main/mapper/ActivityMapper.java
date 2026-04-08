package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.ActivityDTO;
import com.crossapplication.main.entity.Activity;
import com.crossapplication.main.entity.User;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    @Mapping(source = "user.id", target = "userId")
    ActivityDTO toDto(Activity entity);

    @Mapping(source = "userId", target = "user")
    Activity toEntity(ActivityDTO dto);

    default User map(Long userId) {
        if (userId == null) return null;
        User u = new User();
        u.setId(userId);
        return u;
    }
}
