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
    bmr: context.bmr,
    tdee: context.tdee,
    bmi: context.bmi,
  };
};

// Export các hooks gốc cho các trường hợp đặc biệt
export { useStorage } from './useStorage';
