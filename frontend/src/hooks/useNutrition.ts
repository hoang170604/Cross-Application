/**
 * @file useNutrition.ts
 * @description Hook quản lý logic nghiệp vụ về Dinh dưỡng và Cân nặng.
 * Bao gồm các hành động: thêm món ăn, uống nước, và tính toán chỉ số.
 */

import { useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, FoodItem, DailyMeals, Macros } from '@/src/types';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateBMI, 
  getMacroTargets 
} from '@/src/utils/calculateNutrition';
import { getLocalToday } from '@/src/utils/dateFormatter';

const STORAGE_KEY = '@nutritrack_state';

/**
 * Hook tùy chỉnh để thực hiện các hành động dinh dưỡng trên State.
 * 
 * @param {UserProfile} userProfile - Trạng thái hồ sơ hiện tại.
 * @param {React.Dispatch<React.SetStateAction<UserProfile>>} setUserProfile - Hàm cập nhật state profile.
 */
export function useNutrition(
  userProfile: UserProfile,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
) {
  // ─── Computed Values (Memoized logic) ───────────────────────────────────

  /** BMR (Basal Metabolic Rate) */
  const bmr = useMemo(() => 
    calculateBMR(userProfile.gender, userProfile.weight, userProfile.height, userProfile.age),
  [userProfile.gender, userProfile.weight, userProfile.height, userProfile.age]);

  /** TDEE (Total Daily Energy Expenditure) */
  const tdee = useMemo(() => 
    calculateTDEE(bmr, userProfile.activityLevel, userProfile.goal, userProfile.isPregnant),
  [bmr, userProfile.activityLevel, userProfile.goal, userProfile.isPregnant]);

  /** BMI (Body Mass Index) */
  const bmi = useMemo(() => 
    calculateBMI(userProfile.currentWeight || userProfile.weight, userProfile.height),
  [userProfile.currentWeight, userProfile.weight, userProfile.height]);

  /** Macro Targets */
  const macroTargets = useMemo((): Macros => 
    getMacroTargets(tdee, userProfile.goal),
  [tdee, userProfile.goal]);

  /** Tổng lượng Calo và Macros đã ăn */
  const { totalEatenCalories, totalEatenMacros } = useMemo(() => {
    const meals = userProfile.dailyMeals || { breakfast: [], lunch: [], dinner: [], snack: [] };
    const allFoods = Object.values(meals).flat();
    return {
      totalEatenCalories: allFoods.reduce((sum, item) => sum + item.calories, 0),
      totalEatenMacros: {
        carbs: allFoods.reduce((sum, item) => sum + (item.carbs || 0), 0),
        protein: allFoods.reduce((sum, item) => sum + (item.protein || 0), 0),
        fat: allFoods.reduce((sum, item) => sum + (item.fat || 0), 0),
      }
    };
  }, [userProfile.dailyMeals]);

  // ─── Actions ────────────────────────────────────────────────────────────

  /** Cập nhật một phần hồ sơ người dùng */
  const updateUserProfile = useCallback((data: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...data };
      // Ghi trực tiếp vào bộ nhớ để đồng bộ hóa Onboarding
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(e => 
        console.warn('[NutriTrack] Lỗi khi ghi AsyncStorage tức thì:', e)
      );
      return next;
    });
  }, [setUserProfile]);

  /** Thêm món ăn mới */
  const addFood = useCallback((mealType: keyof DailyMeals, food: FoodItem) => {
    setUserProfile((prev) => {
      const currentMeals = prev.dailyMeals || { breakfast: [], lunch: [], dinner: [], snack: [] };
      return {
        ...prev,
        dailyMeals: {
          ...currentMeals,
          [mealType]: [...currentMeals[mealType], food]
        }
      };
    });
  }, [setUserProfile]);

  /** Cập nhật cân nặng hiện tại */
  const updateCurrentWeight = useCallback((newWeight: number) => {
    setUserProfile((prev) => ({
      ...prev,
      currentWeight: newWeight
    }));
  }, [setUserProfile]);

  /** Thêm nước uống */
  const addWater = useCallback((amount: number) => {
    setUserProfile(prev => {
      const todayStr = getLocalToday();
      let newIntake = (prev.waterIntake || 0) + amount;
      
      // Reset nếu sang ngày mới
      if (prev.lastWaterDate !== todayStr) {
        newIntake = amount;
      }

      return {
        ...prev,
        waterIntake: newIntake,
        lastWaterDate: todayStr
      };
    });
  }, [setUserProfile]);

  return {
    bmr,
    tdee,
    bmi,
    macroTargets,
    totalEatenCalories,
    totalEatenMacros,
    updateUserProfile,
    addFood,
    updateCurrentWeight,
    addWater
  };
}
