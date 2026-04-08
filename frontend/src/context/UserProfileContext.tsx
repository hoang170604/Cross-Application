/**
 * @file UserProfileContext.tsx (Orchestrator)
 * @description Trái tim của hệ thống quản lý trạng thái NutriTrack.
 * Kết hợp tất cả các hooks chuyên biệt để cung cấp một API duy nhất cho ứng dụng.
 */

import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { UserProfile, Macros, DailyMeals, FoodItem } from '@/src/types';
import { useStorage } from '@/src/hooks/useStorage';
import { useNutrition } from '@/src/hooks/useNutrition';
import { useFasting } from '@/src/hooks/useFasting';
import { useWorkout } from '@/src/hooks/useWorkout';
import * as NutritionUtils from '@/src/utils/calculateNutrition';
import { getLocalToday } from '@/src/utils/dateFormatter';

type UserProfileContextType = {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  // Hàm tính toán (Legacy/Onboarding)
  calculateFinalCalories: (profile: UserProfile) => number;
  calculateDuration: (profile: UserProfile) => number;
  getMacroTargets: (totalCal: number, goal: string) => Macros;
  // Hành động
  addFood: (mealType: keyof DailyMeals, food: FoodItem) => void;
  updateCurrentWeight: (newWeight: number) => void;
  startFasting: (goal: number) => void;
  startEating: () => void;
  endFasting: () => void;
  stopFastingLoop: () => void;
  setFastingGoal: (goal: number) => void;
  addWater: (amount: number) => void;
  // Vận động
  startWorkoutChallenge: (calorieTarget: number) => void;
  pauseWorkoutChallenge: () => void;
  resumeWorkoutChallenge: () => void;
  cancelWorkoutChallenge: () => void;
  completeWorkoutChallenge: () => void;
  // Giá trị tính toán
  bmr: number;
  tdee: number;
  bmi: number;
  macroTargets: Macros;
  totalEatenCalories: number;
  totalEatenMacros: Macros;
  isLoaded: boolean;
  syncAllDataToCloud: () => any;
  // Đăng xuất
  logout: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  // 1. Quản lý lưu trữ & state gốc
  const { userProfile, setUserProfile, isLoaded, logout } = useStorage();

  // 2. Logic nghiệp vụ chuyên biệt
  const nutrition = useNutrition(userProfile, setUserProfile);
  const fasting = useFasting(userProfile, setUserProfile);
  const workout = useWorkout(userProfile, setUserProfile);

  // 3. Đồng bộ hóa trạng thái Ngày mới
  useEffect(() => {
    if (!isLoaded) return;

    const todayStr = getLocalToday();
    const today = new Date(todayStr);

    setUserProfile((prev) => {
      const lastStr = prev.lastActiveDate;

      // Nếu đã là ngày hôm nay, không làm gì cả
      if (todayStr === lastStr) return prev;

      console.log(`[NutriTrack Reset] Phát hiện ngày mới: ${lastStr} -> ${todayStr}`);

      // Tính toán Streak
      let newStreak = prev.streakCount || 1;
      if (lastStr) {
        const lastDate = new Date(lastStr);
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      // RESET CÁC CHỈ SỐ HÀNG NGÀY
      return {
        ...prev,
        lastActiveDate: todayStr,
        streakCount: newStreak,
        waterIntake: 0,
        extraBurnedCalories: 0,
        dailyMeals: { breakfast: [], lunch: [], dinner: [], snack: [] }
      };
    });
  }, [isLoaded]);

  // 4. Logic đồng bộ hóa (Sync)
  const syncAllDataToCloud = useCallback(() => {
    const payload = {
      userStats: {
        weight: userProfile.currentWeight || userProfile.weight,
        height: userProfile.height,
        age: userProfile.age,
        gender: userProfile.gender,
        goal: userProfile.goal,
        activityLevel: userProfile.activityLevel,
        tdee: nutrition.tdee,
        bmr: nutrition.bmr,
        bmi: nutrition.bmi,
      },
      nutritionState: {
        totalCalories: nutrition.totalEatenCalories,
        protein: nutrition.totalEatenMacros.protein,
        carbs: nutrition.totalEatenMacros.carbs,
        fat: nutrition.totalEatenMacros.fat,
        foodHistory: userProfile.dailyMeals,
      },
      fastingState: {
        isFasting: userProfile.isFasting,
        currentState: userProfile.fastingState,
        fastingStartTime: userProfile.fastingStartTime,
        fastingGoal: userProfile.fastingGoal,
        fastingHistory: userProfile.fastingHistory,
      },
    };
    console.log('[NutriTrack Sync] Payload sẵn sàng gửi về API:', JSON.stringify(payload, null, 2));
    return payload;
  }, [userProfile, nutrition]);

  const value: UserProfileContextType = {
    userProfile,
    setUserProfile,
    isLoaded,
    syncAllDataToCloud,
    // Proxy functions to Hooks
    updateUserProfile: nutrition.updateUserProfile,
    addFood: nutrition.addFood,
    updateCurrentWeight: nutrition.updateCurrentWeight,
    addWater: nutrition.addWater,
    bmr: nutrition.bmr,
    tdee: nutrition.tdee,
    bmi: nutrition.bmi,
    macroTargets: nutrition.macroTargets,
    totalEatenCalories: nutrition.totalEatenCalories,
    totalEatenMacros: nutrition.totalEatenMacros,
    // Proxy functions to Fasting Hook
    startFasting: fasting.startFasting,
    startEating: fasting.startEating,
    endFasting: fasting.endFasting,
    stopFastingLoop: fasting.stopFastingLoop,
    setFastingGoal: fasting.setFastingGoal,
    // Proxy functions to Workout Hook
    startWorkoutChallenge: workout.startWorkoutChallenge,
    pauseWorkoutChallenge: workout.pauseWorkoutChallenge,
    resumeWorkoutChallenge: workout.resumeWorkoutChallenge,
    cancelWorkoutChallenge: workout.cancelWorkoutChallenge,
    completeWorkoutChallenge: workout.completeWorkoutChallenge,
    // Utils (Legacy support)
    calculateFinalCalories: NutritionUtils.calculateFinalCalories,
    calculateDuration: NutritionUtils.calculateDuration,
    getMacroTargets: NutritionUtils.getMacroTargets,
    // Đăng xuất
    logout,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
