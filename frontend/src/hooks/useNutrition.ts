/**
 * @file useNutrition.ts
 * @description Hook quản lý logic nghiệp vụ tính toán (Selectors) dựa trên Global Store Zustand.
 */

import { useMemo } from 'react';
import { useAppStore } from '@/src/store/useAppStore';
import { calculateBMI } from '@/src/core/calculateNutrition';
import { getLocalToday } from '@/src/core/dateFormatter';
import apiClient from '@/src/api/apiClient';

/**
 * Hook quản lý logic nghiệp vụ tính toán Dinh dưỡng (Nutrition Business Logic).
 * Tuân thủ chuẩn "Custom Hook Pattern": Tách biệt hoàn toàn Logic và UI.
 */
export function useNutrition() {
  const { 
    userProfile, 
    dailyNutrition, 
    activityCalories, // Lấy từ store để tính toán calo còn lại
    logWeight
  } = useAppStore();

  // ─── Macro & Calorie Calculations ───────────────────────────────────
  const { totalEatenCalories, totalEatenMacros } = useMemo(() => {
    if (dailyNutrition) {
      return {
        totalEatenCalories: dailyNutrition.totalCalories || 0,
        totalEatenMacros: {
          carb: dailyNutrition.totalCarb || 0,
          protein: dailyNutrition.totalProtein || 0,
          fat: dailyNutrition.totalFat || 0,
        }
      };
    }
    // Fallback: Tính toán thủ công từ danh sách món ăn nếu server chưa trả về summary
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
  }, [userProfile.dailyMeals, dailyNutrition]);

  // ─── Display Stats (Calorie Circle logic) ──────────────────────────
  const calorieStats = useMemo(() => {
    const target = userProfile.targetCalories || 2000;
    const consumed = totalEatenCalories;
    const burned = activityCalories || 0;
    const budget = target + burned; // Tổng ngân sách calo trong ngày
    const remaining = budget - consumed;
    
    return {
      target,
      consumed,
      burned,
      budget,
      remaining: Math.abs(remaining),
      isOver: remaining < 0,
      progress: Math.min(1, consumed / Math.max(1, budget)),
    };
  }, [userProfile.targetCalories, totalEatenCalories, activityCalories]);

  const bmr = useMemo(() => {
    const { weight, height, age, gender } = userProfile;
    if (!weight || !height || !age) return 0;
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  }, [userProfile.weight, userProfile.height, userProfile.age, userProfile.gender]);

  const bmi = useMemo(() => 
    calculateBMI(userProfile.currentWeight || userProfile.weight, userProfile.height),
  [userProfile.currentWeight, userProfile.weight, userProfile.height]);

  return {
    // Data
    userProfile,
    totalEatenMacros,
    
    // Computed Stats
    calorieStats,
    bmr,
    bmi,
    
    // Meal Specific Stats
    mealStats: useMemo(() => {
      const config = [
        { id: 'breakfast', name: 'Bữa sáng', emoji: '🍳', targetRatio: 0 },
        { id: 'lunch', name: 'Bữa trưa', emoji: '🍝', targetRatio: 0.4 },
        { id: 'dinner', name: 'Bữa tối', emoji: '🥗', targetRatio: 0.4 },
        { id: 'snack', name: 'Đồ ăn vặt', emoji: '🥨', targetRatio: 0 },
      ];

      return config.map(meal => {
        const items = userProfile.dailyMeals?.[meal.id as keyof typeof userProfile.dailyMeals] || [];
        const consumed = items.reduce((sum, item) => sum + item.calories, 0);
        const target = meal.targetRatio ? Math.round(calorieStats.target * meal.targetRatio) : 0;
        const progress = target > 0 ? Math.min(consumed / target, 1) : 0;
        const foodNames = items.map(i => i.name).join(', ');

        return {
          ...meal,
          consumed,
          target,
          progress,
          foodNames
        };
      });
    }, [userProfile.dailyMeals, calorieStats.target]),

    // Actions
    logWeight
  };
}


