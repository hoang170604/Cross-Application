/**
 * @file progressService.ts
 * @description API Layer cho module Tiến trình (Cân nặng, Nước, Hoạt động, Dinh dưỡng).
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';

// ─── Weight ──────────────────────────────────────────────────────────

export const logWeight = async (userId: number, date: string, weight: number): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>('/api/progress/log-weight', { userId, date, weight });
  return response.data;
};

export const getWeightHistory = async (userId: number, startDate: string, endDate: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/progress/weight?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getLatestWeight = async (userId: number): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/progress/latest-weight?userId=${userId}`
  );
  return response.data;
};

// ─── Water ───────────────────────────────────────────────────────────

export const logWater = async (userId: number, amountMl: number, logDate: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>('/api/water/log', { userId, amountMl, timestamp: logDate });
  return response.data;
};

export const getDailyWaterTotal = async (userId: number, date: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/api/water/daily-total?userId=${userId}&date=${date}`);
  return response.data;
};

// ─── Activity ────────────────────────────────────────────────────────

export interface ActivityPayload {
  activityType: string;
  durationMinutes: number;
  caloriesBurned: number;
  startTime?: string;
  distanceKm?: number;
  steps?: number;
  source?: string;
  externalId?: string;
}

export const addActivity = async (userId: number, payload: ActivityPayload): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>(`/api/activities/users/${userId}`, payload);
  return response.data;
};

export const updateActivity = async (id: number, payload: Partial<ActivityPayload>): Promise<ApiResponse<any>> => {
  const response = await apiClient.put<ApiResponse<any>>(`/api/activities/${id}`, payload);
  return response.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/activities/${id}`);
};

/** Lấy danh mục các loại hoạt động (từ backend dictionary) */
export const getActivityTypes = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>('/api/activities/types');
  return response.data;
};

/** Lấy danh sách hoạt động của user trong khoảng ngày */
export const getActivitiesBetween = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/activities/users/${userId}?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

// ─── Daily Nutrition (Carb / Fat / Protein tổng hợp) ─────────────────────────

/** Lấy tổng dinh dưỡng theo ngày (calories, protein, carb, fat) */
export const getDailyNutrition = async (userId: number, date: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/progress/nutrition?userId=${userId}&date=${date}`
  );
  return response.data;
};

/** Lấy báo cáo dinh dưỡng theo khoảng ngày */
export const getNutritionReport = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/progress/report?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

/** Lấy tóm tắt dinh dưỡng theo khoảng ngày */
export const getNutritionSummary = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/progress/nutrition/summary?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
