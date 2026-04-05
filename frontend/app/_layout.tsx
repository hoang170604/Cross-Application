import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { UserProfileProvider, useUserProfile } from '../context/UserProfileContext';
import { View } from 'react-native';

/**
 * InitialLayout: Component cốt lõi xử lý Logic Hydration và Định tuyến thông minh (Auto-Routing).
 * 
 * Mục đích & Luồng dữ liệu:
 * 1. Chặn Render khuyết: Trả về một màn hình trống (Blank View) để chặn UI cho đến khi 
 *    State được cấp nước (Hydrated) thành công từ AsyncStorage (`isLoaded` === true).
 *    Tính năng này triệt tiêu hoàn toàn lỗi nháy chữ (Flickering) hoặc chớp màn hình.
 * 2. Auto-Routing: Kiểm tra điều kiện hoàn thành Onboarding (Tồn tại tên và Target Calo).
 *    - Nếu thoả mãn -> Trực tiếp ném vào không gian Dashboard (Tab).
 *    - Nếu chưa -> Khóa user ở chuỗi Màn hình đầu vào.
 */
function InitialLayout() {
  const { isLoaded, userProfile } = useUserProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    
    // Khai báo nhóm Màn hình thuộc quyền Onboarding
    const inAuthGroup = !segments[0] || [
      'index', 'PrimaryGoal', 'DietMode', 'BiologicalStats', 'AhaMoment', 'PlanResult', 'Authwall'
    ].includes(segments[0]);
    
    // Đã hoàn thành Onboarding nếu có Tên và Mục tiêu Calo
    const hasFinishedOnboarding = !!userProfile.name && (userProfile.targetCalories || 0) > 0;

    // Sửa lỗi Ghost Redirect: 
    // Chỉ ép chuyển hướng (Redirect) về Dashboard nếu người dùng ĐÃ hoàn thành hồ sơ
    // MÀ lại đang ở một trong các màn hình Onboarding (inAuthGroup).
    // Nếu họ đang ở '/SearchScan' (bên ngoài Tabs nhưng không phải auth), cho phép đi tiếp.
    if (hasFinishedOnboarding && inAuthGroup) {
      router.replace('/(tabs)/diary');
    } else if (!hasFinishedOnboarding && !inAuthGroup) {
      // Ép về Onboarding nếu định vào App nhưng chưa đủ hồ sơ
      router.replace('/');
    }
  }, [isLoaded, userProfile.name, userProfile.targetCalories, segments]);

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
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
