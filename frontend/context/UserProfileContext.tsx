import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

export type UserProfile = {
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
};

export type Macros = {
  carbs: number;
  protein: number;
  fat: number;
};

type UserProfileContextType = {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  calculateFinalCalories: (profile: UserProfile) => number;
  calculateDuration: (profile: UserProfile) => number;
  getMacroTargets: (totalCal: number, goal: string) => Macros;
  addFood: (mealType: keyof DailyMeals, food: FoodItem) => void;
  updateCurrentWeight: (newWeight: number) => void;
  totalEatenCalories: number;
  totalEatenMacros: Macros;
  startFasting: (goal: number) => void;
  endFasting: () => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
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
  });

  useEffect(() => {
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
  }, []);

  const calculateFinalCalories = (profile: UserProfile): number => {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);

    // BƯỚC A: Tính BMR theo Mifflin-St Jeor
    let bmr = 0;
    if (profile.gender === 'Nam' || profile.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // BƯỚC B: Tính TDEE cơ bản
    const activityKey = String(profile.activityLevel || 'light');
    const multiplier = ACTIVITY_MULTIPLIERS[activityKey] || 1.375; // Default: light
    let tdee = bmr * multiplier;

    // BƯỚC C: Điều chỉnh theo Goal Offset
    if (profile.isPregnant) {
      tdee += 350; 
    } else {
      if (profile.goal === 'lose_weight' || profile.goal === 'lose') {
        tdee -= 500;
      } else if (profile.goal === 'gain_muscle' || profile.goal === 'gain') {
        tdee += 500;
      }
    }

    return Math.round(tdee);
  };

  const calculateDuration = (profile: UserProfile): number => {
    if (profile.goal === 'maintain' || profile.weight === profile.targetWeight) {
      return 8; // 8 weeks for body recomp or maintenance
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
      carbsRatio = 0.30;
      proteinRatio = 0.40;
      fatRatio = 0.30;
    } else if (goal === 'gain_muscle' || goal === 'gain') {
      carbsRatio = 0.50;
      proteinRatio = 0.30;
      fatRatio = 0.20;
    }

    return {
      carbs: Math.round((totalCal * carbsRatio) / 4),
      protein: Math.round((totalCal * proteinRatio) / 4),
      fat: Math.round((totalCal * fatRatio) / 9),
    };
  };

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

  const updateCurrentWeight = (newWeight: number) => {
    setUserProfile((prev) => ({
      ...prev,
      currentWeight: newWeight
    }));
  };

  const meals = userProfile.dailyMeals || { breakfast: [], lunch: [], dinner: [], snack: [] };
  const allFoods = Object.values(meals).flat();
  const totalEatenCalories = allFoods.reduce((sum, item) => sum + item.calories, 0);
  const totalEatenMacros = {
    carbs: allFoods.reduce((sum, item) => sum + (item.carbs || 0), 0),
    protein: allFoods.reduce((sum, item) => sum + (item.protein || 0), 0),
    fat: allFoods.reduce((sum, item) => sum + (item.fat || 0), 0),
  };

  const startFasting = (goal: number) => {
    setUserProfile(prev => ({ ...prev, isFasting: true, fastingStartTime: Date.now(), fastingGoal: goal }));
  };
  
  const endFasting = () => {
    setUserProfile(prev => ({ ...prev, isFasting: false, fastingStartTime: null }));
  };

  return (
    <UserProfileContext.Provider value={{ 
      userProfile, 
      setUserProfile, 
      calculateFinalCalories, 
      calculateDuration,
      getMacroTargets,
      addFood,
      updateCurrentWeight,
      totalEatenCalories,
      totalEatenMacros,
      startFasting,
      endFasting
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
