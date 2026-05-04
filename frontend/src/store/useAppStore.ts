import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DEFAULT_PROFILE, FoodItem, DailyMeals, WorkoutChallenge, DailyNutrition, ActivityTypeInfo } from '../types';
import { getLocalToday } from '../core/dateFormatter';
import { calculateNutritionalGoals } from '../core/calculateNutrition';
import { saveToken, clearTokens } from '../utils/tokenStorage';

// ─── API Service Imports (Layer-based) ────────────────────────────────────
import * as diaryApi from '../api/diaryService';
import * as progressApi from '../api/progressService';
import * as userApi from '../api/userService';
import * as workoutApi from '../api/workoutService';
import * as activityDb from '../db/activityDb';
import * as mealDb from '../db/mealDb';
import * as trackingDb from '../db/trackingDb';
import * as syncDb from '../db/syncDb';

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

  // ─── Tracking (Water & Weight) ───────────────────────────────────────
  waterIntake: number;
  waterTarget: number;
  latestWeight: number | null;
  isWaterLoading: boolean;
  isWeightLoading: boolean;

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
  logWeight: (weight: number, date?: string) => Promise<void>;
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
  fetchWaterIntake: (date?: string) => Promise<void>;
  fetchLatestWeight: () => Promise<void>;
  checkAndResetForNewDay: () => boolean;
  recalculateGoals: () => void;
  processSyncQueue: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ──────────────────────────────────────────────────────────────────────
      // ─── PHẦN 1: TRẠNG THÁI CƠ BẢN (STATE) ───
      // ──────────────────────────────────────────────────────────────────────
      
      /** Trạng thái tải dữ liệu toàn cục */
      isLoading: false,
      /** Thông báo lỗi (nếu có) */
      error: null,
      /** ID người dùng đang đăng nhập */
      userId: null,
      /** Token xác thực JWT */
      token: null,
      /** Đánh dấu cần đồng bộ dữ liệu Onboarding */
      pendingOnboardingSync: false,
      /** Hồ sơ chi tiết của người dùng (chiều cao, cân nặng, mục tiêu...) */
      userProfile: DEFAULT_PROFILE,

      // ─── Hoạt động & Luyện tập ───
      /** Tổng lượng calo tiêu thụ từ vận động hôm nay */
      activityCalories: 0,
      /** Ngày cuối cùng cập nhật hoạt động (dùng để reset theo ngày) */
      lastActivityDate: '',
      /** Danh sách chi tiết các bài tập đã thực hiện trong ngày */
      loggedActivities: [],
      /** Danh mục các loại bài tập hỗ trợ từ server */
      activityTypes: [],

      // ─── Dinh dưỡng & Tracking ───
      /** Danh sách các thử thách tập luyện đang tham gia */
      workoutChallenges: [],
      /** Tóm tắt dinh dưỡng ngày hôm nay (từ server) */
      dailyNutrition: null,
      /** Lượng nước đã uống (ml) */
      waterIntake: 0,
      /** Mục tiêu uống nước (ml) */
      waterTarget: 2000,
      /** Cân nặng mới nhất ghi nhận được */
      latestWeight: null,
      /** Chế độ hiển thị (Sáng/Tối) */
      theme: 'system' as 'light' | 'dark' | 'system',
      /** Trạng thái đang tải dữ liệu nước */
      isWaterLoading: false,
      /** Trạng thái đang tải dữ liệu cân nặng */
      isWeightLoading: false,

      // ──────────────────────────────────────────────────────────────────────
      // ─── PHẦN 2: CÁC HÀNH ĐỘNG CƠ BẢN (SYNC ACTIONS) ───
      // ──────────────────────────────────────────────────────────────────────

      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error: error }),
      setPendingSync: (val) => set({ pendingOnboardingSync: val }),

      /** Cập nhật hồ sơ và tự động tính toán lại mục tiêu nếu cần */
      updateUserProfile: (data) => {
        set((state) => ({ userProfile: { ...state.userProfile, ...data } }));
        const keys = Object.keys(data);
        const criticalKeys = ['weight', 'height', 'age', 'gender', 'goal', 'activityLevel', 'currentWeight'];
        if (keys.some(k => criticalKeys.includes(k))) {
          get().recalculateGoals();
        }
      },

      /** Chuyển đổi qua lại giữa Light/Dark mode */
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : state.theme === 'light' ? 'dark' : 'system'
      } as { theme: 'light' | 'dark' | 'system' })),
      setTheme: (theme) => set({ theme }),

      // ──────────────────────────────────────────────────────────────────────
      // ─── PHẦN 3: HOẠT ĐỘNG THỂ CHẤT (ACTIVITY ACTIONS) ───
      // ──────────────────────────────────────────────────────────────────────
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

      /** Lấy danh sách bài tập đã tập trong một ngày cụ thể */
      fetchActivities: async (date) => {
        const { userId } = get();
        if (!userId) return;
        
        const targetDate = date || getLocalToday();
        
        try {
          // 1. Luôn ưu tiên lấy dữ liệu từ SQLite trước để hiển thị tức thì
          const localData = await activityDb.getActivitiesByDate(targetDate);
          if (localData.length > 0) {
            const mapped = localData.map((a: any) => ({
              ...a,
              id: a.activity_type,
              uid: a.uid,
            }));
            set({ 
              loggedActivities: mapped,
              activityCalories: mapped.reduce((sum: number, a: any) => sum + (a.calories_burned || 0), 0),
              lastActivityDate: targetDate
            });
          }

          set({ isLoading: true });
          // 2. Sau đó mới gọi API để cập nhật bản mới nhất từ server
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

      /** Kiểm tra và reset dữ liệu nếu bước sang ngày mới (hỗ trợ cả offline) */
      checkAndResetForNewDay: () => {
        const today = getLocalToday();
        const { lastActivityDate, userProfile } = get();
        
        if (lastActivityDate && lastActivityDate !== today) {
          console.log('[Store] Detecting new day. Resetting daily stats...');
          set({ 
            waterIntake: 0,
            activityCalories: 0, 
            loggedActivities: [],
            lastActivityDate: today,
            dailyNutrition: null,
            userProfile: {
              ...userProfile,
              dailyMeals: { breakfast: [], lunch: [], dinner: [], snack: [] }
            }
          });
          return true;
        }
        return false;
      },

      /** Reset bài tập nếu là ngày mới */
      resetActivityIfNewDay: () => {
        get().checkAndResetForNewDay();
      },

      addLoggedActivity: async (activity) => {
        const { userId } = get();
        const today = getLocalToday();

        // 1. Lưu vào SQLite (Offline-first)
        await activityDb.insertActivity({
          activity_type: activity.id,
          minutes: activity.minutes,
          calories_burned: activity.caloriesBurned,
          date: today,
          synced: 0
        });

        // 2. Cập nhật local state ngay lập tức (optimistic)
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
            console.warn('[Store] addLoggedActivity sync failed, adding to queue:', error.message);
            // LƯU VÀO HÀNG ĐỢI ĐỂ ĐỒNG BỘ SAU
            await syncDb.addToSyncQueue('ADD_ACTIVITY', {
              activityType: activity.id,
              durationMinutes: activity.minutes,
              caloriesBurned: activity.caloriesBurned,
              date: today
            });
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

      // ──────────────────────────────────────────────────────────────────────
      // ─── PHẦN 4: XÁC THỰC & TÀI KHOẢN (AUTH ACTIONS) ───
      // ──────────────────────────────────────────────────────────────────────
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

          // Lưu token vào SecureStore (hoặc AsyncStorage nếu trên Web)
          await saveToken(token);

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

          get().fetchWaterIntake();
          get().fetchLatestWeight();

          // Fetch thông tin profile đầy đủ từ server (nếu user đã có profile trước đó)
          try {
            const userRes = await userApi.getUserProfile(userId);
            if (userRes && userRes.data) {
              const d = userRes.data;
              // Cập nhật state với dữ liệu từ server
              set((state) => ({
                userProfile: {
                  ...state.userProfile,
                  name: d.name || state.userProfile.name,
                  age: d.age || state.userProfile.age,
                  gender: d.gender || state.userProfile.gender,
                  height: d.height || state.userProfile.height,
                  weight: d.weight || state.userProfile.weight,
                  currentWeight: d.weight || state.userProfile.currentWeight,
                  activityLevel: d.activityLevel || state.userProfile.activityLevel,
                  goal: d.goal || state.userProfile.goal,
                }
              }));
            }
          } catch (e: any) {
            console.log('[Store] User profile fetch error (might be new user):', e.message);
          }

          // QUAN TRỌNG: Đảm bảo luôn có targetCalories (tính local nếu backend chưa có)
          if (!get().userProfile.targetCalories) {
            get().recalculateGoals();
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
            waterIntake: 0,
            latestWeight: null,
          });
          await clearTokens();
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

          // 1. Lưu vào SQLite (Offline-first)
          await mealDb.insertMeal({
            meal_type: mealType,
            food_id: food.id,
            food_name: food.name,
            calories: food.calories,
            protein: food.protein,
            carb: food.carb,
            fat: food.fat,
            quantity: food.quantity || 1,
            date: today,
            synced: 0
          });

          // 2. Gọi API qua Service Layer
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
          console.warn('[Store] addFood sync failed, adding to queue:', error.message);
          // LƯU VÀO HÀNG ĐỢI ĐỂ ĐỒNG BỘ SAU
          await syncDb.addToSyncQueue('ADD_MEAL', {
            mealType,
            foodId: food.id,
            quantity: food.quantity || 1,
            calories: food.calories,
            protein: food.protein,
            carb: food.carb,
            fat: food.fat,
            date: getLocalToday()
          });
          
          set({ error: 'Mất kết nối. Dữ liệu đã được lưu tạm tại máy.' });
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

      logWeight: async (weight, date) => {
        const { userId } = get();
        if (!userId) return;
        const logDate = date || getLocalToday();

        try {
          set({ isWeightLoading: true });
          // 1. Lưu SQLite
          await trackingDb.logWeight(weight, logDate);
          
          // 2. Gọi API
          await progressApi.logWeight(userId, logDate, weight);
          // Auto-refresh after POST
          await get().fetchLatestWeight();
        } catch (error: any) {
          console.warn('[Store] logWeight sync failed, adding to queue:', error.message);
          await syncDb.addToSyncQueue('LOG_WEIGHT', { weight, date: logDate });
        } finally {
          set({ isWeightLoading: false });
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
            // Transform Meal[] từ backend sang DailyMeals format cho store
            const meals: DailyMeals = { breakfast: [], lunch: [], dinner: [], snack: [] };
            for (const meal of data.data) {
              const mealType = (meal.mealType || '').toLowerCase() as keyof DailyMeals;
              if (meals[mealType] && Array.isArray(meal.mealLogs)) {
                meals[mealType] = meal.mealLogs.map((log) => ({
                  id: log.food?.id || log.id,
                  name: log.food?.name || '',
                  calories: log.calories,
                  protein: log.protein,
                  carb: log.carb,
                  fat: log.fat,
                  quantity: log.quantity,
                }));
              }
            }
            set({ userProfile: { ...userProfile, dailyMeals: meals } });
          }

          // 2. Fetch daily nutrition từ server cho ngày này
          await get().fetchDailyNutrition(date);

          // 3. Fetch danh sách hoạt động từ server
          await get().fetchActivities(date);

          // 4. Fetch tracking (water, weight)
          await get().fetchWaterIntake(date);
          await get().fetchLatestWeight();
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

      // ──────────────────────────────────────────────────────────────────────
      // ─── PHẦN 6: THỬ THÁCH TẬP LUYỆN (WORKOUT CHALLENGES) ───
      // ──────────────────────────────────────────────────────────────────────

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

      // ──────────────────────────────────────────────────────────────────────
      // ─── PHẦN 7: THEO DÕI CHỈ SỐ & TIỆN ÍCH (TRACKING & UTILS) ───
      // ──────────────────────────────────────────────────────────────────────

      /** Tải dữ liệu dinh dưỡng tổng hợp cho một ngày cụ thể */
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
        const { userId, waterIntake: prevIntake } = get();
        if (!userId) return;
        const today = getLocalToday();

        // 1. Lưu SQLite (Offline)
        await trackingDb.logWater(amountMl, today);

        // 2. Cập nhật UI ngay lập tức (Optimistic)
        set({ waterIntake: prevIntake + amountMl });

        try {
          set({ isWaterLoading: true });
          // 3. Gọi API
          await progressApi.logWater(userId, amountMl, today);
          
          // 2. Fetch lại water intake thực tế từ server để đồng bộ chính xác
          await get().fetchWaterIntake(today);
        } catch (error: any) {
          console.warn('[Store] logWater sync failed, adding to queue:', error.message);
          // LƯU VÀO HÀNG ĐỢI ĐỂ ĐỒNG BỘ SAU
          await syncDb.addToSyncQueue('LOG_WATER', { amount: amountMl, date: today });
        } finally {
          set({ isWaterLoading: false });
        }
      },

      fetchWaterIntake: async (date) => {
        const { userId } = get();
        if (!userId) return;
        const targetDate = date || getLocalToday();

        try {
          // 1. Đọc từ SQLite trước
          const localWater = await trackingDb.getWaterByDate(targetDate);
          if (localWater > 0) {
            set({ waterIntake: localWater });
          }

          set({ isWaterLoading: true });
          // 2. Sau đó đồng bộ từ server
          const res = await progressApi.getDailyWaterTotal(userId, targetDate);
          if (res && res.data !== undefined) {
            set({ waterIntake: res.data });
          }
        } catch (error: any) {
          console.warn('[Store] fetchWaterIntake failed:', error.message);
        } finally {
          set({ isWaterLoading: false });
        }
      },

      fetchLatestWeight: async () => {
        const { userId } = get();
        if (!userId) return;

        try {
          set({ isWeightLoading: true });
          const res = await progressApi.getLatestWeight(userId);
          if (res && res.data) {
            set({ latestWeight: res.data.weight });
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            // Fallback to user profile
            try {
               const userRes = await userApi.getUserProfile(userId);
               if (userRes && userRes.data) {
                 set({ latestWeight: userRes.data.weight });
               }
            } catch (e: any) {
               console.warn('[Store] fetchLatestWeight fallback failed:', e.message);
            }
          } else {
            console.warn('[Store] fetchLatestWeight failed:', error.message);
          }
        } finally {
          set({ isWeightLoading: false });
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

      /** Xử lý toàn bộ hàng đợi đồng bộ đang treo */
      processSyncQueue: async () => {
        const queue = await syncDb.getSyncQueue();
        if (queue.length === 0) return;

        console.log(`[Sync] Processing ${queue.length} items in queue...`);
        const { userId } = get();
        if (!userId) return;

        for (const item of queue) {
          try {
            const payload = JSON.parse(item.payload);
            switch (item.action_type) {
              case 'ADD_MEAL':
                await diaryApi.addFoodToMeal(userId, payload.mealType, payload.date, payload);
                break;
              case 'ADD_ACTIVITY':
                await progressApi.addActivity(userId, payload);
                break;
              case 'LOG_WATER':
                await progressApi.logWater(userId, payload.amount, payload.date);
                break;
              case 'LOG_WEIGHT':
                await progressApi.logWeight(userId, payload.date, payload.weight);
                break;
            }
            // Nếu thành công -> Xóa khỏi hàng đợi
            await syncDb.removeFromSyncQueue(item.id!);
          } catch (err: any) {
            console.warn(`[Sync] Failed to process item ${item.id}:`, err.message);
            await syncDb.incrementRetryCount(item.id!);
          }
        }
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
        waterTarget: state.waterTarget,
      }),
    }
  )
);
