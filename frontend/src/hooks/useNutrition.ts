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
    if (store.dailyNutrition) {
      return {
        totalEatenCalories: store.dailyNutrition.totalCalories || 0,
        totalEatenMacros: {
          carb: store.dailyNutrition.totalCarb || 0,
          protein: store.dailyNutrition.totalProtein || 0,
          fat: store.dailyNutrition.totalFat || 0,
        }
      };
    }
    // Fallback khi chưa có dữ liệu từ server
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
  }, [userProfile.dailyMeals, store.dailyNutrition]);

  return {
    ...store,
    bmr,
    tdee,
    bmi,
    totalEatenCalories,
    totalEatenMacros,
  };
}

