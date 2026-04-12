import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Lỗi khi lấy token từ AsyncStorage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu rớt mạng hoặc máy chủ không phản hồi
    if (!error.response || error.message === 'Network Error') {
      console.warn('[Network] Máy chủ không thể truy cập, đang chuyển sang Offline Mode.');
    } else if (error.response.status >= 500) {
      console.error('[Server Error] Lỗi nghiêm trọng từ Backend:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
