/**
 * @file diaryService.ts
 * @description API Layer cho module Nhật ký dinh dưỡng (Diary / Meals).
 */

import apiClient from './apiClient';

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
) => {
  const response = await apiClient.post(
    `/api/diary/users/${userId}/meals/${mealType}?date=${date}`,
    payload
  );
  return response.data;
};

/** Lấy nhật ký bữa ăn theo ngày */
export const getDiary = async (userId: number, date: string) => {
  const response = await apiClient.get(`/api/diary/users/${userId}?date=${date}`);
  return response.data;
};

/** Cập nhật một MealLog */
export const updateMealLog = async (id: number, payload: Partial<MealLogPayload>) => {
  const response = await apiClient.put(`/api/diary/meallogs/${id}`, payload);
  return response.data;
};

/** Xóa một MealLog */
export const deleteMealLog = async (id: number) => {
  await apiClient.delete(`/api/diary/meallogs/${id}`);
};
