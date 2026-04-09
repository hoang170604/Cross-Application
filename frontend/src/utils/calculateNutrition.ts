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
 * Tính Tỷ lệ Trao đổi Chất Cơ bản (Basal Metabolic Rate).
 * Áp dụng phương trình Mifflin-St Jeor (1990) — chuẩn vàng y khoa.
 *
 * @param gender - Giới tính ('Nam' | 'male' | 'Nữ' | 'female')
 * @param weight - Cân nặng (kg)
 * @param height - Chiều cao (cm)
 * @param age - Tuổi (năm)
 * @returns Lượng Calo cơ thể đốt khi nghỉ ngơi hoàn toàn (kcal/ngày)
 */
export function calculateBMR(gender: string, weight: number, height: number, age: number): number {
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);
  if (gender === 'Nam' || gender === 'male') {
    return Math.round((10 * w) + (6.25 * h) - (5 * a) + 5);
  }
  return Math.round((10 * w) + (6.25 * h) - (5 * a) - 161);
}

/**
 * Tính Tổng Năng lượng Tiêu hao Hàng ngày (Total Daily Energy Expenditure).
 * TDEE = BMR × Hệ số vận động ± Điều chỉnh theo mục tiêu.
 *
 * @param bmr - Chỉ số BMR đã tính
 * @param activityMultiplier - Mức độ vận động (hệ số)
 * @param goal - Mục tiêu ('lose' | 'gain' | 'maintain')
 * @returns Lượng Calo cần nạp mỗi ngày (kcal)
 */
export function calculateTDEE(bmr: number, activityMultiplier: number, goal: string): number {
  const multiplier = activityMultiplier || 1.375;
  let result = bmr * multiplier;

  if (goal === 'lose_weight' || goal === 'lose') {
    result -= 500;
  } else if (goal === 'gain_muscle' || goal === 'gain') {
    result += 500;
  }
  return Math.round(result);
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
