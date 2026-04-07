/**
 * @file useWorkout.ts
 * @description Hook quản lý logic nghiệp vụ Vận động bổ sung (Workout Challenge).
 * Xử lý các trạng thái bắt đầu, tạm dừng, tiếp tục, hủy bỏ và hoàn thành thử thách.
 */

import { useCallback } from 'react';
import { UserProfile } from '@/src/types';

/**
 * Hook tùy chỉnh để thực hiện các hành động vận động trên State.
 * 
 * @param {UserProfile} userProfile - Trạng thái hồ sơ hiện tại.
 * @param {React.Dispatch<React.SetStateAction<UserProfile>>} setUserProfile - Hàm cập nhật state profile.
 */
export function useWorkout(
  userProfile: UserProfile,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
) {
  /** Bắt đầu thử thách vận động */
  const startWorkoutChallenge = useCallback((calorieTarget: number) => {
    setUserProfile(prev => {
      // 100 kcal = 20 phút (1200000 ms)
      const minutes = Math.ceil((calorieTarget / 100) * 20);
      return {
        ...prev,
        workoutChallenge: {
          isActive: true,
          isPaused: false,
          targetMs: minutes * 60 * 1000,
          accumulatedMs: 0,
          lastResumeTime: Date.now(),
          calorieTarget
        }
      };
    });
  }, [setUserProfile]);

  /** Tạm dừng thử thách */
  const pauseWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => {
      if (!prev.workoutChallenge || !prev.workoutChallenge.isActive || prev.workoutChallenge.isPaused) return prev;
      const now = Date.now();
      const elapsed = now - prev.workoutChallenge.lastResumeTime;
      return {
        ...prev,
        workoutChallenge: {
          ...prev.workoutChallenge,
          isPaused: true,
          accumulatedMs: prev.workoutChallenge.accumulatedMs + elapsed
        }
      };
    });
  }, [setUserProfile]);

  /** Tiếp tục thử thách */
  const resumeWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => {
      if (!prev.workoutChallenge || !prev.workoutChallenge.isActive || !prev.workoutChallenge.isPaused) return prev;
      return {
        ...prev,
        workoutChallenge: {
          ...prev.workoutChallenge,
          isPaused: false,
          lastResumeTime: Date.now()
        }
      };
    });
  }, [setUserProfile]);

  /** Hủy bỏ thử thách */
  const cancelWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      workoutChallenge: undefined
    }));
  }, [setUserProfile]);

  /** Hoàn thành thử thách (cộng Calo đã đốt vào hồ sơ) */
  const completeWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => {
      if (!prev.workoutChallenge) return prev;
      return {
        ...prev,
        extraBurnedCalories: (prev.extraBurnedCalories || 0) + prev.workoutChallenge.calorieTarget,
        workoutChallenge: undefined
      };
    });
  }, [setUserProfile]);

  return {
    startWorkoutChallenge,
    pauseWorkoutChallenge,
    resumeWorkoutChallenge,
    cancelWorkoutChallenge,
    completeWorkoutChallenge
  };
}
