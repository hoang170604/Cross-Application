/**
 * @file food.types.ts
 * @description Hợp đồng dữ liệu cho module Thực phẩm (Food, FoodCategory).
 * Khớp với entity Food.java và FoodCategory.java ở Backend.
 */

/** Danh mục thực phẩm */
export type FoodCategory = {
  id: number;
  name: string;
};

/** Thực phẩm từ database (khớp với entity Food.java) */
export type Food = {
  id: number;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbPer100g: number;
  fatPer100g: number;
  category?: FoodCategory;
};

/** Payload khi tạo/cập nhật Food (khớp với FoodDTO.java) */
export type FoodPayload = {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbPer100g: number;
  fatPer100g: number;
  categoryId?: number;
};

/** Kết quả tính toán dinh dưỡng theo gram */
export type NutritionCalculation = {
  calories: number;
  protein: number;
  carb: number;
  fat: number;
};
