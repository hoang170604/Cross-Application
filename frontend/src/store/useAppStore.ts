import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DEFAULT_PROFILE, FoodItem, DailyMeals, WorkoutChallenge, DailyNutrition, ActivityTypeInfo } from '../types';
import { getLocalToday } from '../core/dateFormatter';
import { calculateNutritionalGoals } from '../core/calculateNutrition';

// ─── API Service Imports (Layer-based) ────────────────────────────────────
import * as diaryApi from '../api/diaryService';
import * as progressApi from '../api/progressService';
import * as userApi from '../api/userService';
import * as workoutApi from '../api/workoutService';

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
  activityTypes: ActivityTypeInfo[];

  // ─── Workout Challenges ───────────────────────────────────────────────
  workoutChallenges: WorkoutChallenge[];

  // ─── Daily Nutrition (carb, fat, protein tổng hợp từ server) ─────────────
  dailyNutrition: DailyNutrition | null;

  // ─── App Preferences ───────────────────────────────────────────────────
  theme: 'light' | 'dark' | 'system';

  // Các hàm thiết lập nội bộ
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  setPendingSync: (val: boolean) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Theme
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;



  // Các actions gọi API (Async)
  login: (token: string, userId: number) => Promise<void>;
  logout: () => Promise<void>;
  addFood: (mealType: keyof DailyMeals, food: FoodItem) => Promise<void>;
  updateCurrentWeight: (newWeight: number) => Promise<void>;
  fetchDiaryFromServer: (date: string) => Promise<void>;
  syncAllDataToCloud: () => Promise<void>;

  // ─── Activity Actions (Async) ───────────────────────────────────────
  fetchActivities: (date?: string) => Promise<void>;
  fetchActivityTypes: () => Promise<void>;
  addLoggedActivity: (activity: any) => Promise<void>;
  updateLoggedActivity: (uid: string | number, activity: any) => Promise<void>;
  removeLoggedActivity: (uid: string | number, cals: number) => Promise<void>;

  // ─── Workout Challenge Actions ─────────────────────────────────────────
  fetchWorkoutChallenges: () => Promise<void>;
  createWorkoutChallenge: (payload: Omit<WorkoutChallenge, 'id'>) => Promise<void>;
  updateWorkoutChallenge: (id: number, payload: Partial<WorkoutChallenge>) => Promise<void>;
  deleteWorkoutChallenge: (id: number) => Promise<void>;
  updateChallengeProgress: (id: number, newValue: number) => Promise<void>;

  // ─── Daily Nutrition Actions ─────────────────────────────────────────
  fetchDailyNutrition: (date?: string) => Promise<void>;
  logWater: (amountMl: number) => Promise<void>;
  recalculateGoals: () => void;
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

      // ─── Activity State ─────────────────────────────────────────────────
      activityCalories: 0,
      lastActivityDate: '',
      loggedActivities: [],
      activityTypes: [],

      // ─── Workout Challenges State ─────────────────────────────────────
      workoutChallenges: [],

      // ─── Daily Nutrition State ───────────────────────────────────────
      dailyNutrition: null,

      // ─── App Preferences ───────────────────────────────────────────────
      theme: 'system' as 'light' | 'dark' | 'system',

      // --- Sync Actions ---
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error: error }),
      setPendingSync: (val) => set({ pendingOnboardingSync: val }),
      updateUserProfile: (data) => {
        set((state) => ({ userProfile: { ...state.userProfile, ...data } }));
        // Tự động tính toán lại mục tiêu nếu thay đổi các chỉ số cơ bản
        const keys = Object.keys(data);
        if (keys.some(k => ['weight', 'height', 'age', 'gender', 'goal', 'activityLevel', 'currentWeight'].includes(k))) {
          get().recalculateGoals();
        }
      },

      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : state.theme === 'light' ? 'dark' : 'system'
      } as { theme: 'light' | 'dark' | 'system' })),
      setTheme: (theme) => set({ theme }),

      // ─── Activity Actions ─────────────────────────────────────────────────
      fetchActivityTypes: async () => {
        try {
          const res = await progressApi.getActivityTypes();
          if (res && res.data) {
            set({ activityTypes: res.data });
          }
        } catch (error: any) {
          console.warn('[Store] fetchActivityTypes failed:', error.message);
        }
      },

      fetchActivities: async (date) => {
        const { userId } = get();
        if (!userId) return;
        
        const targetDate = date || getLocalToday();
        try {
          set({ isLoading: true });
          // Lấy hoạt động cho một ngày cụ thể (start=end)
          const res = await progressApi.getActivitiesBetween(userId, targetDate, targetDate);
          
          if (res && res.data) {
            // Map backend data sang local format nếu cần
            const mapped = res.data.map((a: any) => ({
              ...a,
              id: a.activityType, // Map activityType sang id dùng trong UI
              uid: a.id,          // Map backend primary key sang uid
            }));
            
            set({ 
              loggedActivities: mapped,
              activityCalories: mapped.reduce((sum: number, a: any) => sum + (a.caloriesBurned || 0), 0),
              lastActivityDate: targetDate
            });
          }
        } catch (error: any) {
          console.warn('[Store] fetchActivities failed:', error.message);
          // Fallback logic cho local state
          const today = getLocalToday();
          const { lastActivityDate } = get();
          if (lastActivityDate !== today) {
            set({ activityCalories: 0, lastActivityDate: today, loggedActivities: [] });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addActivityCalories: (kcal: number) => {
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

      addLoggedActivity: async (activity) => {
        const { userId } = get();
        const today = getLocalToday();

        // 1. Cập nhật local state ngay lập tức (optimistic)
        const tempUid = `temp_${Date.now()}`;
        const newEntry = { ...activity, uid: tempUid };
        set((state) => ({
          loggedActivities: [...state.loggedActivities, newEntry],
          activityCalories: state.activityCalories + (activity.caloriesBurned || 0),
          lastActivityDate: today,
        }));

        // 2. Gửi lên backend
        if (userId) {
          try {
            const res = await progressApi.addActivity(userId, {
              activityType: activity.id,
              durationMinutes: activity.minutes,
              caloriesBurned: activity.caloriesBurned,
            });
            
            // Nếu thành công, update lại uid bằng real ID từ backend
            if (res && res.data) {
              set((state) => ({
                loggedActivities: state.loggedActivities.map(a => 
                  a.uid === tempUid ? { ...a, uid: res.data.id } : a
                )
              }));
            }
          } catch (error: any) {
            console.warn('[Store] addLoggedActivity sync failed:', error.message);
          }
        }
      },

      updateLoggedActivity: async (uid, activity) => {
        const { userId, loggedActivities } = get();
        if (!userId) return;

        const oldEntry = loggedActivities.find(a => a.uid === uid);
        if (!oldEntry) return;

        const calDiff = (activity.caloriesBurned || 0) - (oldEntry.caloriesBurned || 0);

        // 1. Optimistic Update
        set((state) => ({
          loggedActivities: state.loggedActivities.map(a => 
            a.uid === uid ? { ...a, ...activity, id: activity.id || a.id } : a
          ),
          activityCalories: state.activityCalories + calDiff
        }));

        // 2. Sync to Backend (Nếu uid không phải là temp)
        if (typeof uid === 'number' || !uid.startsWith('temp_')) {
          try {
            await progressApi.updateActivity(uid as number, {
              activityType: activity.id,
              durationMinutes: activity.minutes,
              caloriesBurned: activity.caloriesBurned,
            });
          } catch (error: any) {
            console.warn('[Store] updateLoggedActivity failed:', error.message);
          }
        }
      },

      removeLoggedActivity: async (uid, cals) => {
        const { userId } = get();
        
        // 1. Xóa local state ngay lập tức
        set((state) => ({
          loggedActivities: state.loggedActivities.filter((a) => a.uid !== uid),
          activityCalories: Math.max(0, state.activityCalories - cals),
        }));

        // 2. Sync to Backend
        if (userId && (typeof uid === 'number' || !uid.startsWith('temp_'))) {
          try {
            await progressApi.deleteActivity(uid as number);
          } catch (error: any) {
            console.warn('[Store] removeLoggedActivity failed:', error.message);
          }
        }
      },

      // --- Async API Actions ---
      login: async (token, userId) => {
        try {
          set({ isLoading: true, error: null });

          // Reset toàn bộ state thuộc về user cũ trước khi gán user mới.
          // Nếu không reset, dữ liệu profile/nutrition của user trước sẽ bị "rò rỉ"
          // sang session mới do Zustand persist giữ lại trong AsyncStorage.
          set({
            token,
            userId,
            userProfile: DEFAULT_PROFILE,
            dailyNutrition: null,
            workoutChallenges: [],
            activityCalories: 0,
            lastActivityDate: '',
            loggedActivities: [],
          });

          // Sau khi gán userId mới, thử fetch mục tiêu dinh dưỡng (nếu đã có profile)
          try {
            const goalRes = await userApi.getUserGoal(userId);
            if (goalRes && goalRes.data) {
              set((state) => ({
                userProfile: {
                  ...state.userProfile,
                  targetCalories: goalRes.data.targetCalories,
                  targetProtein: goalRes.data.targetProtein,
                  targetCarb: goalRes.data.targetCarb,
                  targetFat: goalRes.data.targetFat,
                }
              }));
            }
          } catch (e: any) {
            console.log('[Store] Goal fetch not found or error (new user):', e.message);
          }

          // Fetch thông tin profile đầy đủ từ server (nếu user đã có profile trước đó)
          try {
            const userRes = await userApi.getUserProfile(userId);
            if (userRes && userRes.data) {
              const d = userRes.data;
              set((state) => ({
                userProfile: {
                  ...state.userProfile,
                  name: d.name || state.userProfile.name,
                  age: d.age || state.userProfile.age,
                  gender: d.gender || state.userProfile.gender,
                  height: d.height || state.userProfile.height,
                  weight: d.weight || state.userProfile.weight,
                  currentWeight: d.currentWeight || d.weight || state.userProfile.currentWeight,
                  activityLevel: d.activityLevel || state.userProfile.activityLevel,
                  goal: d.goal || state.userProfile.goal,
                }
              }));
              
              // QUAN TRỌNG: Tính toán lại mục tiêu ngay sau khi có profile để Home có data ngay lập tức
              get().recalculateGoals();
            }
          } catch (e: any) {
            console.log('[Store] User profile fetch error (might be new user):', e.message);
          }
        } catch (error: any) {
          set({ error: error.message || 'Lỗi đăng nhập' });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          // Reset toàn bộ state thuộc về user
          set({
            token: null,
            userId: null,
            userProfile: DEFAULT_PROFILE,
            dailyNutrition: null,
            workoutChallenges: [],
            activityCalories: 0,
            lastActivityDate: '',
            loggedActivities: [],
            pendingOnboardingSync: false,
          });
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

          // 3. Fetch lại daily nutrition để lấy tổng hợp calo/macro từ backend
          await get().fetchDailyNutrition(today);
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

          if (data && data.data) {
            set({ userProfile: { ...userProfile, dailyMeals: data.data } });
          }

          // 2. Fetch daily nutrition từ server cho ngày này
          await get().fetchDailyNutrition(date);

          // 3. Fetch danh sách hoạt động từ server
          await get().fetchActivities(date);
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
          const res = await userApi.updateProfileAndCalculateGoal(userId, {
            age: userProfile.age,
            gender: userProfile.gender,
            height: userProfile.height,
            weight: userProfile.currentWeight || userProfile.weight,
            activityLevel: userProfile.activityLevel,
            goal: userProfile.goal,
            name: userProfile.name,
            fastingGoal: userProfile.fastingGoal
          });

          if (res && res.data) {
            set((state) => ({
              userProfile: {
                ...state.userProfile,
                targetCalories: res.data.targetCalories,
                targetProtein: res.data.targetProtein,
                targetCarb: res.data.targetCarb,
                targetFat: res.data.targetFat,
              }
            }));
          } else {
            // Fallback nếu server không trả về data tính toán
            get().recalculateGoals();
          }

          set({ pendingOnboardingSync: false });
        } catch (error: any) {
          set({ error: error.message || 'Đồng bộ hóa dữ liệu thất bại' });
        } finally {
          set({ isLoading: false });
        }
      },

      // ─── Workout Challenge Async Actions ──────────────────────────────────

      fetchWorkoutChallenges: async () => {
        const { userId } = get();
        if (!userId) return;
        try {
          const res = await workoutApi.listUserChallenges(userId);
          if (res && Array.isArray(res.data)) {
            set({ workoutChallenges: res.data });
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.warn('[Store] fetchWorkoutChallenges:', error.message);
          }
        }
      },

      createWorkoutChallenge: async (payload) => {
        const { userId } = get();
        if (!userId) return;
        try {
          set({ isLoading: true, error: null });
          const res = await workoutApi.createChallenge({ ...payload, userId });
          if (res && res.data) {
            set((state) => ({
              workoutChallenges: [...state.workoutChallenges, res.data],
            }));
          }
        } catch (error: any) {
          set({ error: error.message || 'Không thể tạo thử thách' });
          console.error('[Store] createWorkoutChallenge:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateWorkoutChallenge: async (id, payload) => {
        try {
          set({ isLoading: true, error: null });
          const res = await workoutApi.updateChallenge(id, payload);
          if (res && res.data) {
            set((state) => ({
              workoutChallenges: state.workoutChallenges.map((c) =>
                c.id === id ? { ...c, ...res.data } : c
              ),
            }));
          }
        } catch (error: any) {
          set({ error: error.message || 'Không thể cập nhật thử thách' });
          console.error('[Store] updateWorkoutChallenge:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      deleteWorkoutChallenge: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await workoutApi.deleteChallenge(id);
          set((state) => ({
            workoutChallenges: state.workoutChallenges.filter((c) => c.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message || 'Không thể xóa thử thách' });
          console.error('[Store] deleteWorkoutChallenge:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateChallengeProgress: async (id, newValue) => {
        try {
          set({ isLoading: true, error: null });
          const res = await workoutApi.updateChallenge(id, { currentValue: newValue });
          if (res && res.data) {
            set((state) => ({
              workoutChallenges: state.workoutChallenges.map((c) =>
                c.id === id ? { ...c, currentValue: newValue } : c
              ),
            }));
          }
        } catch (error: any) {
          set({ error: error.message || 'Không thể cập nhật tiến độ' });
          console.error('[Store] updateChallengeProgress:', error);
} finally {
          set({ isLoading: false });
        }
      },

      fetchDailyNutrition: async (date) => {
        const { userId } = get();
        if (!userId) return;
        const targetDate = date || getLocalToday();
        try {
          const res = await progressApi.getDailyNutrition(userId, targetDate);
          if (res && res.data) {
            set({ dailyNutrition: res.data });
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.warn('[Store] fetchDailyNutrition:', error.message);
          } else {
            // Ngày chưa có dữ liệu – giữ null
            set({ dailyNutrition: null });
          }
        }
      },

      logWater: async (amountMl: number) => {
        const { userId } = get();
        if (!userId) return;
        const today = getLocalToday();

        try {
          // 1. Gọi API
          await progressApi.logWater(userId, amountMl, today);
          
          // 2. Fetch lại daily nutrition để cập nhật UI
          await get().fetchDailyNutrition(today);
        } catch (error: any) {
          console.warn('[Store] logWater failed:', error.message);
        }
      },

      recalculateGoals: () => {
        const { userProfile } = get();
        if (!userProfile.weight || !userProfile.height || !userProfile.age) return;

        const goals = calculateNutritionalGoals({
          weight: userProfile.currentWeight || userProfile.weight,
          height: userProfile.height,
          age: userProfile.age,
          gender: userProfile.gender,
          goal: userProfile.goal || 'maintain_weight',
          activityLevel: userProfile.activityLevel || 1.2
        });

        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...goals
          }
        }));
      },
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
