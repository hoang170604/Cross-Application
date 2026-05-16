import 'package:equatable/equatable.dart';
import 'package:flutterfrontend/domain/entities/user_profile_entity.dart';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();

  @override
  List<Object?> get props => [];
}

/// Event để lưu profile và tính nutrition goal
class SaveProfileEvent extends ProfileEvent {
  final UserProfileEntity profile;
  final int userId;
  final String goal;

  const SaveProfileEvent({
    required this.profile,
    required this.userId,
    required this.goal,
  });

  @override
  List<Object?> get props => [profile, userId, goal];
}

/// Event để load profile từ database
class LoadProfileEvent extends ProfileEvent {
  final int userId;

  const LoadProfileEvent({required this.userId});

  @override
  List<Object?> get props => [userId];
}

/// Event để clear profile
class ClearProfileEvent extends ProfileEvent {
  const ClearProfileEvent();
}
