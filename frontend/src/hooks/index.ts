/**
 * @file hooks/index.ts
 * @description Export các "Consumer Hooks" đã được kết nối với Global Context.
 * Giúp các màn hình truy cập logic nghiệp vụ theo chuẩn Atomic.
 */

import { useUserProfile } from '../context/UserProfileContext';

/**
 * Hook quản lý Dinh dưỡng & Cân nặng (Từ Global Context)
 */
export const useNutrition = () => {
  const context = useUserProfile();
  return {
    userProfile: context.userProfile,
    totalEatenCalories: context.totalEatenCalories,
    totalEatenMacros: context.totalEatenMacros,
    addFood: context.addFood,
    updateCurrentWeight: context.updateCurrentWeight,
    addWater: context.addWater,
    bmr: context.bmr,
    tdee: context.tdee,
    bmi: context.bmi,
    macroTargets: context.macroTargets,
    getMacroTargets: context.getMacroTargets,
  };
};

/**
 * Hook quản lý Nhịn ăn (Từ Global Context)
 */
export const useFasting = () => {
  const context = useUserProfile();
  return {
    userProfile: context.userProfile,
    startFasting: context.startFasting,
    startEating: context.startEating,
    endFasting: context.endFasting,
    stopFastingLoop: context.stopFastingLoop,
    setFastingGoal: context.setFastingGoal,
  };
};

/**
 * Hook quản lý Thử thách vận động (Từ Global Context)
 */
export const useWorkout = () => {
  const context = useUserProfile();
  return {
    userProfile: context.userProfile,
    startWorkoutChallenge: context.startWorkoutChallenge,
    pauseWorkoutChallenge: context.pauseWorkoutChallenge,
    resumeWorkoutChallenge: context.resumeWorkoutChallenge,
    cancelWorkoutChallenge: context.cancelWorkoutChallenge,
    completeWorkoutChallenge: context.completeWorkoutChallenge,
  };
};

// Export các hooks gốc cho các trường hợp đặc biệt
export { useStorage } from './useStorage';
