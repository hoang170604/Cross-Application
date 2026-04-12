/**
 * @file user.types.ts
 * @description Hợp đồng dữ liệu chính cho Hồ sơ Người dùng (User Profile).
 */

import { DailyMeals } from "./nutrition.types";

/** Hồ sơ sinh lý gửi lên Backend (Lỗi #7) */
export type UserProfile = {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: number;
  goal: string;

  /** 
   * LOCAL ONLY FIELDS
   * Các trường dưới đây không thuộc UserProfileDTO của Backend 
   * nhưng cần thiết để duy trì hoạt động của ứng dụng tại Frontend.
   */
  name?: string;
  fastingGoal?: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarb?: number;
  targetFat?: number;
  currentWeight?: number;
  dailyMeals?: DailyMeals;
  weightHistory?: { date: string, weight: number }[];
};

/** Giá trị mặc định khi khởi tạo */
export const DEFAULT_PROFILE: UserProfile = {
  age: 25,
  gender: 'male',
  height: 170,
  weight: 70,
  activityLevel: 1.375,
  goal: 'maintain',
  name: '',
  targetCalories: 0,
  currentWeight: 70,
  dailyMeals: { breakfast: [], lunch: [], dinner: [], snack: [] },
  weightHistory: [],
};
