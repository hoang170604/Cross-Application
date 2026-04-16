package com.crossapplication.main.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.WorkoutChallenge;

@Mapper(componentModel = "spring")
public interface WorkoutChallengeMapper {
    @org.mapstruct.Mapping(source = "user.id", target = "userId")
    WorkoutChallengeDTO toDto(WorkoutChallenge entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    WorkoutChallenge toEntity(WorkoutChallengeDTO dto);
}
