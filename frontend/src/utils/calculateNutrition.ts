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
 * @param activityLevel - Mức độ vận động
 * @param goal - Mục tiêu ('lose_weight' | 'gain_muscle' | 'maintain')
 * @param isPregnant - Có mang thai không (cộng 350 kcal)
 * @returns Lượng Calo cần nạp mỗi ngày (kcal)
 */
export function calculateTDEE(bmr: number, activityLevel: string, goal: string, isPregnant: boolean): number {
  const activityKey = String(activityLevel || 'light');
  const multiplier = ACTIVITY_MULTIPLIERS[activityKey] || 1.375;
  let result = bmr * multiplier;

  if (isPregnant) {
    result += 350;
  } else {
    if (goal === 'lose_weight' || goal === 'lose') {
      result -= 500;
    } else if (goal === 'gain_muscle' || goal === 'gain') {
      result += 500;
    }
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

/**
 * Tính chỉ số Macros mục tiêu theo tỷ lệ phụ thuộc mục tiêu sức khỏe.
 * - Giảm cân: Ưu tiên Đạm (40%), giảm Tinh bột (30%)
 * - Tăng cơ: Ưu tiên Tinh bột (50%), tăng Đạm (30%)
 * - Duy trì: Cân bằng theo tỷ lệ tiêu chuẩn
 *
 * @param totalCal - Tổng Calo mục tiêu (kcal)
 * @param goal - Mục tiêu sức khỏe
 * @returns Đối tượng Macros (gram)
 */
export function getMacroTargets(totalCal: number, goal: string): Macros {
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
}

// ─── Hàm Legacy (tương thích Onboarding) ────────────────────────────────────

/**
 * Tính Calo mục tiêu hàng ngày từ toàn bộ hồ sơ.
 * Hàm "all-in-one" dành cho màn hình Onboarding khi chưa có Context.
 *
 * @param profile - Hồ sơ người dùng đầy đủ
 * @returns Lượng Calo mục tiêu (kcal/ngày)
 */
export function calculateFinalCalories(profile: UserProfile): number {
  const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
  return calculateTDEE(bmr, profile.activityLevel, profile.goal, profile.isPregnant);
}

/**
 * Tính thời lượng dự kiến để đạt mục tiêu cân nặng (tuần).
 *
 * @param profile - Hồ sơ người dùng
 * @returns Số tuần dự kiến (tối thiểu 4 tuần)
 */
export function calculateDuration(profile: UserProfile): number {
  if (profile.goal === 'maintain' || profile.weight === profile.targetWeight) {
    return 8;
  }
  const weightDiff = Math.abs(profile.weight - profile.targetWeight);
  const spd = profile.speed || 0.5;
  let weeks = Math.ceil(weightDiff / spd);
  if (weeks < 4) weeks = 4;
  return weeks;
}

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
