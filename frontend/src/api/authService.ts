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
  // return new Promise((resolve) => {
  //   // Dùng setTimeout để giả lập độ trễ của mạng (ví dụ 1 giây) cho cảm giác chân thực
  //   setTimeout(() => {
  //     resolve({
  //       status: 200,
  //       // Tùy thuộc vào việc interface ApiResponse của bạn định nghĩa thế nào, 
  //       // bạn cần điều chỉnh các trường (status, message...) cho khớp.
  //       success: true, 
  //       message: 'Đăng nhập giả lập thành công',
  //       data: {
  //         token: 'fake-jwt-token-123456789-abcdef', // Đây là token giả
  //         userId: 999, // Một ID bất kỳ
  //         email: email, // Lấy luôn email bạn vừa gõ trên UI
  //       }
  //     } as ApiResponse<AuthResponse>); // Ép kiểu để TypeScript không báo lỗi
  //   }, 1000); 
  // });
};

export const syncOnboardingProfile = async (userId: number, profileData: any): Promise<ApiResponse<any>> => {
  const response = await apiClient.put<ApiResponse<any>>(`/api/users/${userId}/profile`, profileData);
  return response.data;
};
