/**
 * @file diaryService.ts
 * @description API Layer cho module Nhật ký dinh dưỡng (Diary / Meals).
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';
import type { MealLog, Meal } from '../types/diary.types';

export interface MealLogPayload {
  foodId: number;
  quantity: number;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
}

/** Thêm món ăn vào bữa */
export const addFoodToMeal = async (
  userId: number,
  mealType: string,
  date: string,
  payload: MealLogPayload
): Promise<ApiResponse<MealLog>> => {
  const response = await apiClient.post<ApiResponse<MealLog>>(
    `/api/diaries/users/${userId}/meals/${mealType}?date=${date}`,
    payload
  );
  return response.data;
};

/** Lấy nhật ký bữa ăn theo ngày */
export const getDiary = async (userId: number, date: string): Promise<ApiResponse<Meal[]>> => {
  const response = await apiClient.get<ApiResponse<Meal[]>>(`/api/diaries/users/${userId}?date=${date}`);
  return response.data;
};

/** Cập nhật một MealLog */
export const updateMealLog = async (id: number, payload: Partial<MealLogPayload>): Promise<ApiResponse<MealLog>> => {
  const response = await apiClient.put<ApiResponse<MealLog>>(`/api/diaries/meal-logs/${id}`, payload);
  return response.data;
};

/** Xóa một MealLog */
export const deleteMealLog = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/diaries/meal-logs/${id}`);
  return response.data;
};
