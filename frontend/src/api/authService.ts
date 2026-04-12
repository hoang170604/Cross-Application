import apiClient from './apiClient';

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
}

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/users/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/users/login', { email, password });
  return response.data;
};

export const syncOnboardingProfile = async (userId: number, profileData: any) => {
  const response = await apiClient.put(`/api/users/${userId}/profile`, profileData);
  return response.data;
};
