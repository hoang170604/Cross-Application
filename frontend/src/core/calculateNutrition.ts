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

/**
 * Tính Tỷ lệ Trao đổi Chất Cơ bản (BMR) theo công thức Mifflin-St Jeor.
 */
export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += (gender.toLowerCase() === 'nam' || gender.toLowerCase() === 'male' ? 5 : -161);
  return Math.round(bmr);
}

/**
 * Tính toán mục tiêu Calo và Macros dựa trên hồ sơ và mục tiêu.
 */
export function calculateNutritionalGoals(profile: {
  weight: number;
  height: number;
  age: number;
  gender: string;
  goal: string;
  activityLevel?: number | string;
}) {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  
  // Hệ số hoạt động (mặc định 1.2 cho Sedentary nếu không có)
  const activityMultiplier = typeof profile.activityLevel === 'number' ? profile.activityLevel : 1.2;
  let tdee = bmr * activityMultiplier;

  // Điều chỉnh calo và tỷ lệ macros theo mục tiêu
  const g = profile.goal ? profile.goal.toLowerCase() : 'maintain';
  
  let proteinRatio = 0.30;
  let carbRatio = 0.40;
  let fatRatio = 0.30;

  if (g === 'lose_weight') {
    tdee -= 500;
    proteinRatio = 0.40;
    carbRatio = 0.30;
    fatRatio = 0.30;
  } else if (g === 'build_muscle' || g === 'gain_muscle') {
    tdee += 500;
    proteinRatio = 0.30;
    carbRatio = 0.50;
    fatRatio = 0.20;
  }

  const targetCalories = Math.max(1200, Math.round(tdee)); // Không để calo quá thấp

  return {
    targetCalories,
    targetProtein: Math.round((targetCalories * proteinRatio) / 4),
    targetCarb: Math.round((targetCalories * carbRatio) / 4),
    targetFat: Math.round((targetCalories * fatRatio) / 9),
  };
}
