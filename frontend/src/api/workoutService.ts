/**
 * @file workoutService.ts
 * @description API Layer cho module Thử thách Tập luyện (WorkoutChallenge).
 * Endpoints: GET /api/workout-challenges, POST, PUT, DELETE
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';

export interface WorkoutChallengePayload {
  userId: number;
  challengeName: string;
  targetValue: number;
  currentValue?: number;
  unit?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

// ─── Workout Challenge ────────────────────────────────────────────────

/** Lấy tất cả thử thách tập luyện (public) */
export const listAllChallenges = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>('/api/workout-challenges');
  return response.data;
};

/** Lấy thử thách của một user */
export const listUserChallenges = async (userId: number): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/api/workout-challenges/user/${userId}`);
  return response.data;
};

/** Lấy chi tiết một thử thách */
export const getChallengeById = async (id: number): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/api/workout-challenges/${id}`);
  return response.data;
};

/** Tạo thử thách mới */
export const createChallenge = async (payload: WorkoutChallengePayload): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>('/api/workout-challenges', payload);
  return response.data;
};

/** Cập nhật thử thách */
export const updateChallenge = async (
  id: number,
  payload: Partial<WorkoutChallengePayload>
): Promise<ApiResponse<any>> => {
  const response = await apiClient.put<ApiResponse<any>>(`/api/workout-challenges/${id}`, payload);
  return response.data;
};

/** Xóa thử thách */
export const deleteChallenge = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/workout-challenges/${id}`);
};
