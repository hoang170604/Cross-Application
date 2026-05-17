import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutterfrontend/domain/usecases/user_usecase.dart';
import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final UserUsecase userUsecase;

  ProfileBloc({required this.userUsecase}) : super(const ProfileInitial()) {
    on<SaveProfileEvent>(_onSaveProfileEvent);
    on<LoadProfileEvent>(_onLoadProfileEvent);
    on<ClearProfileEvent>(_onClearProfileEvent);
  }

  /// Handle save profile event
  Future<void> _onSaveProfileEvent(
    SaveProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(const ProfileLoading());

    try {
      // Call usecase to save profile and calculate nutrition goal
      final nutritionGoal = await userUsecase.updateProfileAndCalculateGoal(
        event.userId,
        event.profile,
      );

      if (nutritionGoal != null) {
        emit(ProfileSaved(nutritionGoal: nutritionGoal));
      } else {
        emit(
          const ProfileFailure(
            message: 'Lỗi: Không thể tính toán mục tiêu dinh dưỡng',
          ),
        );
      }
    } catch (e) {
      emit(
        ProfileFailure(
          message: 'Lỗi: ${e.toString()}',
          exception: e as Exception,
        ),
      );
    }
  }

  /// Handle load profile event
  Future<void> _onLoadProfileEvent(
    LoadProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(const ProfileLoading());

    try {
      final nutritionGoal = await userUsecase.getNutritionGoal(event.userId);

      if (nutritionGoal != null) {
        emit(ProfileLoaded(nutritionGoal: nutritionGoal));
      } else {
        emit(
          const ProfileFailure(
            message: 'Lỗi: Không tìm thấy mục tiêu dinh dưỡng',
          ),
        );
      }
    } catch (e) {
      emit(
        ProfileFailure(
          message: 'Lỗi: ${e.toString()}',
          exception: e as Exception,
        ),
      );
    }
  }

  /// Handle clear profile event
  Future<void> _onClearProfileEvent(
    ClearProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(const ProfileCleared());
  }
}
