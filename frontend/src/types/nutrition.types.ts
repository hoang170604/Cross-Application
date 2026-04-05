/**
 * @file nutrition.types.ts
 * @description Hợp đồng dữ liệu (Data Contracts) cho hệ thống Dinh dưỡng.
 * Định nghĩa cấu trúc của Món ăn, Bữa ăn và Chỉ số Macros.
 */

/** Đối tượng thực phẩm đơn lẻ với thành phần dinh dưỡng */
export type FoodItem = {
  /** Mã định danh duy nhất của món ăn */
  id: string;
  /** Tên hiển thị của món ăn */
  name: string;
  /** Năng lượng (kcal) */
  calories: number;
  /** Hàm lượng Chất đạm (g) */
  protein: number;
  /** Hàm lượng Tinh bột (g) */
  carbs: number;
  /** Hàm lượng Chất béo (g) */
  fat: number;
};

/** Cấu trúc 4 bữa ăn trong ngày */
export type DailyMeals = {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snack: FoodItem[];
};

/** Chỉ số dinh dưỡng đa lượng (Macronutrients) tính bằng gram */
export type Macros = {
  /** Tinh bột (g) */
  carbs: number;
  /** Chất đạm (g) */
  protein: number;
  /** Chất béo (g) */
  fat: number;
};
