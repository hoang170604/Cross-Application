import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/ui/SharedHeader';
import { useAppStore } from '@/src/store/useAppStore';
import { loginUser } from '@/src/api/authService';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { login, pendingOnboardingSync } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Inline validation errors (real-time)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // --- Real-time handlers ---
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errorMessage) setErrorMessage('');
    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError('Email không đúng định dạng (VD: example@gmail.com)');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errorMessage) setErrorMessage('');
    if (passwordError && text.length > 0) setPasswordError('');
  };

  // --- Submit ---
  const handleLogin = async () => {
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      hasError = true;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Email không đúng định dạng (VD: example@gmail.com)');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Vui lòng nhập mật khẩu');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await loginUser(email.trim(), password);
      const data: any = response.data;
      await login(data.token, data.userId, {
        refreshToken: data.refreshToken ?? null,
        expiresIn: data.expiresIn ?? null,
      });
      const { userProfile, pendingOnboardingSync } = useAppStore.getState();
      const isProfileComplete = userProfile && userProfile.height > 0 && userProfile.weight > 0 && userProfile.age > 0;

      if (pendingOnboardingSync) {
        router.replace('/SyncLoadingScreen');
      } else if (!isProfileComplete) {
        if (Platform.OS === 'web') {
          alert('Chưa hoàn tất hồ sơ: Tài khoản của bạn chưa hoàn tất thiết lập. Vui lòng cập nhật thông tin cá nhân để tiếp tục.');
          router.replace('/PrimaryGoal');
        } else {
          Alert.alert(
            'Chưa hoàn tất hồ sơ',
            'Tài khoản của bạn chưa hoàn tất thiết lập. Vui lòng cập nhật thông tin cá nhân để tiếp tục.',
            [
              {
                text: 'Bắt đầu',
                onPress: () => router.replace('/PrimaryGoal')
              }
            ]
          );
        }
      } else {
        router.replace('/(tabs)/diary');
      }

    } catch (error: any) {
      console.log('Login Error Detail:', error.response?.data);

      const serverData = error.response?.data;
      const rawError = typeof serverData === 'string' 
        ? serverData 
        : (serverData?.message || serverData?.error || error.message || '');
      
      const msg = String(rawError).toLowerCase();
      let detailedError = 'Lỗi kết nối đến máy chủ. Vui lòng thử lại.';
      
      if (msg.includes('credentials') || msg.includes('invalid email') || msg.includes('401')) {
        detailedError = 'Email hoặc mật khẩu không chính xác.';
      } else if (msg.includes('not found') || msg.includes('404')) {
        detailedError = 'Không tìm thấy tài khoản này trên hệ thống.';
      } else if (msg.includes('required') || msg.includes('400')) {
        detailedError = 'Vui lòng nhập đầy đủ thông tin đăng nhập.';
      } else if (rawError && typeof rawError === 'string') {
        detailedError = rawError;
      }

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

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Nhập email của bạn"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? <Text style={styles.inlineError}>{emailError}</Text> : null}
          </View>

          {/* Mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Ít nhất 8 ký tự"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            {passwordError ? <Text style={styles.inlineError}>{passwordError}</Text> : null}
          </View>
 
          {/* Boxed Error Message for high visibility */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
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
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#374151', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inlineError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
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
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBannerText: {
    color: '#B91C1C',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
});
