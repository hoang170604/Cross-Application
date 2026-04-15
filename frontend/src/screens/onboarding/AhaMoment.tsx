import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/store/useAppStore';
import { syncOnboardingProfile } from '@/src/api/authService';
import Svg, { Circle } from 'react-native-svg';

export default function AhaMomentScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const { userProfile, userId, updateUserProfile } = useAppStore();

  useEffect(() => {
    let currentProgress = 0;
    let isApiDone = false;

    // Kích hoạt đồng bộ Backend ngay khi vào màn hình
    const triggerSync = async () => {
      try {
        if (userId) {
          const responseData = await syncOnboardingProfile(userId, {
            ...userProfile,
            // Đảm bảo không gửi các field target cũ nếu có
            targetCalories: undefined,
            targetProtein: undefined,
            targetCarb: undefined,
            targetFat: undefined
          });

          if (responseData) {
             updateUserProfile({
                targetCalories: Math.round(responseData.targetCalories || 0),
                targetProtein: Math.round(responseData.targetProtein || 0),
                targetCarb: Math.round(responseData.targetCarb || 0),
                targetFat: Math.round(responseData.targetFat || 0)
             });
          }
        }
      } catch (error) {
        console.error("AhaMoment Sync Error:", error);
      } finally {
        isApiDone = true;
      }
    };

    triggerSync();

    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        // Kiểm tra xem API đã xong chưa mới cho đi tiếp
        const checkDone = setInterval(() => {
          if (isApiDone) {
             clearInterval(checkDone);
             router.replace('/PlanResult');
          }
        }, 100);
      }
    }, 25); // Hơi nhanh hơn một chút để trải nghiệm mượt

    return () => {
       clearInterval(interval);
    };
  }, []);

  const steps = [
    { text: 'Phân tích cơ thể', done: progress >= 25 },
    { text: 'Tính toán Calo', done: progress >= 50 },
    { text: 'Dự báo kết quả', done: progress >= 75 },
    { text: 'Hoàn thiện kế hoạch', done: progress === 100 },
  ];

  const circumference = 2 * Math.PI * 88;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        {/* Vòng tiến trình */}
        <View style={{ width: 192, height: 192, marginBottom: 48, position: 'relative' }}>
          <Svg width={192} height={192} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={96} cy={96} r={88} stroke="#F3F4F6" strokeWidth={16} fill="none" />
            <Circle
              cx={96} cy={96} r={88}
              stroke="#00C48C" strokeWidth={16} fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${circumference * (1 - progress / 100)}`}
              strokeLinecap="round"
            />
          </Svg>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: '700', color: '#00C48C' }}>{progress}%</Text>
          </View>
        </View>

        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 32, textAlign: 'center' }}>
          Đang tạo lộ trình của bạn...
        </Text>

        <View style={{ width: '100%', gap: 20, paddingHorizontal: 16, marginBottom: 48 }}>
          {steps.map((step, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{
                width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                backgroundColor: step.done ? '#00C48C' : '#F3F4F6',
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
              }}>
                {step.done && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={{
                color: step.done ? '#000' : '#9CA3AF',
                fontWeight: step.done ? '600' : '500',
                fontSize: 16,
              }}>
                {step.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

