import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/ui/SharedHeader';

// ─── Import Atomic Hooks ─────────────────────────────────────────────────────
import { useAppStore } from '@/src/store/useAppStore';

/**
 * Màn hình Nhập chỉ số cơ thể (Biological Stats).
 * Thu thập giới tính, tuổi, chiều cao, cân nặng để tính toán TDEE/BMR.
 */
export default function BiologicalStatsScreen() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = useAppStore();
  
  const [gender, setGender] = useState(userProfile.gender || 'male');
  const [age, setAge] = useState(userProfile.age || 25);
  const [height, setHeight] = useState(userProfile.height || 170);
  const [weight, setWeight] = useState(userProfile.weight || 70);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SharedHeader showProgress progress={100} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 32 }}>Nhập chỉ số của bạn</Text>

        {/* Chọn giới tính */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Giới tính</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {([{ label: 'Nam', value: 'male' }, { label: 'Nữ', value: 'female' }] as const).map((g) => (
              <TouchableOpacity
                key={g.value}
                onPress={() => setGender(g.value)}
                style={{
                  flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center',
                  backgroundColor: gender === g.value ? '#00C48C' : '#fff',
                  shadowColor: gender === g.value ? '#86EFAC' : '#000',
                  shadowOpacity: gender === g.value ? 0.3 : 0.04,
                  shadowRadius: 4, elevation: gender === g.value ? 3 : 1,
                  borderWidth: gender === g.value ? 0 : 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <Text style={{ fontWeight: '600', color: gender === g.value ? '#fff' : '#4B5563' }}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tuổi */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Tuổi</Text>
          <View style={{
            backgroundColor: '#fff', borderRadius: 24, padding: 24,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}>
            <TouchableOpacity
              onPress={() => setAge(Math.max(10, age - 1))}
              style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="remove" size={20} color="#4B5563" />
            </TouchableOpacity>
            <Text style={{ fontSize: 28, fontWeight: '700' }}>{age}</Text>
            <TouchableOpacity
              onPress={() => setAge(Math.min(100, age + 1))}
              style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="add" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chiều cao & Cân nặng */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Chiều cao (cm)</Text>
            <View style={{
              backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', gap: 16,
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <TouchableOpacity
                onPress={() => setHeight(Math.min(250, height + 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="add" size={16} color="#4B5563" />
              </TouchableOpacity>
              <Text style={{ fontSize: 24, fontWeight: '700' }}>{height}</Text>
              <TouchableOpacity
                onPress={() => setHeight(Math.max(100, height - 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="remove" size={16} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Cân nặng (kg)</Text>
            <View style={{
              backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', gap: 16,
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <TouchableOpacity
                onPress={() => setWeight(Math.min(200, weight + 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="add" size={16} color="#4B5563" />
              </TouchableOpacity>
              <Text style={{ fontSize: 24, fontWeight: '700' }}>{weight}</Text>
              <TouchableOpacity
                onPress={() => setWeight(Math.max(30, weight - 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="remove" size={16} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={() => {
            const currentWeightValue = Number(weight);
            const currentHeightValue = Number(height);
            const currentAgeValue = Number(age);

            // Bắt lỗi an toàn (Validation Guard) chống lại các số liệu âm hoặc bằng 0
            if (currentAgeValue <= 0 || currentHeightValue <= 0 || currentWeightValue <= 0) {
              Alert.alert('Lỗi thông tin', 'Vui lòng đảm bảo các chỉ số sinh học của bạn phải lớn hơn 0 để hệ thống có thể tính toán chính xác!');
              return;
            }

            updateUserProfile({
              gender, 
              age: currentAgeValue, 
              height: currentHeightValue, 
              weight: currentWeightValue,
              targetCalories: 0
            });
            router.push('/AhaMoment');
          }}
          style={{ width: '100%', paddingVertical: 16, backgroundColor: '#000', borderRadius: 999, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Tạo Kế Hoạch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}



