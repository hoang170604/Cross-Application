/**
 * @file user.types.ts
 * @description Hợp đồng dữ liệu chính cho Hồ sơ Người dùng (User Profile).
 * Đây là "Single Source of Truth" — mọi thành phần trong App đều tham chiếu Type này.
 */

import { DailyMeals } from './nutrition.types';
import { FastingSession, WorkoutChallengeState } from './fasting.types';

/** Hồ sơ đầy đủ của người dùng NutriTrack */
export type UserProfile = {
  /** Tên hiển thị */
  name?: string;
  /** Email đăng nhập */
  email?: string;
  /** Mục tiêu sức khỏe: 'lose_weight' | 'gain_muscle' | 'maintain' */
  goal: string;
  /** Chế độ ăn kiêng đã chọn từ Onboarding */
  dietMode: number | '';
  /** Mức độ vận động: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' */
  activityLevel: string;
  /** Có đang mang thai không (ảnh hưởng TDEE +350 kcal) */
  isPregnant: boolean;
  /** Có tiểu đường không */
  hasDiabetes: boolean;
  /** Giới tính: 'Nam' | 'Nữ' */
  gender: string;
  /** Tuổi (năm) */
  age: number;
  /** Chiều cao (cm) */
  height: number;
  /** Cân nặng ban đầu khi đăng ký (kg) */
  weight: number;
  /** Cân nặng mục tiêu (kg) */
  targetWeight: number;
  /** Tốc độ thay đổi cân nặng (kg/tuần) */
  speed: number;
  /** Lượng Calo mục tiêu hàng ngày (kcal) — tính từ Onboarding */
  targetCalories: number;
  /** Cân nặng hiện tại (kg) — ghi nhận hàng ngày */
  currentWeight?: number;
  /** Danh sách bữa ăn hàng ngày */
  dailyMeals?: DailyMeals;
  /** Số ngày liên tiếp sử dụng App */
  streakCount?: number;
  /** Ngày hoạt động cuối cùng (YYYY-MM-DD) */
  lastActiveDate?: string;
  /** Chế độ nhịn ăn có được bật không */
  isFasting?: boolean;
  /** Mốc bắt đầu phiên nhịn ăn hiện tại (Unix ms) */
  fastingStartTime?: number | null;
  /** Số giờ mục tiêu nhịn ăn (VD: 16 cho lộ trình 16:8) */
  fastingGoal?: number;
  /** Trạng thái hiện tại: đang nhịn hay đang ăn */
  fastingState?: 'FASTING' | 'EATING';
  /** Lịch sử các phiên nhịn ăn đã hoàn thành */
  fastingHistory?: FastingSession[];
  /** Lượng nước đã uống hôm nay (ml) */
  waterIntake?: number;
  /** Mục tiêu nước uống hàng ngày (ml) */
  waterTarget?: number;
  /** Ngày cuối cùng ghi nhận nước (để reset hàng ngày) */
  lastWaterDate?: string;
  /** Lượng Calo đã đốt thêm từ vận động bổ sung */
  extraBurnedCalories?: number;
  /** Trạng thái Thử thách Vận động hiện tại */
  workoutChallenge?: WorkoutChallengeState;
  /** Lịch sử thay đổi cân nặng (Dùng cho biểu đồ) */
  weightHistory?: { date: string, weight: number }[];
};

/** Giá trị mặc định khi chưa có dữ liệu từ AsyncStorage */
export const DEFAULT_PROFILE: UserProfile = {
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
  weightHistory: [],
};
