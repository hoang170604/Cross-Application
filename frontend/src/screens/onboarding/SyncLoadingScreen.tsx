import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { syncOnboardingProfile } from '@/src/api/authService';

export default function SyncLoadingScreen() {
  const router = useRouter();
  const { userProfile, userId, setPendingSync, updateUserProfile } = useAppStore();

  useEffect(() => {
    const syncProfile = async () => {
      if (!userId) {
        // Fallback: nếu somehow không có userId, đưa thẳng vào app
        router.replace('/(tabs)/diary');
        return;
      }

      try {

        const payload = {
          name: userProfile.name,
          fastingGoal: userProfile.fastingGoal,
          age: userProfile.age,
          gender: userProfile.gender,
          height: userProfile.height,
          weight: userProfile.weight,
          activityLevel: userProfile.activityLevel,
          goal: userProfile.goal
        };

        const responseData = await syncOnboardingProfile(userId, payload);
        
        // Cập nhật lại state với các chỉ số mục tiêu do BE tính toán
        // Backend trả về ApiResponse<NutritionGoal>, dữ liệu thật nằm trong .data
        if (responseData?.data && responseData.data.targetCalories) {
          updateUserProfile({
            targetCalories: Math.round(responseData.data.targetCalories),
            targetProtein: Math.round(responseData.data.targetProtein || 0),
            targetCarb: Math.round(responseData.data.targetCarb || 0),
            targetFat: Math.round(responseData.data.targetFat || 0)
          });
        } else {
          // Fallback local calculation
          const { recalculateGoals } = useAppStore.getState();
          recalculateGoals();
        }

        // Xóa cờ pending sync
        await setPendingSync(false);

        // Chuyển hướng thành công
        router.replace('/(tabs)/diary');
      } catch (error) {
        console.error("Lỗi khi đồng bộ profile:", error);
        
        // Xóa cờ để không bị lặp lại sync error
        await setPendingSync(false);
        
        Alert.alert(
          'Chưa lưu được lộ trình',
          'Đã xảy ra lỗi khi lưu thông tin cơ thể. Vui lòng thử lại sau trong phần cài đặt.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/diary') }]
        );
      }
    };

    syncProfile();
  }, [userId]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00C48C" />
      <Text style={styles.text}>Đang khởi tạo không gian của bạn...</Text>
      <Text style={styles.subtext}>Vui lòng đợi giây lát</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  }
});

