/**
 * @file progress.types.ts
 * @description Hợp đồng dữ liệu cho module Tiến trình (Weight, Water, Nutrition Report).
 * Khớp với entities WeightLog, WaterLog, DailyNutrition, ReportSummary ở Backend.
 */

/** Bản ghi cân nặng (khớp với entity WeightLog.java) */
export type WeightLog = {
  id: number;
  user?: { id: number; email?: string };
  date: string;
  weight: number;
};

/** Bản ghi uống nước (khớp với entity WaterLog.java) */
export type WaterLog = {
  id: number;
  user?: { id: number };
  logDate: string;
  amountMl: number;
  source?: string;
  externalId?: string;
  createdAt?: string;
};

/** Tổng hợp báo cáo dinh dưỡng (khớp với ReportSummary.java) */
export type NutritionReportSummary = {
  userId: number;
  startDate: string;
  endDate: string;
  totalCalories: number;
  averageCaloriesPerDay: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

/** Mục tiêu dinh dưỡng (khớp với entity NutritionGoal.java) */
export type NutritionGoal = {
  id: number;
  targetCalories: number;
  targetProtein: number;
  targetCarb: number;
  targetFat: number;
  createdAt?: string;
};
