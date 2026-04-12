/**
 * @file useNutrition.ts
 * @description Hook quản lý logic nghiệp vụ về Dinh dưỡng và Cân nặng.
 * Bao gồm các hành động: thêm món ăn, uống nước, và tính toán chỉ số.
 */

import { useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, FoodItem, DailyMeals, Macros } from '@/src/types';
import { 
  calculateBMI 
} from '@/src/utils/calculateNutrition';
import { getLocalToday } from '@/src/utils/dateFormatter';
import apiClient from '@/src/api/apiClient';

const STORAGE_KEY = '@nutritrack_state';

/**
 * Hook tùy chỉnh để thực hiện các hành động dinh dưỡng trên State.
 * 
 * @param {UserProfile} userProfile - Trạng thái hồ sơ hiện tại.
 * @param {React.Dispatch<React.SetStateAction<UserProfile>>} setUserProfile - Hàm cập nhật state profile.
 */
export function useNutrition(
  userProfile: UserProfile,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
  userId: number | null = null
) {
  // ─── Computed Values (Memoized logic) ───────────────────────────────────

  /** BMR (Basal Metabolic Rate) - Hiện tại BE không trả về nhánh riêng nên đặt là 0 hoặc ẩn đi trên UI */
  const bmr = 0;

  /** TDEE (Total Daily Energy Expenditure) - Sử dụng trực tiếp từ targetCalories BE trả về */
  const tdee = userProfile.targetCalories || 0;

  /** BMI (Body Mass Index) */
  const bmi = useMemo(() => 
    calculateBMI(userProfile.currentWeight || userProfile.weight, userProfile.height),
  [userProfile.currentWeight, userProfile.weight, userProfile.height]);

  /** Tổng lượng Calo và Macros đã ăn */
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

  /** Cập nhật cân nặng hiện tại và ghi lịch sử (Lỗi #14) */
  const updateCurrentWeight = useCallback(async (newWeight: number) => {
    const today = getLocalToday();
    
    // 1. Luôn lưu vào Local trước (Fallback)
    setUserProfile((prev) => {
      const history = prev.weightHistory || [];
      const existingIndex = history.findIndex(h => h.date === today);
      
      let newHistory = [...history];
      if (existingIndex >= 0) {
        newHistory[existingIndex] = { date: today, weight: newWeight };
      } else {
        newHistory.push({ date: today, weight: newWeight });
      }
      newHistory.sort((a, b) => a.date.localeCompare(b.date));

      return {
        ...prev,
        currentWeight: newWeight,
        weightHistory: newHistory
      };
    });

    // 2. Gọi API thầm lặng (Graceful Fallback - Lỗi #14)
    if (userId) {
        try {
            await apiClient.post('/api/progress/weight', {
                userId,
                date: today,
                weight: newWeight
            });
        } catch (error: any) {
            if (error.response?.status === 404) {
                 console.warn('API chưa sẵn sàng ở BE, dùng Local Data');
            }
        }
    }
  }, [setUserProfile, userId]);

  /** Ghi nhận lượng nước (Lỗi #13) */
  const logWater = useCallback(async (amountMl: number) => {
      const today = getLocalToday();
      try {
          // Chỉ gọi API, vì local state Profile hiện đã "gọt" bỏ dailyWater 
          // theo yêu cầu chuẩn hóa Backend (Lỗi #13)
          await apiClient.post('/api/water', {
              amountMl,
              logDate: today
          });
          console.log(`[NutriTrack] Đã ghi nhận ${amountMl}ml nước lên Server.`);
      } catch (error: any) {
          if (error.response?.status === 404) {
               console.warn('API chưa sẵn sàng ở BE, dùng Local Data');
          }
      }
  }, []);

  /** Đồng bộ 2 chiều: Kéo dữ liệu từ Backend khi khởi động */
  const fetchDiaryFromServer = useCallback(async (date: string) => {
      if (!userId) return;
      try {
          const response = await apiClient.get(`/api/diary/users/${userId}?date=${date}`);
          if (response.data) {
              // Ghi đè Local State bằng data từ Backend
              setUserProfile((prev) => ({
                  ...prev,
                  dailyMeals: response.data
              }));
          }
      } catch (error: any) {
          if (error.response?.status === 404 || error.message?.includes('Network Error')) {
              console.warn("Không lấy được data từ BE, dùng Local");
          } else {
              console.error("Lỗi khi kéo dữ liệu Diary:", error);
          }
      }
  }, [userId, setUserProfile]);

  return {
    bmr,
    tdee,
    bmi,
    totalEatenCalories,
    totalEatenMacros,
    updateUserProfile,
    addFood,
    updateCurrentWeight,
    logWater,
    fetchDiaryFromServer
  };
}
