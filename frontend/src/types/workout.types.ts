/**
 * @file workout.types.ts
 * @description Hợp đồng dữ liệu cho module Tập luyện (Activity, WorkoutChallenge, DailyNutrition).
 */

/** Bản ghi hoạt động thể chất */
export type Activity = {
  id: number;
  userId?: number;
  activityType: string;
  durationMinutes: number;
  caloriesBurned: number;
  logDate?: string;
  startTime?: string;
  distanceKm?: number;
  steps?: number;
  source?: string;
  externalId?: string;
  createdAt?: string;
  /** uid cục bộ (frontend only) để định danh trước khi có id từ server */
  uid?: string;
};

/** Thông tin loại bài tập (từ backend dictionary) */
export type ActivityTypeInfo = {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  caloriesPerMin: number;
};

/** Thử thách tập luyện */
export type WorkoutChallenge = {
  id?: number;
  userId: number;
  challengeName: string;
  targetValue: number;
  currentValue?: number;
  unit?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
};

/** Tổng hợp dinh dưỡng theo ngày (từ backend – carb, fat, protein) */
export type DailyNutrition = {
  userId?: number;
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarb: number;
  totalFat: number;
};
