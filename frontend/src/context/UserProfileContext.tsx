/**
 * @file UserProfileContext.tsx (Orchestrator)
 * @description Trái tim của hệ thống quản lý trạng thái NutriTrack.
 * Kết hợp tất cả các hooks chuyên biệt để cung cấp một API duy nhất cho ứng dụng.
 */

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Macros, DailyMeals, FoodItem } from '@/src/types';
import { useStorage } from '@/src/hooks/useStorage';
import { useNutrition } from '@/src/hooks/useNutrition';
import { getLocalToday } from '@/src/utils/dateFormatter';

type UserProfileContextType = {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  userId: number | null;
  token: string | null;
  login: (token: string, id: number) => Promise<void>;
  // Hành động
  addFood: (mealType: keyof DailyMeals, food: FoodItem) => void;
  updateCurrentWeight: (newWeight: number) => void;
  // Giá trị tính toán
  bmr: number;
  tdee: number;
  bmi: number;
  totalEatenCalories: number;
  totalEatenMacros: Macros;
  isLoaded: boolean;
  syncAllDataToCloud: () => any;
  fetchDiaryFromServer: (date: string) => Promise<void>;
  // Đăng xuất
  logout: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  // 1. Quản lý lưu trữ & state gốc
  const { userProfile, setUserProfile, isLoaded, logout: storageLogout } = useStorage();

  // 1.5 Auth State
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Khôi phục auth từ Storage
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedToken) setToken(storedToken);
        if (storedUserId) setUserId(Number(storedUserId));
      } catch (error) {
        console.error('Lỗi khi khôi phục auth:', error);
      }
    };
    loadAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (newToken: string, newId: number) => {
    try {
      setToken(newToken);
      setUserId(newId);
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('userId', newId.toString());
    } catch (error) {
      console.error('Lỗi khi lưu token:', error);
    }
  };

  // Rewrite logout
  const logout = useCallback(async () => {
    try {
      await storageLogout();
      setToken(null);
      setUserId(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  }, [storageLogout]);

  // 2. Logic nghiệp vụ chuyên biệt
  const nutrition = useNutrition(userProfile, setUserProfile, userId);

  // 3. Đồng bộ 2 chiều: Kéo dữ liệu khi khởi động
  useEffect(() => {
    if (isLoaded && userId) {
      const today = getLocalToday();
      nutrition.fetchDiaryFromServer(today);
    }
  }, [isLoaded, userId, nutrition.fetchDiaryFromServer]);

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
        carb: nutrition.totalEatenMacros.carb,
        fat: nutrition.totalEatenMacros.fat,
        foodHistory: userProfile.dailyMeals,
      }
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
    bmr: nutrition.bmr,
    tdee: nutrition.tdee,
    bmi: nutrition.bmi,
    totalEatenCalories: nutrition.totalEatenCalories,
    totalEatenMacros: nutrition.totalEatenMacros,
    fetchDiaryFromServer: nutrition.fetchDiaryFromServer,
    userId,
    token,
    login,
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
