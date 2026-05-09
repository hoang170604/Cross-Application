import axios from 'axios';
import { Alert } from 'react-native';
import { getToken } from '../utils/tokenStorage';

const apiClient = axios.create({
  baseURL: 'http://192.168.1.52:8081',
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
        let translatedMessage = String(serverMessage);
        const msg = translatedMessage.toLowerCase().trim();
        
        if (msg.includes('invalid credentials')) {
          translatedMessage = 'Email hoặc mật khẩu không chính xác.';
        } else if (msg.includes('not found')) {
          translatedMessage = 'Không tìm thấy tài khoản này.';
        } else if (msg.includes('missing required')) {
          translatedMessage = 'Vui lòng nhập đầy đủ thông tin.';
        } else if (msg.includes('already exists') || msg.includes('already taken') || msg.includes('already registered')) {
          translatedMessage = 'Email này đã được sử dụng.';
        } else if (msg.includes('weak password')) {
          translatedMessage = 'Mật khẩu quá yếu.';
        }

        Alert.alert('Thông báo', translatedMessage);
      } else if (error.response.status >= 500) {
        console.error('[Server Error] Lỗi nghiêm trọng từ Backend:', error.response.status);
        Alert.alert('Lỗi Server', 'Đã có lỗi nghiêm trọng xảy ra ở máy chủ.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
