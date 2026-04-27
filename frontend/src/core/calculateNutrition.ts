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

  // Điều chỉnh calo theo mục tiêu
  if (profile.goal === 'lose_weight') tdee -= 500;
  else if (profile.goal === 'gain_muscle') tdee += 500;

  const targetCalories = Math.max(1200, Math.round(tdee)); // Không để calo quá thấp

  return {
    targetCalories,
    targetProtein: Math.round((targetCalories * 0.3) / 4), // 30% Protein
    targetCarb: Math.round((targetCalories * 0.45) / 4),  // 45% Carb
    targetFat: Math.round((targetCalories * 0.25) / 9),   // 25% Fat
  };
}
