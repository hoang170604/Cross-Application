import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAppStore } from '@/src/store/useAppStore';
import { View, ActivityIndicator, Platform } from 'react-native';
import { initDatabase } from '@/src/db/database';
import { setupNotificationHandler } from '@/src/utils/notifications';
import { LogBox } from 'react-native';

// Bỏ qua cảnh báo Push Notification của Expo Go trên Android (SDK 53)
LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

// Đảm bảo Platform luôn sẵn sàng
if (typeof Platform === 'undefined') {
  console.warn('Platform is not defined in the global scope, using fallback');
}

/**
 * Component cốt lõi xử lý quá trình hiển thị ban đầu.
 *
 * Chức năng:
 * - Quản lý việc hiển thị màn hình Loading trong thời gian chờ Hydration cho Zustand Store.
 * - Tự động điều hướng người dùng tới Onboarding hoặc Dashboard dựa vào trạng thái thiết lập hồ sơ.
 */
function InitialLayout() {
  const { token, pendingOnboardingSync, userProfile } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  // Zustand persist rehydration check
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    // Hydration check

    let started = false;
    const initApp = async () => {
      if (started) return; // Tránh chạy 2 lần khi vừa hydrate vừa hasHydrated
      started = true;
      if (Platform.OS !== 'web') {
        try {
          await initDatabase();
        } catch (err: any) {
          console.warn('[SQLite] Init failed:', err.message);
        }
        // Cấu hình notification handler 1 lần khi khởi động (idempotent).
        setupNotificationHandler();
      }
      // Khôi phục access token từ SecureStore (tách rời Zustand persist).
      try {
        await useAppStore.getState().bootstrapAuth();
      } catch (err: any) {
        console.warn('[Auth] bootstrapAuth failed:', err.message);
      }
      useAppStore.getState().checkAndResetForNewDay();
      useAppStore.getState().processSyncQueue();
      setIsHydrated(true);
    };

    const unsub = useAppStore.persist.onFinishHydration(() => {
      initApp();
    });
    if (useAppStore.persist.hasHydrated()) {
      initApp();
    }
    return unsub;
  }, []);

  // Tự động đồng bộ lại sau mỗi 30 giây nếu có dữ liệu đang chờ (Background Sync)
  useEffect(() => {
    if (!isHydrated || !token) return;

    const syncInterval = setInterval(() => {
      console.log('[Sync] Periodic background sync check...');
      useAppStore.getState().processSyncQueue();
    }, 30000); // 30 giây một lần

    return () => clearInterval(syncInterval);
  }, [isHydrated, token]);

  useEffect(() => {
    if (!isHydrated) return;
    
    // Nhóm màn hình dành cho quy trình Onboarding và Đăng nhập
    const inAuthGroup = !segments[0] || [
      'index', 'PrimaryGoal', 'DietMode', 'BiologicalStats', 'AhaMoment', 'PlanResult', 'WelcomeProfile', 'LoginScreen', 'RegisterScreen', 'SyncLoadingScreen'
    ].includes(segments[0]);
    
    // Kiểm tra đã đăng nhập chưa
    const hasFinishedOnboarding = !!token;

    // Kiểm tra profile đã hoàn thành chưa (Route Guard)
    const isProfileComplete = 
      userProfile && 
      userProfile.height > 0 && 
      userProfile.weight > 0 && 
      userProfile.age > 0;

    // Xử lý điều kiện điều hướng
    if (hasFinishedOnboarding) {
      if (pendingOnboardingSync) {
        // Đã đăng nhập nhưng chưa đồng bộ Onboarding lên BE
        if (!['SyncLoadingScreen'].includes(segments[0] as string)) {
          router.replace('/SyncLoadingScreen');
        }
      } else if (!isProfileComplete) {
        // Tài khoản mới chưa có thông tin profile -> ép hoàn thành Onboarding
        if (!inAuthGroup) {
          router.replace('/PrimaryGoal');
        }
      } else if (inAuthGroup || segments[0] === 'SyncLoadingScreen') {
        // Đã đăng nhập, profile đầy đủ -> vào Home
        router.replace('/(tabs)/diary');
      }
    } else if (!hasFinishedOnboarding && !inAuthGroup) {
      // Điều hướng về luồng đăng ký/onboarding ban đầu
      router.replace('/');
    }
  }, [isHydrated, token, pendingOnboardingSync, userProfile, segments]);

  if (!isHydrated) {
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
      <Stack.Screen name="AddActivity" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <>
      <InitialLayout />
      <StatusBar style="dark" />
    </>
  );
}
