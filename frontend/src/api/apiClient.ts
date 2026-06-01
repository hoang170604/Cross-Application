import axios from 'axios';
import { Alert } from 'react-native';
import { getToken } from '../utils/tokenStorage';

const apiClient = axios.create({
  baseURL: 'http://192.168.1.51:8080',
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
    return response;
  },
  (error) => {
    if (!error.response || error.message === 'Network Error') {
      console.warn('[Network] Máy chủ không thể truy cập.');
      // Tránh hiện Alert quá nhiều lần khi mất mạng
      return Promise.reject(error);
    } else {
      const serverMessage = error.response.data?.message;
      const status = error.response.status;
      const url = error.config?.url || '';

      // DANH SÁCH LOẠI TRỪ: Không hiện Alert global cho các trường hợp này
      // 1. Luồng Auth (Login/Register) tự xử lý lỗi bằng text trên màn hình
      const isAuthRequest = url.includes('/api/users/login') || url.includes('/api/users/register');
      // 2. Kiểm tra Profile/Goal (thường trả về 404 cho user mới, là bình thường)
      const isProfileCheck = url.includes('/profile') || url.includes('/goal');
      const is404 = status === 404;

      if (status === 401 && !isAuthRequest) {
        console.warn('[Auth] Phiên đăng nhập hết hạn (401)');
        // Dynamically import store to avoid circular dependency
        const { useAppStore } = require('../store/useAppStore');
        useAppStore.getState().logout();
        Alert.alert('Phiên hết hạn', 'Vui lòng đăng nhập lại để tiếp tục.');
      }
      else if (serverMessage && !isAuthRequest && !(isProfileCheck && is404)) {
        let translatedMessage = String(serverMessage);
        const msg = translatedMessage.toLowerCase().trim();

        if (msg.includes('invalid credentials')) {
          translatedMessage = 'Email hoặc mật khẩu không chính xác.';
        } else if (msg.includes('not found')) {
          translatedMessage = 'Dữ liệu không tồn tại trên hệ thống.';
        } else if (msg.includes('already exists') || msg.includes('taken')) {
          translatedMessage = 'Thông tin này đã được sử dụng bởi tài khoản khác.';
        }

        Alert.alert('Thông báo', translatedMessage);
      } else if (status >= 500) {
        console.error('[Server Error] Lỗi hệ thống:', status);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
