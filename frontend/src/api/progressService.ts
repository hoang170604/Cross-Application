/**
 * @file progressService.ts
 * @description API Layer cho module Tiến trình (Cân nặng, Nước, Hoạt động).
 */

import apiClient from './apiClient';

// ─── Weight ──────────────────────────────────────────────────────────

export const logWeight = async (userId: number, date: string, weight: number) => {
  const response = await apiClient.post('/api/progress/weight', { userId, date, weight });
  return response.data;
};

export const getWeightHistory = async (userId: number, startDate: string, endDate: string) => {
  const response = await apiClient.get(
    `/api/progress/weight/history?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

// ─── Water ───────────────────────────────────────────────────────────

export const logWater = async (amountMl: number, logDate: string) => {
  const response = await apiClient.post('/api/water', { amountMl, logDate });
  return response.data;
};

export const getDailyWaterTotal = async (userId: number, date: string) => {
  const response = await apiClient.get(`/api/water/daily?userId=${userId}&date=${date}`);
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

export const addActivity = async (userId: number, payload: ActivityPayload) => {
  const response = await apiClient.post(`/api/activity/users/${userId}`, payload);
  return response.data;
};

export const updateActivity = async (id: number, payload: Partial<ActivityPayload>) => {
  const response = await apiClient.put(`/api/activity/${id}`, payload);
  return response.data;
};

export const deleteActivity = async (id: number) => {
  await apiClient.delete(`/api/activity/${id}`);
};
