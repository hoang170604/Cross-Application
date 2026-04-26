import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DEFAULT_PROFILE, FoodItem, DailyMeals } from '../types';
import { getLocalToday } from '../core/dateFormatter';

// ─── API Service Imports (Layer-based) ───────────────────────────────
import * as diaryApi from '../api/diaryService';
import * as progressApi from '../api/progressService';
import * as userApi from '../api/userService';

// Cấu trúc hợp đồng dữ liệu cho Store
interface AppState {
  // Trạng thái giao diện
  isLoading: boolean;
  error: string | null;

  // Trạng thái xác thực & đồng bộ
  userId: number | null;
  token: string | null;
  pendingOnboardingSync: boolean;

  // Trạng thái Hồ sơ người dùng
  userProfile: UserProfile;

  // ─── Hoạt động thể chất (local, reset mỗi ngày) ─────────────────────
  activityCalories: number;
  lastActivityDate: string;
  loggedActivities: any[];

  // ─── App Preferences ────────────────────────────────────────────────
  theme: 'light' | 'dark';

  // Các hàm thiết lập nội bộ
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  setPendingSync: (val: boolean) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Theme
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Activity actions
  addActivityCalories: (kcal: number) => void;
  resetActivityCalories: () => void;
  resetActivityIfNewDay: () => void;
  addLoggedActivity: (activity: any) => void;
  removeLoggedActivity: (uid: string, cals: number) => void;

  // Các actions gọi API (Async)
  login: (token: string, userId: number) => Promise<void>;
  logout: () => Promise<void>;
  addFood: (mealType: keyof DailyMeals, food: FoodItem) => Promise<void>;
  updateCurrentWeight: (newWeight: number) => Promise<void>;
  fetchDiaryFromServer: (date: string) => Promise<void>;
  syncAllDataToCloud: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- Initial State ---
      isLoading: false,
      error: null,
      
      userId: null,
      token: null,
      pendingOnboardingSync: false,
      
      userProfile: DEFAULT_PROFILE,

      // ─── Activity State ─────────────────────────────────────────────
      activityCalories: 0,
      lastActivityDate: '',
      loggedActivities: [],

      // ─── App Preferences ────────────────────────────────────────────────
      theme: 'light' as 'light' | 'dark',

