/**
 * @file progressService.ts
 * @description API Layer cho module Tiến trình (Cân nặng, Nước, Hoạt động).
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';

// ─── Weight ──────────────────────────────────────────────────────────

export const logWeight = async (userId: number, date: string, weight: number): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>('/api/progress/weight', { userId, date, weight });
  return response.data;
};

export const getWeightHistory = async (userId: number, startDate: string, endDate: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/progress/weight/history?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

// ─── Water ───────────────────────────────────────────────────────────

export const logWater = async (amountMl: number, logDate: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>('/api/water', { amountMl, logDate });
  return response.data;
};

export const getDailyWaterTotal = async (userId: number, date: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/api/water/daily?userId=${userId}&date=${date}`);
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
  const response = await apiClient.post<ApiResponse<any>>(`/api/activity/users/${userId}`, payload);
  return response.data;
};

export const updateActivity = async (id: number, payload: Partial<ActivityPayload>): Promise<ApiResponse<any>> => {
  const response = await apiClient.put<ApiResponse<any>>(`/api/activity/${id}`, payload);
  return response.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/activity/${id}`);
};
