import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@nutritrack_state';

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
  free: 1.3
};

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DailyMeals = {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snack: FoodItem[];
};

export type FastingSession = {
  id: string;
  startTime: number;
  endTime: number;
  durationHours: number;
};

export type WorkoutChallengeState = {
  isActive: boolean;
  isPaused: boolean;
  targetMs: number;
  accumulatedMs: number;
  lastResumeTime: number;
  calorieTarget: number;
};

export type UserProfile = {
  name?: string;
  email?: string;
  goal: string;
  dietMode: number | '';
  activityLevel: string;
  isPregnant: boolean;
  hasDiabetes: boolean;
  gender: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  speed: number;
  targetCalories: number;
  currentWeight?: number;
  dailyMeals?: DailyMeals;
  streakCount?: number;
  lastActiveDate?: string;
  isFasting?: boolean;
  fastingStartTime?: number | null;
  fastingGoal?: number;
  fastingState?: 'FASTING' | 'EATING';
  fastingHistory?: FastingSession[];
  waterIntake?: number;
  waterTarget?: number;
  lastWaterDate?: string;
  extraBurnedCalories?: number;
  workoutChallenge?: WorkoutChallengeState;
};

export type Macros = {
  carbs: number;
  protein: number;
  fat: number;
};

type UserProfileContextType = {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  // Hàm tính toán thủ công (giữ lại cho Onboarding)
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
  
  // Hành động Vận động bổ sung (Chống nợ Calo)
  startWorkoutChallenge: (calorieTarget: number) => void;
  pauseWorkoutChallenge: () => void;
  resumeWorkoutChallenge: () => void;
  cancelWorkoutChallenge: () => void;
  completeWorkoutChallenge: () => void;

  // Giá trị tự động tính (Memoized)
  bmr: number;
  tdee: number;
  bmi: number;
  macroTargets: Macros;
  totalEatenCalories: number;
  totalEatenMacros: Macros;
  // API Readiness
  syncAllDataToCloud: () => object;
  isLoaded: boolean;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  goal: '',
  dietMode: '',
  activityLevel: '',
  isPregnant: false,
  hasDiabetes: false,
  gender: 'Nam',
  age: 24,
  height: 170,
  weight: 65,
  targetWeight: 65,
  speed: 0.5,
  targetCalories: 0,
  currentWeight: 70,
  dailyMeals: { breakfast: [], lunch: [], dinner: [], snack: [] },
  streakCount: 1,
  lastActiveDate: '',
  isFasting: false,
  fastingStartTime: null,
  fastingGoal: 16,
  fastingState: 'FASTING',
  fastingHistory: [],
  waterIntake: 0,
  waterTarget: 2000,
  lastWaterDate: '',
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ═══════════════════════════════════════════════════
  // PERSISTENCE LAYER: AsyncStorage Load/Save
  // ═══════════════════════════════════════════════════

  // Đọc dữ liệu từ AsyncStorage khi khởi động
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as UserProfile;
          
          // Daily Reset logic for Water
          const d = new Date();
          const localToday = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
          if (parsed.lastWaterDate !== localToday) {
            parsed.waterIntake = 0;
            parsed.lastWaterDate = localToday;
          }

          setUserProfile(parsed);
        }
      } catch (e) {
        console.warn('[NutriTrack] Lỗi khi đọc AsyncStorage:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProfile();
  }, []);

  // Ghi dữ liệu vào AsyncStorage khi State thay đổi (debounce 1s)
  useEffect(() => {
    if (!isLoaded) return; // Không ghi lại giá trị mặc định trước khi load xong
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
      } catch (e) {
        console.warn('[NutriTrack] Lỗi khi ghi AsyncStorage:', e);
      }
    }, 1000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [userProfile, isLoaded]);

  // ═══════════════════════════════════════════════════
  // STREAK TRACKER: Tính streak ngày sử dụng
  // ═══════════════════════════════════════════════════

  useEffect(() => {
    if (!isLoaded) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    setUserProfile((prev) => {
      const lastStr = prev.lastActiveDate;
      if (!lastStr) return { ...prev, lastActiveDate: todayStr, streakCount: 1 };
      if (todayStr === lastStr) return prev;

      const lastDate = new Date(lastStr);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return { ...prev, lastActiveDate: todayStr, streakCount: (prev.streakCount || 1) + 1 };
      }
      return { ...prev, lastActiveDate: todayStr, streakCount: 1 };
    });
  }, [isLoaded]);

  // ═══════════════════════════════════════════════════
  // COMPUTED VALUES (useMemo) — Tự động tính lại khi dữ liệu gốc thay đổi
  // ═══════════════════════════════════════════════════

  // BMR: Chỉ phụ thuộc (gender, weight, height, age)
  const bmr = useMemo(() => {
    const w = Number(userProfile.weight);
    const h = Number(userProfile.height);
    const a = Number(userProfile.age);
    if (userProfile.gender === 'Nam' || userProfile.gender === 'male') {
      return Math.round((10 * w) + (6.25 * h) - (5 * a) + 5);
    }
    return Math.round((10 * w) + (6.25 * h) - (5 * a) - 161);
  }, [userProfile.gender, userProfile.weight, userProfile.height, userProfile.age]);

  // TDEE: Phụ thuộc (bmr, activityLevel, goal, isPregnant)
  const tdee = useMemo(() => {
    const activityKey = String(userProfile.activityLevel || 'light');
    const multiplier = ACTIVITY_MULTIPLIERS[activityKey] || 1.375;
    let result = bmr * multiplier;
    if (userProfile.isPregnant) {
      result += 350;
    } else {
      if (userProfile.goal === 'lose_weight' || userProfile.goal === 'lose') {
        result -= 500;
      } else if (userProfile.goal === 'gain_muscle' || userProfile.goal === 'gain') {
        result += 500;
      }
    }
    return Math.round(result);
  }, [bmr, userProfile.activityLevel, userProfile.goal, userProfile.isPregnant]);

  // BMI: Phụ thuộc (weight, height)
  const bmi = useMemo(() => {
    const h = Number(userProfile.height) / 100; // cm -> m
    const w = Number(userProfile.currentWeight || userProfile.weight);
    if (h <= 0) return 0;
    return Math.round((w / (h * h)) * 10) / 10;
  }, [userProfile.currentWeight, userProfile.weight, userProfile.height]);

  // Macro Targets: Phụ thuộc (tdee, goal)
  const macroTargets = useMemo((): Macros => {
    let carbsRatio = 0.45;
    let proteinRatio = 0.25;
    let fatRatio = 0.30;

    if (userProfile.goal === 'lose_weight' || userProfile.goal === 'lose') {
      carbsRatio = 0.30;
      proteinRatio = 0.40;
      fatRatio = 0.30;
    } else if (userProfile.goal === 'gain_muscle' || userProfile.goal === 'gain') {
      carbsRatio = 0.50;
      proteinRatio = 0.30;
      fatRatio = 0.20;
    }

    return {
      carbs: Math.round((tdee * carbsRatio) / 4),
      protein: Math.round((tdee * proteinRatio) / 4),
      fat: Math.round((tdee * fatRatio) / 9),
    };
  }, [tdee, userProfile.goal]);

  // Tổng Calo & Macros đã ăn: Phụ thuộc (dailyMeals)
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

  // ═══════════════════════════════════════════════════
  // LEGACY FUNCTIONS (giữ lại để tương thích Onboarding)
  // ═══════════════════════════════════════════════════

  const calculateFinalCalories = (profile: UserProfile): number => {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    let calcBmr = 0;
    if (profile.gender === 'Nam' || profile.gender === 'male') {
      calcBmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      calcBmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    const activityKey = String(profile.activityLevel || 'light');
    const multiplier = ACTIVITY_MULTIPLIERS[activityKey] || 1.375;
    let calcTdee = calcBmr * multiplier;
    if (profile.isPregnant) {
      calcTdee += 350;
    } else {
      if (profile.goal === 'lose_weight' || profile.goal === 'lose') {
        calcTdee -= 500;
      } else if (profile.goal === 'gain_muscle' || profile.goal === 'gain') {
        calcTdee += 500;
      }
    }
    return Math.round(calcTdee);
  };

  const calculateDuration = (profile: UserProfile): number => {
    if (profile.goal === 'maintain' || profile.weight === profile.targetWeight) {
      return 8;
    }
    const weightDiff = Math.abs(profile.weight - profile.targetWeight);
    const spd = profile.speed || 0.5;
    let weeks = Math.ceil(weightDiff / spd);
    if (weeks < 4) weeks = 4;
    return weeks;
  };

  const getMacroTargets = (totalCal: number, goal: string): Macros => {
    let carbsRatio = 0.45;
    let proteinRatio = 0.25;
    let fatRatio = 0.30;
    if (goal === 'lose_weight' || goal === 'lose') {
      carbsRatio = 0.30; proteinRatio = 0.40; fatRatio = 0.30;
    } else if (goal === 'gain_muscle' || goal === 'gain') {
      carbsRatio = 0.50; proteinRatio = 0.30; fatRatio = 0.20;
    }
    return {
      carbs: Math.round((totalCal * carbsRatio) / 4),
      protein: Math.round((totalCal * proteinRatio) / 4),
      fat: Math.round((totalCal * fatRatio) / 9),
    };
  };

  // ═══════════════════════════════════════════════════
  // ACTIONS (Hành động thay đổi State)
  // ═══════════════════════════════════════════════════

  /**
   * Cập nhật một phần hồ sơ người dùng và đồng bộ hóa tức thì.
   * Cập nhật State (RAM) và ghi trực tiếp xuống AsyncStorage (ROM).
   * Bảo đảm "Single Source of Truth" trong quá trình Onboarding.
   * 
   * @param {Partial<UserProfile>} data - Thực thể chứa các thay đổi profile.
   * @returns {void}
   */
  const updateUserProfile = useCallback((data: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...data };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(e => console.warn('[NutriTrack] Lỗi khi ghi AsyncStorage tức thì:', e));
      return next;
    });
  }, []);

  /**
   * Thêm một món ăn mới vào danh sách bữa ăn hàng ngày.
   * Tự động khiến State `dailyMeals` thay đổi, qua đó kích hoạt (Trigger) tính toán lại Tổng lượng Calo & Macros tiêu thụ.
   * 
   * @param {keyof DailyMeals} mealType - Bữa ăn thao tác (breakfast, lunch, dinner, snack).
   * @param {FoodItem} food - Đối tượng thực phẩm với thành phần dinh dưỡng.
   */
  const addFood = (mealType: keyof DailyMeals, food: FoodItem) => {
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
  };

  /**
   * Ghi nhận cân nặng hiện tại của người dùng.
   * Ghi chú: Việc thay đổi cân nặng này có năng lực kích hoạt lại công thức BMR (Mifflin-St Jeor),
   * làm thay đổi chỉ số TDEE toàn cục theo thiết kế (skill.md).
   * 
   * @param {number} newWeight - Mức cân nặng mới thu được (Kg).
   */
  const updateCurrentWeight = (newWeight: number) => {
    setUserProfile((prev) => ({
      ...prev,
      currentWeight: newWeight
    }));
  };

  /**
   * Chuyển trạng thái sinh hoạt sang "Nhịn ăn" (Fasting).
   * Đây là mốc thời gian chốt (Timestamp) để theo dõi các giai đoạn sinh học (Ketosis, Autophagy...).
   * 
   * @param {number} goal - Số giờ mục tiêu (VD: 16 cho lộ trình 16:8).
   */
  const startFasting = (goal: number) => {
    setUserProfile(prev => ({
      ...prev,
      isFasting: true,
      fastingState: 'FASTING',
      fastingStartTime: Date.now(),
      fastingGoal: goal
    }));
  };

  /**
   * Chuyển trạng thái sang "Giờ nạp thức ăn" (Eating).
   * Xác lập lại Timestamp khởi điểm cho phiên hoạt động ăn uống.
   */
  const startEating = () => {
    setUserProfile(prev => ({
      ...prev,
      isFasting: true,
      fastingState: 'EATING',
      fastingStartTime: Date.now()
    }));
  };

  /**
   * Hàm xử lý kết thúc phiên nhịn ăn (Fasting Session).
   * Cập nhật mới: Thuật toán Tách Ngày (Daily Time Splitting/Bucketing).
   * 1. Duyệt vòng lặp `while` từ lúc Start đến Now.
   * 2. Nếu phiên làm việc chạy qua 24h đêm (xuyên ngày), cắt phiên đó thành nhiều khối (chunks).
   * 3. Phân bổ số giờ tương đối vào đúng `dateStr` của từng ngày.
   */
  const endFasting = () => {
    setUserProfile(prev => {
      const now = Date.now();
      const st = prev.fastingStartTime || now;

      const history = prev.fastingHistory || [];
      let newHistory = [...history];

      // Thuật toán tách ngày (Bucketing)
      let currentMs = st;
      while (currentMs < now) {
        const d = new Date(currentMs);
        const nextDay = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        const endOfDayMs = nextDay.getTime();
        
        const chunkEndMs = Math.min(endOfDayMs, now);
        const chunkDurationHours = (chunkEndMs - currentMs) / (1000 * 60 * 60);
        
        // Chuyển sang YYYY-MM-DD chuẩn Local time
        const dateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        const existingIdx = newHistory.findIndex(s => s.id === dateStr);
        if (existingIdx >= 0) {
          newHistory[existingIdx] = {
            ...newHistory[existingIdx],
            durationHours: newHistory[existingIdx].durationHours + chunkDurationHours,
            endTime: Math.max(newHistory[existingIdx].endTime, chunkEndMs),
          };
        } else {
          newHistory.push({
            id: dateStr,
            startTime: currentMs,
            endTime: chunkEndMs,
            durationHours: chunkDurationHours,
          });
        }
        
        currentMs = chunkEndMs;
      }

      return {
        ...prev,
        isFasting: true,
        fastingState: 'EATING',
        fastingStartTime: now,
        fastingHistory: newHistory
      };
    });
  };

  const stopFastingLoop = () => {
    setUserProfile(prev => ({ ...prev, isFasting: false, fastingState: 'FASTING', fastingStartTime: null }));
  };

  const setFastingGoal = (goal: number) => {
    setUserProfile(prev => ({ ...prev, fastingGoal: goal }));
  };

  /**
   * Quản lý trạng thái Nạp nước uống (Hydration).
   * Được thiết kế với logic tự tái lập (Daily Reset): Hệ thống sẽ đối chiếu ngày hiện tại
   * và `lastWaterDate`, nếu sang ngày mới thì reset Intake về chỉ cung cấp tham số `amount`.
   * 
   * @param {number} amount - Thể tích ml nước nạp thêm (thường là 200ml/cốc).
   */
  const addWater = (amount: number) => {
    setUserProfile(prev => {
      const d = new Date();
      const localToday = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      
      let newIntake = (prev.waterIntake || 0) + amount;
      if (prev.lastWaterDate !== localToday) {
        newIntake = amount; // Reset nếu sang ngày mới
      }
      return {
        ...prev,
        waterIntake: newIntake,
        lastWaterDate: localToday
      };
    });
  };

  // ═══════════════════════════════════════════════════
  // WORKOUT CHALLENGE (VẬN ĐỘNG BÙ CALO)
  // ═══════════════════════════════════════════════════

  const startWorkoutChallenge = useCallback((calorieTarget: number) => {
    setUserProfile(prev => {
      const minutes = Math.ceil((calorieTarget / 100) * 20);
      return {
        ...prev,
        workoutChallenge: {
          isActive: true,
          isPaused: false,
          targetMs: minutes * 60 * 1000,
          accumulatedMs: 0,
          lastResumeTime: Date.now(),
          calorieTarget
        }
      };
    });
  }, []);

  const pauseWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => {
      if (!prev.workoutChallenge || !prev.workoutChallenge.isActive || prev.workoutChallenge.isPaused) return prev;
      const now = Date.now();
      const elapsed = now - prev.workoutChallenge.lastResumeTime;
      return {
        ...prev,
        workoutChallenge: {
          ...prev.workoutChallenge,
          isPaused: true,
          accumulatedMs: prev.workoutChallenge.accumulatedMs + elapsed
        }
      };
    });
  }, []);

  const resumeWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => {
      if (!prev.workoutChallenge || !prev.workoutChallenge.isActive || !prev.workoutChallenge.isPaused) return prev;
      return {
        ...prev,
        workoutChallenge: {
          ...prev.workoutChallenge,
          isPaused: false,
          lastResumeTime: Date.now()
        }
      };
    });
  }, []);

  const cancelWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      workoutChallenge: undefined
    }));
  }, []);

  const completeWorkoutChallenge = useCallback(() => {
    setUserProfile(prev => {
      if (!prev.workoutChallenge) return prev;
      return {
        ...prev,
        extraBurnedCalories: (prev.extraBurnedCalories || 0) + prev.workoutChallenge.calorieTarget,
        workoutChallenge: undefined
      };
    });
  }, []);

  // ═══════════════════════════════════════════════════
  // API READINESS: Hàm Dispatcher gom dữ liệu cho Spring Boot
  // ═══════════════════════════════════════════════════

  const syncAllDataToCloud = useCallback(() => {
    const payload = {
      userStats: {
        weight: userProfile.currentWeight || userProfile.weight,
        height: userProfile.height,
        age: userProfile.age,
        gender: userProfile.gender,
        goal: userProfile.goal,
        activityLevel: userProfile.activityLevel,
        tdee,
        bmr,
        bmi,
      },
      nutritionState: {
        totalCalories: totalEatenCalories,
        protein: totalEatenMacros.protein,
        carbs: totalEatenMacros.carbs,
        fat: totalEatenMacros.fat,
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
    // TODO: Khi Backend Spring Boot sẵn sàng, thay console.log bằng:
    // await fetch('https://api.nutritrack.com/sync', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    return payload;
  }, [userProfile, tdee, bmr, bmi, totalEatenCalories, totalEatenMacros]);

  // ═══════════════════════════════════════════════════
  // PROVIDER
  // ═══════════════════════════════════════════════════

  return (
    <UserProfileContext.Provider value={{
      userProfile,
      setUserProfile,
      updateUserProfile,
      calculateFinalCalories,
      calculateDuration,
      getMacroTargets,
      addFood,
      updateCurrentWeight,
      startFasting,
      startEating,
      endFasting,
      stopFastingLoop,
      setFastingGoal,
      addWater,
      startWorkoutChallenge,
      pauseWorkoutChallenge,
      resumeWorkoutChallenge,
      cancelWorkoutChallenge,
      completeWorkoutChallenge,
      // Computed values (Memoized)
      bmr,
      tdee,
      bmi,
      macroTargets,
      totalEatenCalories,
      totalEatenMacros,
      // API
      syncAllDataToCloud,
      isLoaded,
    }}>
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
