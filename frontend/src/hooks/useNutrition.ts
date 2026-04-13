/**
 * @file useNutrition.ts
 * @description Hook quản lý logic nghiệp vụ tính toán (Selectors) dựa trên Global Store Zustand.
 */

import { useMemo } from 'react';
import { useAppStore } from '@/src/store/useAppStore';
import { calculateBMI } from '@/src/core/calculateNutrition';
import { getLocalToday } from '@/src/core/dateFormatter';
import apiClient from '@/src/api/apiClient';

export function useNutrition() {
  const store = useAppStore();
  const { userProfile } = store;

  // ─── Computed Values (Memoized logic) ───────────────────────────────────
  const bmr = useMemo(() => {
    const { weight, height, age, gender } = userProfile;
    if (!weight || !height || !age) return 0;
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  }, [userProfile.weight, userProfile.height, userProfile.age, userProfile.gender]);

  const tdee = userProfile.targetCalories || 0;

  const bmi = useMemo(() => 
    calculateBMI(userProfile.currentWeight || userProfile.weight, userProfile.height),
  [userProfile.currentWeight, userProfile.weight, userProfile.height]);

  const { totalEatenCalories, totalEatenMacros } = useMemo(() => {
    const meals = userProfile.dailyMeals || { breakfast: [], lunch: [], dinner: [], snack: [] };
    const allFoods = Object.values(meals).flat();
    return {
      totalEatenCalories: allFoods.reduce((sum, item) => sum + item.calories, 0),
      totalEatenMacros: {
        carb: allFoods.reduce((sum, item) => sum + (item.carb || 0), 0),
        protein: allFoods.reduce((sum, item) => sum + (item.protein || 0), 0),
        fat: allFoods.reduce((sum, item) => sum + (item.fat || 0), 0),
      }
    };
  }, [userProfile.dailyMeals]);

  // ─── Tương thích ngược: Hành động không nằm trong Store cốt lõi ─────────
  const logWater = async (amountMl: number) => {
      try {
          const today = getLocalToday();
          await apiClient.post('/api/water', { amountMl, logDate: today });
      } catch (error: any) {
          console.warn('API Nước chưa hoàn thiện, lỗi:', error.message);
      }
  };

  return {
    ...store,
    bmr,
    tdee,
    bmi,
    totalEatenCalories,
    totalEatenMacros,
    logWater
  };
}

