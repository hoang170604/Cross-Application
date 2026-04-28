/**
 * @file diary.types.ts
 * @description Hợp đồng dữ liệu cho module Nhật ký Dinh dưỡng (Meal, MealLog).
 * Khớp với entities Meal.java và MealLog.java ở Backend.
 */

import type { Food } from './food.types';

/** Bản ghi một MealLog (khớp với entity MealLog.java) */
export type MealLog = {
  id: number;
  food: Food;
  meal?: Meal;
  quantity: number;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
};

/** Bữa ăn (khớp với entity Meal.java) */
export type Meal = {
  id: number;
  user?: { id: number };
  mealType: string;
  date: string;
  mealLogs?: MealLog[];
};
