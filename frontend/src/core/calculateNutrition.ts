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