      // --- Sync Actions ---
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error: error }),
      setPendingSync: (val) => set({ pendingOnboardingSync: val }),
      updateUserProfile: (data) => set((state) => ({ userProfile: { ...state.userProfile, ...data } })),

      toggleTheme: () => set((state) => ({ theme: (state.theme === 'light' ? 'dark' : 'light') as 'light' | 'dark' })),
      setTheme: (theme) => set({ theme }),

      // ─── Activity Actions ─────────────────────────────────────────────────
      addActivityCalories: (kcal) => {
        const today = getLocalToday();
        set((state) => ({
          activityCalories: (state.lastActivityDate === today ? state.activityCalories : 0) + kcal,
          lastActivityDate: today,
        }));
      },

      resetActivityCalories: () => {
        set({ activityCalories: 0 });
      },

      resetActivityIfNewDay: () => {
        const today = getLocalToday();
        set((state) => {
          if (state.lastActivityDate !== today) {
            return { activityCalories: 0, lastActivityDate: today, loggedActivities: [] };
          }
          return {};
        });
      },

      addLoggedActivity: (activity) => {
        const today = getLocalToday();
        set((state) => {
          const isNewDay = state.lastActivityDate !== today;
          return {
            loggedActivities: isNewDay ? [activity] : [...state.loggedActivities, activity],
            activityCalories: (isNewDay ? 0 : state.activityCalories) + activity.caloriesBurned,
            lastActivityDate: today,
          };
        });
      },

      removeLoggedActivity: (uid, cals) => {
        set((state) => ({
          loggedActivities: state.loggedActivities.filter((a) => a.uid !== uid),
          activityCalories: Math.max(0, state.activityCalories - cals),
        }));
      },

      // --- Async API Actions ---
      login: async (token, userId) => {
        try {
          set({ isLoading: true, error: null });
          set({ token, userId });
        } catch (error: any) {
          set({ error: error.message || 'Lỗi đăng nhập' });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          set({ token: null, userId: null, userProfile: DEFAULT_PROFILE });
          await AsyncStorage.clear();
        } catch (error: any) {
          set({ error: error.message || 'Lỗi đăng xuất' });
        } finally {
          set({ isLoading: false });
        }
      },

      addFood: async (mealType, food) => {
        const { userId, userProfile } = get();
        if (!userId) return;

        try {
          set({ isLoading: true, error: null });
          const today = getLocalToday();

          // 1. Gọi API qua Service Layer
          const savedLog = await diaryApi.addFoodToMeal(userId, mealType, today, {
            foodId: food.id,
            quantity: food.quantity || 1,
            calories: food.calories,
            protein: food.protein,
            carb: food.carb,
            fat: food.fat
          });

          // 2. Cập nhật State
          const currentMeals = userProfile.dailyMeals || { breakfast: [], lunch: [], dinner: [], snack: [] };
          set({
            userProfile: {
              ...userProfile,
              dailyMeals: {
                ...currentMeals,
                [mealType]: [...currentMeals[mealType], savedLog || food]
              }
            }
          });
        } catch (error: any) {
          set({ error: error.message || 'Lỗi khi thêm thức ăn' });
          console.error('[Store] addFood error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateCurrentWeight: async (newWeight) => {
        const { userId, userProfile } = get();
        try {
          set({ isLoading: true, error: null });
          const today = getLocalToday();

          // 1. Cập nhật State Local trực tiếp (UX instant feedback)
          const history = userProfile.weightHistory || [];
          const existingIndex = history.findIndex(h => h.date === today);
          let newHistory = [...history];
          
          if (existingIndex >= 0) {
            newHistory[existingIndex] = { date: today, weight: newWeight };
          } else {
            newHistory.push({ date: today, weight: newWeight });
          }
          newHistory.sort((a, b) => a.date.localeCompare(b.date));

          set({
            userProfile: { ...userProfile, currentWeight: newWeight, weightHistory: newHistory }
          });

          // 2. Gọi API qua Service Layer
          if (userId) {
            await progressApi.logWeight(userId, today, newWeight);
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            set({ error: error.message || 'Lỗi khi cập nhật cân nặng' });
          } else {
             console.warn('API chưa sẵn sàng ở BE, dùng Local Data tạm thời');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      fetchDiaryFromServer: async (date) => {
        const { userId, userProfile } = get();
        if (!userId) return;

        try {
          set({ isLoading: true, error: null });

          // Gọi API qua Service Layer
          const data = await diaryApi.getDiary(userId, date);
          
          if (data) {
            set({ userProfile: { ...userProfile, dailyMeals: data } });
          }
        } catch (error: any) {
          if (error?.message?.includes('Network Error') || error.response?.status === 404) {
            console.warn('[NutriTrack] Server không phản hồi GET diary. Lấy tạm từ Local');
          } else {
            set({ error: error.message || 'Lỗi khi tải nhật ký' });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      syncAllDataToCloud: async () => {
        const { userId, userProfile } = get();
        if (!userId) return;

        try {
          set({ isLoading: true, error: null });
          
          // Gọi API qua Service Layer
          await userApi.updateProfileAndCalculateGoal(userId, {
            age: userProfile.age,
            gender: userProfile.gender,
            height: userProfile.height,
            weight: userProfile.currentWeight || userProfile.weight,
            activityLevel: userProfile.activityLevel,
            goal: userProfile.goal,
            name: userProfile.name,
            fastingGoal: userProfile.fastingGoal
          });
          
          set({ pendingOnboardingSync: false });
        } catch (error: any) {
          set({ error: error.message || 'Đồng bộ hóa dữ liệu thất bại' });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: '@nutritrack_state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userId: state.userId,
        token: state.token,
        pendingOnboardingSync: state.pendingOnboardingSync,
        userProfile: state.userProfile,
        activityCalories: state.activityCalories,
        lastActivityDate: state.lastActivityDate,
        theme: state.theme,
      }),
    }
  )
);
