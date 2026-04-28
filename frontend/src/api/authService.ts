/**
 * @file authService.ts
 * @description API Layer cho module Xác thực (Register, Login, Onboarding Sync).
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';
import type { NutritionGoal } from '../types/progress.types';

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: string;
  expiresIn: number;
}

/** Đăng ký tài khoản */
export const registerUser = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/users/register', { email, password });
  return response.data;
};

/** Đăng nhập */
export const loginUser = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/users/login', { email, password });
  return response.data;
};

/** Đồng bộ hồ sơ onboarding và tính mục tiêu dinh dưỡng */
export const syncOnboardingProfile = async (userId: number, profileData: Record<string, unknown>): Promise<ApiResponse<NutritionGoal>> => {
  const response = await apiClient.put<ApiResponse<NutritionGoal>>(`/api/users/${userId}/profile`, profileData);
  return response.data;
};
