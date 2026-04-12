import apiClient from './apiClient';

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
}

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  // GIẢ LẬP: Trả về thành công ngay lập tức để test UI
  console.log('[Mock] Registering user:', email);
  return {
    token: 'mock-token-' + Date.now(),
    userId: 999,
    email: email
  };
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  // GIẢ LẬP: Trả về thành công ngay lập tức để test UI
  console.log('[Mock] Logging in user:', email);
  return {
    token: 'mock-token-' + Date.now(),
    userId: 999,
    email: email
  };
};

export const syncOnboardingProfile = async (userId: number, profileData: any) => {
  // GIẢ LẬP: Trả về kết quả tính toán mẫu
  console.log('[Mock] Syncing profile for user:', userId, profileData);
  return {
    targetCalories: 2100,
    targetProtein: 150,
    targetCarb: 250,
    targetFat: 70
  };
};
