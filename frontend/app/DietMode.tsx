import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/components/molecules/SharedHeader';

// ─── Import Atomic Hooks ─────────────────────────────────────────────────────
import { useUserProfile } from '@/src/context/UserProfileContext';

const activities = [
  { id: 1.2, title: 'Ngồi nhiều', icon: '💻', desc: 'Văn phòng, ít vận động' },
  { id: 1.375, title: 'Vận động nhẹ', icon: '🚶', desc: 'Đi bộ, làm việc nhà' },
  { id: 1.55, title: 'Trung bình', icon: '🏃', desc: 'Tập luyện 3-5 buổi/tuần' },
  { id: 1.725, title: 'Năng động', icon: '🔥', desc: 'Tập luyện 6-7 buổi/tuần' },
  { id: 1.9, title: 'Cường độ cao', icon: '🏋️', desc: 'VĐV, lao động nặng' },
];

/**
 * Màn hình Chọn mức độ vận động (Diet Mode/Activity Level).
 */
export default function DietModeScreen() {
  const router = useRouter();
  const { userProfile, setUserProfile } = useUserProfile();
  
  const [selectedActivity, setSelectedActivity] = useState<number>(userProfile.activityLevel || 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SharedHeader showProgress progress={66} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 32 }}>Mức độ vận động của bạn?</Text>
        <View style={{ flexDirection: 'column', gap: 16, paddingBottom: 24 }}>
          {activities.map((act) => (
            <TouchableOpacity
              key={act.id}
              onPress={() => setSelectedActivity(act.id)}
              style={{
                width: '100%', padding: 20,
                backgroundColor: selectedActivity === act.id ? '#ECFDF5' : '#fff',
                borderRadius: 24, 
                flexDirection: 'row', alignItems: 'center', gap: 16,
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
                borderWidth: selectedActivity === act.id ? 2 : 0,
                borderColor: '#00C48C',
              }}
            >
              <Text style={{ fontSize: 32 }}>{act.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 18, color: '#374151', marginBottom: 2 }}>{act.title}</Text>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>{act.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={() => {
            if (selectedActivity) {
              setUserProfile({ ...userProfile, activityLevel: selectedActivity });
              router.push('/BiologicalStats');
            }
          }}
          disabled={!selectedActivity}
          style={{
            width: '100%', paddingVertical: 16, borderRadius: 999, alignItems: 'center',
            backgroundColor: selectedActivity ? '#000' : '#E5E7EB',
          }}
        >
          <Text style={{ color: selectedActivity ? '#fff' : '#6B7280', fontWeight: '600', fontSize: 16 }}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
