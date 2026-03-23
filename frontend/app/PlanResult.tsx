import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SharedHeader from '@/components/SharedHeader';
import { useUserProfile } from '@/context/UserProfileContext';

export default function PlanResultScreen() {
  const router = useRouter();
  const { userProfile, calculateDuration } = useUserProfile();
  
  const weight = userProfile.weight || 70;
  const height = userProfile.height || 170;
  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  const targetCals = userProfile.targetCalories || 1500;

  const weeks = calculateDuration(userProfile);
  
  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + weeks * 7);
  const month = projectedDate.getMonth() + 1;
  const year = projectedDate.getFullYear();

  const macros = [
    { label: 'Carbs', percent: '50%', color: '#FFB800', grams: '180g' },
    { label: 'Protein', percent: '30%', color: '#00C48C', grams: '110g' },
    { label: 'Fat', percent: '20%', color: '#FF6B6B', grams: '33g' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SharedHeader showBack />
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
        {/* Title */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>
            Lộ trình của bạn đã sẵn sàng! 🎯
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 14 }}>
            Chúng tôi đã thiết kế một kế hoạch dành riêng cho bạn.
          </Text>
        </View>

        {/* BMI Card */}
        <View style={{
          backgroundColor: '#F9FAFB', borderRadius: 24, padding: 24, marginBottom: 24,
          alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6',
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
            Chỉ số BMI
          </Text>
          <Text style={{ fontSize: 48, fontWeight: '900', color: '#00C48C', marginBottom: 12 }}>{bmi}</Text>
          <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 }}>
            <Text style={{ color: '#00C48C', fontSize: 14, fontWeight: '700' }}>Bình thường</Text>
          </View>
        </View>

        {/* Calorie Target Card */}
        <View style={{
          backgroundColor: '#F9FAFB', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontWeight: '700' }}>Mục tiêu calo / ngày</Text>
            <Ionicons name="flame" size={20} color="#FF8C00" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 24 }}>
            <Text style={{ fontSize: 32, fontWeight: '900', color: '#FF8C00' }}>{targetCals}</Text>
            <Text style={{ color: '#6B7280', fontWeight: '500', paddingBottom: 4 }}>kcal</Text>
          </View>

          {macros.map((macro) => (
            <View key={macro.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: macro.color }} />
              <Text style={{ flex: 1, fontWeight: '600', color: '#374151' }}>{macro.label}</Text>
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>{macro.grams}</Text>
              <Text style={{ fontWeight: '700', width: 48, textAlign: 'right' }}>{macro.percent}</Text>
            </View>
          ))}
        </View>

        {/* Dynamic Plan Card */}
        <View style={{
          backgroundColor: '#F9FAFB', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Ionicons name="time-outline" size={20} color="#9CA3AF" />
            <Text style={{ fontWeight: '700' }}>Lộ trình {weeks} tuần</Text>
          </View>
          <Text style={{ color: '#6B7280', fontSize: 14, lineHeight: 22 }}>
            Dự kiến bạn sẽ đạt mục tiêu vào Tháng {month}/{year}. Với kế hoạch này, bạn có thể đạt được kết quả cá nhân hóa một cách an toàn và bền vững.
          </Text>
        </View>
      </ScrollView>

      <View style={{ padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F9FAFB' }}>
        <TouchableOpacity
          onPress={() => router.push('/Authwall')}
          style={{
            width: '100%', paddingVertical: 16, backgroundColor: '#00C48C', borderRadius: 999,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            shadowColor: '#86EFAC', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Lưu lại lộ trình</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
