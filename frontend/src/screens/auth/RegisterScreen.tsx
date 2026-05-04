import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/ui/SharedHeader';
import { useAppStore } from '@/src/store/useAppStore';
import { registerUser } from '@/src/api/authService';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const { login, pendingOnboardingSync } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Inline validation errors (real-time)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
    if (text.length > 0 && text.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
    } else {
      setPasswordError('');
    }
    // Re-check confirm password if already typed
    if (confirmPassword.length > 0 && text !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (errorMessage) setErrorMessage('');
    if (text.length > 0 && text !== password) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  // --- Submit ---
  const handleRegister = async () => {
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
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await registerUser(email.trim(), password);
      await login(response.data.token, response.data.userId);
      const { userProfile } = useAppStore.getState();
      const isProfileComplete = userProfile && userProfile.height > 0 && userProfile.weight > 0 && userProfile.age > 0;

      if (pendingOnboardingSync) {
        router.replace('/SyncLoadingScreen');
      } else if (!isProfileComplete) {
        router.replace('/PrimaryGoal');
      } else {
        router.replace('/(tabs)/diary');
      }
    } catch (error: any) {
      console.log('Backend Error Response:', error.response?.data);
      const data = error.response?.data;
      const rawError = (typeof data === 'string' ? data : (data?.message || data?.error)) || '';

      const errorMap: { [key: string]: string } = {
        'Invalid credentials': 'Thông tin không hợp lệ.',
        'User already exists': 'Email này đã được sử dụng bởi tài khoản khác.',
        'Email already taken': 'Email này đã được sử dụng bởi tài khoản khác.',
        'Email already registered': 'Email này đã được đăng ký bởi người khác.',
        'Weak password': 'Mật khẩu quá yếu.',
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
          <Text style={styles.title}>Đăng ký 🚀</Text>
          <Text style={styles.subtitle}>Tạo tài khoản để lưu trữ lộ trình của bạn</Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Nhập email của bạn"
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
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            {passwordError ? <Text style={styles.inlineError}>{passwordError}</Text> : null}
          </View>

          {/* Xác nhận mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={[styles.input, confirmPasswordError ? styles.inputError : null]}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
            />
            {confirmPasswordError ? <Text style={styles.inlineError}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Lỗi từ Server */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/LoginScreen')}>
            <Text style={styles.linkText}>
              Đã có tài khoản? <Text style={styles.linkTextBold}>Đăng nhập</Text>
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
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500'
  },
});
