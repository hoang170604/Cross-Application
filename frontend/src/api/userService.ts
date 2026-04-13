/**
 * @file userService.ts
 * @description API Layer cho module Người dùng (Profile, Password).
 */

import apiClient from './apiClient';

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
export const getUserById = async (userId: number) => {
  const response = await apiClient.get(`/api/users/${userId}`);
  return response.data;
};

/** Cập nhật hồ sơ và tính toán mục tiêu dinh dưỡng */
export const updateProfileAndCalculateGoal = async (userId: number, profile: UserProfilePayload) => {
  const response = await apiClient.put(`/api/users/${userId}/profile`, profile);
  return response.data;
};

/** Đổi mật khẩu */
export const changePassword = async (userId: number, newPassword: string) => {
  const response = await apiClient.put(`/api/users/${userId}/password`, { newPassword });
  return response.data;
};

/** Yêu cầu đặt lại mật khẩu */
export const requestPasswordReset = async (email: string) => {
  const response = await apiClient.post('/api/users/password-reset', { email });
  return response.data;
};
