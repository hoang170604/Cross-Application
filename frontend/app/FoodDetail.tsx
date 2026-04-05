import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Import Atomic Molecules ──────────────────────────────────────────────────
import { SharedHeader } from '@/src/components/molecules/SharedHeader';

/**
 * Màn hình Chi tiết món ăn (Food Detail).
 * Hiển thị thông tin dinh dưỡng chi tiết và điều chỉnh khẩu phần.
 */
export default function FoodDetailScreen() {
  const router = useRouter();
  const [portion, setPortion] = useState(1);

  const macros = [
    { name: 'Carbs', value: 55 * portion, total: 250, color: '#FFB800', unit: 'g' },
    { name: 'Protein', value: 15 * portion, total: 80, color: '#00C48C', unit: 'g' },
    { name: 'Fat', value: 8 * portion, total: 60, color: '#FF6B6B', unit: 'g' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SharedHeader showBack />

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Biểu tượng & Tên món */}
        <View style={styles.iconContainer}>
          <Text style={styles.foodIcon}>🍲</Text>
          <Text style={styles.foodName}>Phở bò</Text>
          <Text style={styles.foodCalories}>350 kcal</Text>
        </View>

        {/* Điều chỉnh khẩu phần */}
        <View style={styles.portionCard}>
          <Text style={styles.cardInfo}>Khẩu phần</Text>
          <View style={styles.portionControls}>
            <TouchableOpacity
              onPress={() => setPortion(Math.max(1, portion - 1))}
              style={styles.minusButton}
            >
              <Ionicons name="remove" size={20} color="#374151" />
            </TouchableOpacity>
            <View style={styles.portionValueContainer}>
              <Text style={styles.portionValue}>{portion}</Text>
              <Text style={styles.portionUnit}>Bát</Text>
            </View>
            <TouchableOpacity
              onPress={() => setPortion(portion + 1)}
              style={styles.plusButton}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chi tiết dinh dưỡng */}
        {macros.map((macro) => (
          <View key={macro.name} style={styles.macroCard}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroName}>{macro.name}</Text>
              <Text style={styles.macroValue}>{macro.value}{macro.unit}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[
                styles.progressBar, 
                { 
                  backgroundColor: macro.color,
                  width: `${Math.min((macro.value / macro.total) * 100, 100)}%` 
                }
              ]} />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Thêm vào nhật ký</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconContainer: { alignItems: 'center', marginBottom: 32 },
  foodIcon: { fontSize: 80, marginBottom: 16 },
  foodName: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  foodCalories: { fontSize: 20, fontWeight: '500', color: '#6B7280' },
  portionCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardInfo: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 16, textAlign: 'center' },
  portionControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  minusButton: {
    width: 48, height: 48, backgroundColor: '#F3F4F6', borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  portionValueContainer: { alignItems: 'center', minWidth: 80 },
  portionValue: { fontSize: 32, fontWeight: '900' },
  portionUnit: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 4 },
  plusButton: {
    width: 48, height: 48, backgroundColor: '#00C48C', borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#86EFAC', shadowOpacity: 0.3, shadowRadius: 4, elevation: 2,
  },
  macroCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  macroName: { fontWeight: '700' },
  macroValue: { fontWeight: '700' },
  progressTrack: { height: 12, backgroundColor: '#F3F4F6', borderRadius: 999, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 999 },
  footer: { padding: 24 },
  addButton: {
    width: '100%', paddingVertical: 16, backgroundColor: '#000', borderRadius: 999, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
