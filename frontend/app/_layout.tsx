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
  const { isLoaded, userProfile } = useUserProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    
    // Nhóm màn hình dành cho quy trình Onboarding
    const inAuthGroup = !segments[0] || [
      'index', 'PrimaryGoal', 'DietMode', 'BiologicalStats', 'AhaMoment', 'PlanResult', 'Authwall'
    ].includes(segments[0]);
    
    // Kiểm tra định danh để xác nhận hoàn tất hồ sơ người dùng
    const hasFinishedOnboarding = !!userProfile.name;

    // Xử lý điều kiện điều hướng về Dashboard hoặc Onboarding
    if (hasFinishedOnboarding && inAuthGroup) {
      router.replace('/(tabs)/diary');
    } else if (!hasFinishedOnboarding && !inAuthGroup) {
      // Điều hướng về luồng đăng ký người dùng màn Onboarding
      router.replace('/');
    }
  }, [isLoaded, userProfile.name, segments]);

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
      <Stack.Screen name="Authwall" />
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
