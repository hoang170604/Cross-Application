import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
      if (serverMessage) {
        Alert.alert('Thông báo từ Server', serverMessage);
      } else if (error.response.status >= 500) {
        console.error('[Server Error] Lỗi nghiêm trọng từ Backend:', error.response.status);
        Alert.alert('Lỗi Server', 'Đã có lỗi nghiêm trọng xảy ra ở máy chủ.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
