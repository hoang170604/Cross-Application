import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/ui/SharedHeader';
import { useAppStore } from '@/src/store/useAppStore';
import { loginUser } from '@/src/api/authService';

export default function LoginScreen() {
  const router = useRouter();
  const { login, pendingOnboardingSync } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(''); // Xóa lỗi cũ khi bắt đầu đăng nhập

    try {
      const response = await loginUser(email.trim(), password);
      await login(response.token, response.userId);
      
      if (pendingOnboardingSync) {
        router.replace('/SyncLoadingScreen');
      } else {
        router.replace('/(tabs)/diary');
      }
    } catch (error: any) {
      console.log('Backend Error Response:', error.response?.data);
      
      const data = error.response?.data;
      const rawError = (typeof data === 'string' ? data : (data?.message || data?.error)) || '';
      
      // Map dịch lỗi sang tiếng Việt
      const errorMap: { [key: string]: string } = {
        'Invalid credentials': 'Email hoặc mật khẩu không chính xác.',
        'User not found': 'Không tìm thấy tài khoản này.',
        'Missing required fields': 'Vui lòng nhập đầy đủ thông tin.',
      };

      const detailedError = errorMap[rawError] || rawError || 'Lỗi kết nối đến máy chủ. Vui lòng thử lại.';
        
      setErrorMessage(detailedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container}>
        <SharedHeader showBack />
        <View style={styles.content}>
          <Text style={styles.title}>Đăng nhập 👋</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay lại với NutriTrack</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              secureTextEntry
            />
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/RegisterScreen')}>
            <Text style={styles.linkText}>
              Chưa có tài khoản? <Text style={styles.linkTextBold}>Đăng ký ngay</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#374151', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00C48C',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#6B7280', fontSize: 14 },
  linkTextBold: { color: '#00C48C', fontWeight: '700' },
  errorText: { 
    color: '#EF4444', 
    fontSize: 14, 
    marginBottom: 12, 
    textAlign: 'center',
    fontWeight: '500'
  },
});



