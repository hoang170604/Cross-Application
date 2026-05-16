import 'package:equatable/equatable.dart';
import 'package:flutterfrontend/domain/entities/nutrition_goal_entity.dart';

abstract class ProfileState extends Equatable {
  const ProfileState();

  @override
  List<Object?> get props => [];
}

/// Initial state
class ProfileInitial extends ProfileState {
  const ProfileInitial();
}

/// Loading state
class ProfileLoading extends ProfileState {
  const ProfileLoading();
}

/// Success state - profile đã được lưu
class ProfileSaved extends ProfileState {
  final NutritionGoalEntity nutritionGoal;

  const ProfileSaved({required this.nutritionGoal});

  @override
  List<Object?> get props => [nutritionGoal];
}

/// Success state - profile đã được load
class ProfileLoaded extends ProfileState {
  final NutritionGoalEntity nutritionGoal;

  const ProfileLoaded({required this.nutritionGoal});

  @override
  List<Object?> get props => [nutritionGoal];
}

/// Failure state
class ProfileFailure extends ProfileState {
  final String message;
  final Exception? exception;

  const ProfileFailure({
    required this.message,
    this.exception,
  });

  @override
  List<Object?> get props => [message, exception];
}

/// Clear state
class ProfileCleared extends ProfileState {
  const ProfileCleared();
}
