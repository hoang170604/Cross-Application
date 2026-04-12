import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SharedHeader } from '@/src/components/molecules/SharedHeader';
import { useUserProfile } from '@/src/context/UserProfileContext';
import { calculateBMI } from '@/src/utils/calculateNutrition';

export default function PlanResultScreen() {
  const router = useRouter();
  const { userProfile, token, setPendingSync } = useUserProfile();
  
  const weight = userProfile.weight || 70;
  const height = userProfile.height || 170;
  const age = userProfile.age || 25;
  const gender = userProfile.gender || 'male';
  const activityLevel = userProfile.activityLevel || 1.2;
  const goal = userProfile.goal || 'maintain';
  
  const bmi = calculateBMI(weight, height);

  // Tính TDEE cục bộ tạm thời (BE sẽ tính lại chuẩn xác hơn sau khi Sync)
  const targetCals = useMemo(() => {
    let bmr = 0;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    let tdee = bmr * activityLevel;
    if (goal === 'lose_weight') tdee -= 500;
    if (goal === 'build_muscle') tdee += 500;
    return Math.round(tdee);
  }, [weight, height, age, gender, activityLevel, goal]);

  const weeks = 12;
  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + weeks * 7);
  const month = projectedDate.getMonth() + 1;
  const year = projectedDate.getFullYear();

  let proteinPercent = '30%';
  let carbPercent = '40%';
  let fatPercent = '30%';
  
  if (goal === 'lose_weight') {
    proteinPercent = '40%';
    carbPercent = '30%';
    fatPercent = '30%';
  } else if (goal === 'build_muscle') {
    proteinPercent = '30%';
    carbPercent = '50%';
    fatPercent = '20%';
  }

  const macros = [
    { label: 'Carbs', percent: carbPercent, color: '#FFB800', grams: `${Math.round(targetCals * parseInt(carbPercent)/100 / 4)}g` },
    { label: 'Protein', percent: proteinPercent, color: '#00C48C', grams: `${Math.round(targetCals * parseInt(proteinPercent)/100 / 4)}g` },
    { label: 'Fat', percent: fatPercent, color: '#FF6B6B', grams: `${Math.round(targetCals * parseInt(fatPercent)/100 / 9)}g` },
  ];

  const handleSave = () => {
    router.push('/WelcomeProfile');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SharedHeader showBack />
      
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>
            Lộ trình của bạn đã sẵn sàng! 🎯
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 14 }}>
            Chúng tôi đã thiết kế một kế hoạch dành riêng cho bạn.
          </Text>
        </View>

        <View style={styles.bmiCard}>
          <Text style={styles.cardLabel}>Chỉ số BMI</Text>
          <Text style={styles.bmiValue}>{bmi}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bình thường</Text>
          </View>
        </View>

        <View style={styles.caloriesCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mục tiêu calo / ngày</Text>
            <Ionicons name="flame" size={20} color="#FF8C00" />
          </View>
          <View style={styles.caloriesValueRow}>
            <Text style={styles.caloriesValue}>{targetCals}</Text>
            <Text style={styles.caloriesUnit}>kcal</Text>
          </View>

          {macros.map((macro) => (
            <View key={macro.label} style={styles.macroRow}>
              <View style={[styles.macroDot, { backgroundColor: macro.color }]} />
              <Text style={styles.macroLabel}>{macro.label}</Text>
              <Text style={styles.macroGrams}>{macro.grams}</Text>
              <Text style={styles.macroPercent}>{macro.percent}</Text>
            </View>
          ))}
        </View>

        <View style={styles.durationCard}>
          <View style={styles.durationHeader}>
            <Ionicons name="time-outline" size={20} color="#9CA3AF" />
            <Text style={styles.durationTitle}>Lộ trình {weeks} tuần</Text>
          </View>
          <Text style={styles.durationText}>
            Dự kiến bạn sẽ đạt mục tiêu vào Tháng {month}/{year}. Với kế hoạch này, bạn có thể đạt được kết quả cá nhân hóa một cách an toàn và bền vững.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>Lưu lại lộ trình</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bmiCard: {
    backgroundColor: '#F9FAFB', borderRadius: 24, padding: 24, marginBottom: 24,
    alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6',
  },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  bmiValue: { fontSize: 48, fontWeight: '900', color: '#00C48C', marginBottom: 12 },
  badge: { backgroundColor: '#ECFDF5', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: '#00C48C', fontSize: 14, fontWeight: '700' },
  caloriesCard: { backgroundColor: '#F9FAFB', borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle: { fontWeight: '700' },
  caloriesValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 24 },
  caloriesValue: { fontSize: 32, fontWeight: '900', color: '#FF8C00' },
  caloriesUnit: { color: '#6B7280', fontWeight: '500', paddingBottom: 4 },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  macroDot: { width: 12, height: 12, borderRadius: 6 },
  macroLabel: { flex: 1, fontWeight: '600', color: '#374151' },
  macroGrams: { fontSize: 14, color: '#9CA3AF' },
  macroPercent: { fontWeight: '700', width: 48, textAlign: 'right' },
  durationCard: { backgroundColor: '#F9FAFB', borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  durationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  durationTitle: { fontWeight: '700' },
  durationText: { color: '#6B7280', fontSize: 14, lineHeight: 22 },
  footer: { padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  confirmButton: {
    width: '100%', paddingVertical: 16, backgroundColor: '#00C48C', borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#86EFAC', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  confirmButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
