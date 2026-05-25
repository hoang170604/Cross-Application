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
    /**
     * Hàm khởi chạy ứng dụng (App Initialization).
     * Thực hiện tất cả các tác vụ thiết lập hệ thống ban đầu bao gồm:
     * - Khởi tạo SQLite database (chỉ trên Mobile).
     * - Cấu hình lắng nghe thông báo đẩy (chỉ trên Mobile).
     * - Khôi phục trạng thái đăng nhập (Token bootstrap).
     * - Kiểm tra và reset dữ liệu calo/nước theo ngày mới.
     * - Kích hoạt tiến trình đồng bộ dữ liệu ngoại tuyến còn kẹt.
     */
    const initApp = async () => {
      // 1. Chặn việc chạy trùng lặp do cơ chế Hydration kích hoạt kép
      if (started) return;
      started = true;

      // Các cấu hình native chỉ chạy trên Mobile (Android/iOS), bỏ qua trên Web
      if (Platform.OS !== 'web') {
        try {
          // 2. Mở kết nối và tự động khởi tạo cấu trúc các bảng SQLite (SQLite Schema Setup)
          await initDatabase();
        } catch (err: any) {
          console.warn('[SQLite] Init failed:', err.message);
        }
        // 3. Cấu hình cơ chế xử lý khi có thông báo đẩy (Push Notification Handler)
        setupNotificationHandler();
      }

      try {
        // 4. Khôi phục access token từ SecureStore/Keychain (Auth Bootstrap)
        await useAppStore.getState().bootstrapAuth();
      } catch (err: any) {
        console.warn('[Auth] bootstrapAuth failed:', err.message);
      }

      // 5. Kiểm tra thời gian hiện tại, nếu qua ngày mới thì tự động reset calo, nước uống
      // (Bảo vệ dữ liệu không bị cộng dồn sai lệch giữa các ngày khác nhau)
      useAppStore.getState().checkAndResetForNewDay();

      // 6. Quét hàng đợi SQLite và đẩy các thay đổi chưa đồng bộ lên Backend Server
      // (Khởi chạy đồng bộ ngay lúc mở app để giải phóng hàng đợi ngoại tuyến cũ)
      useAppStore.getState().processSyncQueue();

      // 7. Đánh dấu hoàn tất quá trình load dữ liệu ban đầu để ẩn màn hình Loading
      setIsHydrated(true);
    };

    // ======================================================================
    // CƠ CHẾ HYDRATION (KHÔI PHỤC DỮ LIỆU TỪ BỘ NHỚ LÊN STATE STORE)
    // ======================================================================
    // - Zustand persist lưu cache dữ liệu xuống AsyncStorage (hoặc LocalStorage).
    // - Khi app vừa mở lên, dữ liệu trong store trống trơn. Hydration là quá trình đọc 
    //   từ ổ cứng thiết bị, giải mã JSON và nạp vào RAM cho Zustand sử dụng.
    // - Hàm onFinishHydration lắng nghe khi quá trình nạp dữ liệu từ ổ cứng thiết bị 
    //   vào store Zustand hoàn tất 100%. Sau khi xong mới chạy initApp() để tránh tình trạng 
    //   mất dữ liệu hoặc ghi đè dữ liệu rỗng.
    const unsub = useAppStore.persist.onFinishHydration(() => {
      initApp();
    });
    
    // Nếu ứng dụng đã được nạp dữ liệu xong từ trước (hasHydrated), chạy trực tiếp initApp()
    if (useAppStore.persist.hasHydrated()) {
      initApp();
    }
    return unsub;
  }, []);

  // ======================================================================
  // BỘ HẸN GIỜ ĐỒNG BỘ NỀN ĐỊNH KỲ 30 GIÂY (Periodic Background Timer)
  // ======================================================================
  // - Khi ứng dụng đã được khởi tạo thành công (isHydrated = true) và người dùng 
  //   đã đăng nhập (có token hợp lệ), ta thiết lập bộ đếm thời gian (setInterval).
  // - Cứ sau mỗi 30000ms (30 giây), app tự động gọi processSyncQueue() chạy ngầm.
  // - Nếu có dữ liệu kẹt trong hàng đợi SQLite, nó sẽ được đẩy dần lên Backend.
  // - Khi component unmount, ta dọn dẹp bộ đếm thời gian (clearInterval) để tránh rò rỉ bộ nhớ (memory leak).
  useEffect(() => {
    if (!isHydrated || !token) return;

    const syncInterval = setInterval(() => {
      console.log('[Sync] Định kỳ 30 giây: Kiểm tra và đồng bộ dữ liệu nền...');
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
