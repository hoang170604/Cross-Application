/**
 * @file progressService.ts
 * @description API Layer cho module Tiến trình (Cân nặng, Nước, Hoạt động, Dinh dưỡng).
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';
import type { WeightLog, WaterLog, NutritionReportSummary } from '../types/progress.types';
import type { Activity, DailyNutrition, ActivityTypeInfo } from '../types/workout.types';

// ─── Weight ──────────────────────────────────────────────────────────

export const logWeight = async (userId: number, date: string, weight: number): Promise<ApiResponse<WeightLog>> => {
  const response = await apiClient.post<ApiResponse<WeightLog>>('/api/progress/log-weight', { userId, date, weight });
  return response.data;
};

export const getWeightHistory = async (userId: number, startDate: string, endDate: string): Promise<ApiResponse<WeightLog[]>> => {
  const response = await apiClient.get<ApiResponse<WeightLog[]>>(
    `/api/progress/weight?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getLatestWeight = async (userId: number): Promise<ApiResponse<WeightLog>> => {
  const response = await apiClient.get<ApiResponse<WeightLog>>(
    `/api/progress/latest-weight?userId=${userId}`
  );
  return response.data;
};

// ─── Water ───────────────────────────────────────────────────────────

export const logWater = async (userId: number, amountMl: number, logDate: string): Promise<ApiResponse<WaterLog>> => {
  // Backend expects LocalDateTime format for 'timestamp' field
  const timestamp = logDate.includes('T') ? logDate : `${logDate}T${new Date().toTimeString().slice(0, 8)}`;
  const response = await apiClient.post<ApiResponse<WaterLog>>('/api/water/log', { userId, amountMl, timestamp });
  return response.data;
};

export const getDailyWaterTotal = async (userId: number, date: string): Promise<ApiResponse<number>> => {
  const response = await apiClient.get<ApiResponse<number>>(`/api/water/daily-total?userId=${userId}&date=${date}`);
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

export const addActivity = async (userId: number, payload: ActivityPayload): Promise<ApiResponse<Activity>> => {
  const response = await apiClient.post<ApiResponse<Activity>>(`/api/activities/users/${userId}`, payload);
  return response.data;
};

export const updateActivity = async (id: number, payload: Partial<ActivityPayload>): Promise<ApiResponse<Activity>> => {
  const response = await apiClient.put<ApiResponse<Activity>>(`/api/activities/${id}`, payload);
  return response.data;
};

export const deleteActivity = async (id: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/activities/${id}`);
  return response.data;
};

/** Lấy danh mục các loại hoạt động (từ backend dictionary) */
export const getActivityTypes = async (): Promise<ApiResponse<ActivityTypeInfo[]>> => {
  const response = await apiClient.get<ApiResponse<ActivityTypeInfo[]>>('/api/activities/types');
  return response.data;
};

/** Lấy danh sách hoạt động của user trong khoảng ngày */
export const getActivitiesBetween = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<ApiResponse<Activity[]>> => {
  const response = await apiClient.get<ApiResponse<Activity[]>>(
    `/api/activities/users/${userId}/history?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

// ─── Daily Nutrition (Carb / Fat / Protein tổng hợp) ─────────────────────────

/** Lấy tổng dinh dưỡng theo ngày (calories, protein, carb, fat) */
export const getDailyNutrition = async (userId: number, date: string): Promise<ApiResponse<DailyNutrition>> => {
  const response = await apiClient.get<ApiResponse<DailyNutrition>>(
    `/api/progress/nutrition?userId=${userId}&date=${date}`
  );
  return response.data;
};

/** Lấy báo cáo dinh dưỡng theo khoảng ngày */
export const getNutritionReport = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<ApiResponse<DailyNutrition[]>> => {
  const response = await apiClient.get<ApiResponse<DailyNutrition[]>>(
    `/api/progress/report?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

/** Lấy tóm tắt dinh dưỡng theo khoảng ngày */
export const getNutritionSummary = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<ApiResponse<NutritionReportSummary>> => {
  const response = await apiClient.get<ApiResponse<NutritionReportSummary>>(
    `/api/progress/nutrition/summary?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
