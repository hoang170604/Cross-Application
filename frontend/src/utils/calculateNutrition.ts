/**
 * @file calculateNutrition.ts
 * @description Các hàm thuần túy (Pure Functions) tính toán chỉ số dinh dưỡng.
 * 
 * QUAN TRỌNG: File này KHÔNG sử dụng bất kỳ React Hook nào.
 * Tất cả hàm đều nhận đầu vào → trả đầu ra, không có side-effect.
 * Tuân thủ nghiêm ngặt Rules of Hooks.
 */

import { Macros, UserProfile } from '@/src/types';

// ─── Hằng số ────────────────────────────────────────────────────────────────

/** Hệ số nhân mức độ vận động (Harris-Benedict Extended) */
export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,    // Ít vận động (ngồi văn phòng)
  light: 1.375,      // Vận động nhẹ (1-3 ngày/tuần)
  moderate: 1.55,    // Vận động vừa (3-5 ngày/tuần)
  active: 1.725,     // Vận động nhiều (6-7 ngày/tuần)
  very_active: 1.9,  // Vận động rất nhiều (2 lần/ngày)
  free: 1.3,         // Tự do (không theo kế hoạch)
};

// ─── Hàm tính toán cốt lõi ──────────────────────────────────────────────────

/**
 * Tính Tỷ lệ Trao đổi Chất Cơ bản (BMR) - Dự phòng khi BE lỗi 404.
 * Sử dụng công thức Mifflin-St Jeor.
 */
export function calculateBMR(gender: string, weight: number, height: number, age: number): number {
  if (!weight || !height || !age) return 0;
  
  if (gender === 'female') {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  // Mặc định Nam
  return (10 * weight) + (6.25 * height) - (5 * age) + 5;
}

/**
 * Tính Tổng Năng lượng Tiêu hao Hàng ngày (TDEE) - Dự phòng khi BE lỗi 404.
 * Điều chỉnh dựa trên baseline và mục tiêu (goal).
 */
export function calculateTDEE(bmr: number, activityMultiplier: number, goal: string): number {
  if (!bmr || !activityMultiplier) return 0;
  
  const baseline = bmr * activityMultiplier;
  
  if (goal === 'lose') {
    return Math.round(baseline - 500);
  } else if (goal === 'gain') {
    return Math.round(baseline + 500);
  }
  
  // Mặc định là maintain hoặc mục tiêu khác
  return Math.round(baseline);
}

/**
 * Tính Chỉ số Khối Cơ thể (Body Mass Index).
 *
 * @param weight - Cân nặng (kg)
 * @param heightCm - Chiều cao (cm)
 * @returns Chỉ số BMI (làm tròn 1 chữ số thập phân)
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const h = Number(heightCm) / 100; // cm → m
  const w = Number(weight);
  if (h <= 0) return 0;
  return Math.round((w / (h * h)) * 10) / 10;
}

// ─── Hàm Legacy (tương thích Onboarding) ────────────────────────────────────

/**
 * Quy đổi lượng Calo dư thừa thành số phút đi bộ nhanh.
 * Định mức: 100 kcal ≈ 20 phút đi bộ (tốc độ trung bình 5 km/h).
 *
 * @param kcal - Số Calo cần đốt cháy
 * @returns Số phút đi bộ (làm tròn lên)
 */
export function caloriesToWalkMinutes(kcal: number): number {
  return Math.ceil((Math.abs(kcal) / 100) * 20);
}
