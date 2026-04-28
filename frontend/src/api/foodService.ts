/**
 * @file foodService.ts
 * @description API Layer cho module Thực phẩm (Food, FoodCategory, Nutrition Calculation).
 * Endpoints: GET/POST/PUT/DELETE /api/foods/*
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';
import type { Food, FoodCategory, FoodPayload, NutritionCalculation } from '../types/food.types';
import type { MealLog } from '../types/diary.types';

// ─── Food CRUD ────────────────────────────────────────────────────────

/** Lấy tất cả thực phẩm */
export const getAllFoods = async (): Promise<ApiResponse<Food[]>> => {
  const response = await apiClient.get<ApiResponse<Food[]>>('/api/foods');
  return response.data;
};

/** Tìm kiếm thực phẩm theo tên */
export const searchFoodByName = async (name: string): Promise<ApiResponse<Food[]>> => {
  const response = await apiClient.get<ApiResponse<Food[]>>(`/api/foods/search?name=${encodeURIComponent(name)}`);
  return response.data;
};

/** Lấy thực phẩm theo ID */
export const getFoodById = async (id: number): Promise<ApiResponse<Food>> => {
  const response = await apiClient.get<ApiResponse<Food>>(`/api/foods/${id}`);
  return response.data;
};

/** Tạo thực phẩm mới (ADMIN) */
export const createFood = async (payload: FoodPayload): Promise<ApiResponse<Food>> => {
  const response = await apiClient.post<ApiResponse<Food>>('/api/foods', payload);
  return response.data;
};

/** Cập nhật thực phẩm (ADMIN) */
export const updateFood = async (id: number, payload: Partial<FoodPayload>): Promise<ApiResponse<Food>> => {
  const response = await apiClient.put<ApiResponse<Food>>(`/api/foods/${id}`, payload);
  return response.data;
};

/** Xóa thực phẩm (ADMIN) */
export const deleteFood = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/foods/${id}`);
  return response.data;
};

// ─── Food Categories ──────────────────────────────────────────────────

/** Lấy tất cả danh mục thực phẩm */
export const getAllCategories = async (): Promise<ApiResponse<FoodCategory[]>> => {
  const response = await apiClient.get<ApiResponse<FoodCategory[]>>('/api/foods/categories');
  return response.data;
};

// ─── Nutrition Calculation ────────────────────────────────────────────

/** Tính dinh dưỡng theo gram thực phẩm */
export const calculateNutrition = async (foodId: number, weight: number): Promise<ApiResponse<NutritionCalculation>> => {
  const response = await apiClient.get<ApiResponse<NutritionCalculation>>(`/api/foods/${foodId}/calculate?weight=${weight}`);
  return response.data;
};

// ─── Add Food to Meal ─────────────────────────────────────────────────

/** Thêm thực phẩm vào bữa ăn (qua FoodController) */
export const addFoodToMealByWeight = async (
  userId: number,
  mealId: number,
  foodId: number,
  weight: number
): Promise<ApiResponse<MealLog>> => {
  const response = await apiClient.post<ApiResponse<MealLog>>(
    `/api/foods/meals/${userId}/${mealId}/foods?foodId=${foodId}&weight=${weight}`
  );
  return response.data;
};
