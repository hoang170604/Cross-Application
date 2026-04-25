import apiClient from './apiClient';
import { ApiResponse } from '../types/api.types';

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
}

export const registerUser = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/users/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/users/login', { email, password });
  return response.data;
};

export const syncOnboardingProfile = async (userId: number, profileData: any): Promise<ApiResponse<any>> => {
  const response = await apiClient.put<ApiResponse<any>>(`/api/users/${userId}/profile`, profileData);
  return response.data;
};
