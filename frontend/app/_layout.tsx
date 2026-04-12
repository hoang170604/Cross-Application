import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { UserProfileProvider, useUserProfile } from '@/src/context/UserProfileContext';
import { View, ActivityIndicator } from 'react-native';

/**
 * Component cốt lõi xử lý quá trình hiển thị ban đầu.
 *
 * Chức năng:
 * - Quản lý việc hiển thị màn hình Loading trong thời gian chờ cấp nước (Hydration) cho State.
 * - Tự động điều hướng người dùng tới Onboarding hoặc Dashboard dựa vào trạng thái thiết lập hồ sơ.
 */
function InitialLayout() {
  const { isLoaded, token, pendingOnboardingSync } = useUserProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    
    // Nhóm màn hình dành cho quy trình Onboarding và Đăng nhập
    const inAuthGroup = !segments[0] || [
      'index', 'PrimaryGoal', 'DietMode', 'BiologicalStats', 'AhaMoment', 'PlanResult', 'WelcomeProfile', 'LoginScreen', 'RegisterScreen'
    ].includes(segments[0]);
    
    // Kiểm tra đã đăng nhập chưa
    const hasFinishedOnboarding = !!token;

    // Xử lý điều kiện điều hướng
    if (hasFinishedOnboarding) {
      if (pendingOnboardingSync) {
        // Đã đăng nhập nhưng chưa đồng bộ Onboarding lên BE
        if (!['SyncLoadingScreen'].includes(segments[0] as string)) {
          router.replace('/SyncLoadingScreen');
        }
      } else if (inAuthGroup || segments[0] === 'SyncLoadingScreen') {
        // Đã đồng bộ xong -> vào Home
        router.replace('/(tabs)/diary');
      }
    } else if (!hasFinishedOnboarding && !inAuthGroup) {
      // Điều hướng về luồng đăng ký/onboarding ban đầu
      router.replace('/');
    }
  }, [isLoaded, token, pendingOnboardingSync, segments]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#00C48C" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="PrimaryGoal" />
      <Stack.Screen name="DietMode" />
      <Stack.Screen name="BiologicalStats" />
      <Stack.Screen name="AhaMoment" />
      <Stack.Screen name="PlanResult" />
      <Stack.Screen name="WelcomeProfile" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="SyncLoadingScreen" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="SearchScan" />
      <Stack.Screen name="FoodDetail" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <UserProfileProvider>
      <InitialLayout />
      <StatusBar style="dark" />
    </UserProfileProvider>
  );
}
