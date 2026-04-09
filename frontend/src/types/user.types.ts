/**
 * @file user.types.ts
 * @description Hợp đồng dữ liệu chính cho Hồ sơ Người dùng (User Profile).
 * Đây là "Single Source of Truth" — mọi thành phần trong App đều tham chiếu Type này.
 */

import { DailyMeals } from './nutrition.types';

/** Hồ sơ đầy đủ của người dùng NutriTrack */
export type UserProfile = {
  /** Tên hiển thị */
  name?: string;
  /** Email đăng nhập */
  email?: string;
  /** Mục tiêu sức khỏe: 'lose' | 'gain' | 'maintain' */
  goal: string;
  /** Mức độ vận động: Các hệ số (VD: 1.2, 1.375, 1.55) */
  activityLevel: number;
  /** Giới tính: 'male' | 'female' */
  gender: string;
  /** Tuổi (năm) */
  age: number;
  /** Chiều cao (cm) */
  height: number;
  /** Cân nặng ban đầu khi đăng ký (kg) */
  weight: number;
  /** Lượng Calo mục tiêu hàng ngày (kcal) — lấy từ Backend */
  targetCalories: number;
  /** Lượng Protein mục tiêu hàng ngày (g) — lấy từ Backend */
  targetProtein?: number;
  /** Lượng Carb mục tiêu hàng ngày (g) — lấy từ Backend */
  targetCarb?: number;
  /** Lượng Fat mục tiêu hàng ngày (g) — lấy từ Backend */
  targetFat?: number;
  /** Cân nặng hiện tại (kg) — ghi nhận hàng ngày */
  currentWeight?: number;
  /** Danh sách bữa ăn hàng ngày */
  dailyMeals?: DailyMeals;
  /** Lịch sử thay đổi cân nặng (Dùng cho biểu đồ) */
  weightHistory?: { date: string, weight: number }[];
};

/** Giá trị mặc định khi chưa có dữ liệu từ AsyncStorage */
export const DEFAULT_PROFILE: UserProfile = {
  goal: '',
  activityLevel: 0,
  gender: 'male',
  age: 24,
  height: 170,
  weight: 65,
  targetCalories: 0,
  currentWeight: 70,
  dailyMeals: { breakfast: [], lunch: [], dinner: [], snack: [] },
  weightHistory: [],
};
