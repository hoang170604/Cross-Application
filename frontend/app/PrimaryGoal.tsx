import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/components/molecules/SharedHeader';

// ─── Import Atomic Hooks ─────────────────────────────────────────────────────
import { useUserProfile } from '@/src/context/UserProfileContext';

const goals = [
  { id: 'lose_weight', icon: '🔥', title: 'Giảm cân', desc: 'Đốt cháy mỡ thừa hiệu quả' },
  { id: 'maintain', icon: '⚖️', title: 'Giữ dáng', desc: 'Duy trì cân nặng hiện tại' },
  { id: 'gain_muscle', icon: '💪', title: 'Tăng cơ', desc: 'Xây dựng khối cơ bắp' },
];

/**
 * Màn hình Chọn mục tiêu chính (Primary Goal).
 */
export default function PrimaryGoalScreen() {
  const router = useRouter();
  const { userProfile, setUserProfile } = useUserProfile();
  const [selectedGoal, setSelectedGoal] = useState(userProfile.goal || 'lose_weight');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SharedHeader showProgress progress={33} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 32 }}>Mục tiêu chính của bạn là gì?</Text>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            onPress={() => setSelectedGoal(goal.id)}
            style={{
              width: '100%', padding: 24,
              backgroundColor: '#fff', borderRadius: 24,
              flexDirection: 'row', alignItems: 'center', gap: 16,
              marginBottom: 16,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
              borderWidth: selectedGoal === goal.id ? 2 : 0,
              borderColor: '#00C48C',
            }}
          >
            <Text style={{ fontSize: 32 }}>{goal.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>{goal.title}</Text>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>{goal.desc}</Text>
            </View>
            {selectedGoal === goal.id && (
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00C48C', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={() => {
            setUserProfile({ ...userProfile, goal: selectedGoal });
            router.push('/DietMode');
          }}
          style={{ width: '100%', paddingVertical: 16, backgroundColor: '#000', borderRadius: 999, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
