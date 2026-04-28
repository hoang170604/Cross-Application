/**
 * @file userService.ts
 * @description API Layer cho module Người dùng (Profile, Password, Goal).
 */

import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';
import type { NutritionGoal } from '../types/progress.types';

/** Hồ sơ người dùng trả về từ backend (khớp với UserController GET /profile) */
export interface UserProfileResponse {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: number;
  goal: string;
}

/** Thông tin user cơ bản (khớp với UserDTO.java) */
export interface UserInfo {
  id: number;
  email: string;
  role: string;
}

export interface UserProfilePayload {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: number;
  goal: string;
  name?: string;
  fastingGoal?: string;
}

/** Lấy thông tin user theo ID */
export const getUserById = async (userId: number): Promise<ApiResponse<UserInfo>> => {
  const response = await apiClient.get<ApiResponse<UserInfo>>(`/api/users/${userId}`);
  return response.data;
};

/** Lấy hồ sơ cá nhân (profile) của user */
export const getUserProfile = async (userId: number): Promise<ApiResponse<UserProfileResponse>> => {
  const response = await apiClient.get<ApiResponse<UserProfileResponse>>(`/api/users/${userId}/profile`);
  return response.data;
};

/** Lấy mục tiêu dinh dưỡng hiện tại của user */
export const getUserGoal = async (userId: number): Promise<ApiResponse<NutritionGoal>> => {
  const response = await apiClient.get<ApiResponse<NutritionGoal>>(`/api/users/${userId}/goal`);
  return response.data;
};

/** Cập nhật hồ sơ và tính toán mục tiêu dinh dưỡng */
export const updateProfileAndCalculateGoal = async (userId: number, profile: UserProfilePayload): Promise<ApiResponse<NutritionGoal>> => {
  const response = await apiClient.put<ApiResponse<NutritionGoal>>(`/api/users/${userId}/profile`, profile);
  return response.data;
};

/** Đổi mật khẩu */
export const changePassword = async (userId: number, newPassword: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.put<ApiResponse<null>>(`/api/users/${userId}/password`, { newPassword });
  return response.data;
};

/** Yêu cầu đặt lại mật khẩu */
export const requestPasswordReset = async (email: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>('/api/users/password-reset', { email });
  return response.data;
};
