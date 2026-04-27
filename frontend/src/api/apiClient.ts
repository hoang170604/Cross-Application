import axios from 'axios';
import { Alert } from 'react-native';
import { getToken } from '../utils/tokenStorage';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Lỗi khi lấy token từ SecureStore', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return standardized response directly or its data
    return response;
  },
  (error) => {
    if (!error.response || error.message === 'Network Error') {
      console.warn('[Network] Máy chủ không thể truy cập, đang chuyển sang Offline Mode.');
      Alert.alert('Lỗi Mạng', 'Máy chủ không thể truy cập, đang chuyển sang Offline Mode.');
    } else {
      // Backend returned standardized error format with status and message
      const serverMessage = error.response.data?.message;
      const isLoginRequest = error.config?.url?.includes('/api/users/login');

      if (error.response.status === 401 && !isLoginRequest) {
        console.warn('[Auth] Phiên đăng nhập hết hạn hoặc không hợp lệ (401)');
        
        // Dynamically import store to avoid circular dependency
        const { useAppStore } = require('../store/useAppStore');
        useAppStore.getState().logout();

        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại để tiếp tục.');
      } else if (serverMessage) {
        Alert.alert('Thông báo', serverMessage);
      } else if (error.response.status >= 500) {
        console.error('[Server Error] Lỗi nghiêm trọng từ Backend:', error.response.status);
        Alert.alert('Lỗi Server', 'Đã có lỗi nghiêm trọng xảy ra ở máy chủ.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
