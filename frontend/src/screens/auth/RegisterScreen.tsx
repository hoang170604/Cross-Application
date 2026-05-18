import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/ui/shared/SharedHeader';
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
    } else if (password.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
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
      const data: any = response.data;
      await login(data.token, data.userId, {
        refreshToken: data.refreshToken ?? null,
        expiresIn: data.expiresIn ?? null,
      });
      const { userProfile, pendingOnboardingSync: currentPendingSync } = useAppStore.getState();
      const isProfileComplete = userProfile && userProfile.height > 0 && userProfile.weight > 0 && userProfile.age > 0;

      if (currentPendingSync) {
        router.replace('/SyncLoadingScreen');
      } else if (!isProfileComplete) {
        if (Platform.OS === 'web') {
          alert('Đăng ký thành công! 🎉\nTài khoản của bạn đã được tạo. Hãy thiết lập hồ sơ để chúng tôi tính toán calo cho bạn nhé.');
          router.replace('/PrimaryGoal');
        } else {
          Alert.alert(
            'Đăng ký thành công! 🎉',
            'Tài khoản của bạn đã được tạo. Hãy thiết lập hồ sơ để chúng tôi tính toán calo cho bạn nhé.',
            [{ text: 'Bắt đầu', onPress: () => router.replace('/PrimaryGoal') }]
          );
        }
      } else {
        router.replace('/(tabs)/diary');
      }
    } catch (error: any) {
      console.log('Register Error Detail:', error.response?.data);
      
      const serverData = error.response?.data;
      const rawError = typeof serverData === 'string' 
        ? serverData 
        : (serverData?.message || serverData?.error || error.message || '');
      
      const msg = String(rawError).toLowerCase();
      let detailedError = 'Lỗi kết nối đến máy chủ. Vui lòng thử lại.';

      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('taken') || msg.includes('400')) {
        detailedError = 'Email này đã được sử dụng bởi tài khoản khác.';
      } else if (msg.includes('weak password')) {
        detailedError = 'Mật khẩu quá yếu (cần tối thiểu 6 ký tự).';
      } else if (msg.includes('credentials') || msg.includes('invalid email') || msg.includes('401')) {
        detailedError = 'Thông tin đăng ký không hợp lệ.';
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
          <Text style={styles.title}>Đăng ký 🚀</Text>
          <Text style={styles.subtitle}>Tạo tài khoản để lưu trữ lộ trình của bạn</Text>

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

          {/* Xác nhận mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={[styles.input, confirmPasswordError ? styles.inputError : null]}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
            />
            {confirmPasswordError ? <Text style={styles.inlineError}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Boxed Error Message for high visibility */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
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
