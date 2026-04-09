import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/src/api/apiClient';

// ─── Import Atomic Molecules & Hooks ──────────────────────────────────────────
import { SharedHeader } from '@/src/components/molecules/SharedHeader';
import { useUserProfile } from '@/src/context/UserProfileContext';
import { VIETNAMESE_FOOD_DB } from '@/constants/foodDatabase';

/**
 * Màn hình Chi tiết món ăn (Food Detail).
 * Cập nhật cấu trúc: 100g của Backend, TextInput nhập quantity.
 */
export default function FoodDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId } = useUserProfile();
  
  const mealType = params?.mealType || 'breakfast';
  const foodIdNum = Number(params?.id) || 1; 

  const food = VIETNAMESE_FOOD_DB.find(f => f.id === foodIdNum) || VIETNAMESE_FOOD_DB[0];

  const [quantityStr, setQuantityStr] = useState('100');
  
  // Calculate macros per 100g proportion
  const quantity = Number(quantityStr) || 0;
  
  const caloriesPer100g = food.calories; 
  const proteinPer100g = food.protein;
  const carbPer100g = food.carb;
  const fatPer100g = food.fat;

  const realCalories = Math.round((caloriesPer100g * quantity) / 100);
  const realProtein = Math.round((proteinPer100g * quantity) / 100);
  const realCarb = Math.round((carbPer100g * quantity) / 100);
  const realFat = Math.round((fatPer100g * quantity) / 100);

  const macros = [
    { name: 'Carb', value: realCarb, total: 300, color: '#FFB800', unit: 'g' },
    { name: 'Protein', value: realProtein, total: 100, color: '#00C48C', unit: 'g' },
    { name: 'Fat', value: realFat, total: 80, color: '#FF6B6B', unit: 'g' },
  ];

  const handleAddFood = async () => {
    if (quantity <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số gram hợp lệ.');
      return;
    }
    try {
      // POST API according to User Requirements
      await apiClient.post(`/diary/users/${userId}/meals/${mealType}`, {
        foodId: food.id,
        quantity: quantity
      });
      
      Alert.alert('Thành công', 'Đã thêm món ăn vào nhật ký!');
      router.back();
    } catch (error) {
      console.error('Lỗi khi thêm món ăn:', error);
      Alert.alert('Lỗi', 'Không thể thêm món ăn, vui lòng thử lại sau.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SharedHeader showBack />

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        {/* Biểu tượng & Tên món */}
        <View style={styles.iconContainer}>
          <Text style={styles.foodIcon}>{food.icon}</Text>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodCalories}>{realCalories} kcal</Text>
        </View>

        {/* Cấu trúc mới: Nhập gram */}
        <View style={styles.portionCard}>
          <Text style={styles.cardInfo}>Số Gram (Chuẩn: 100g)</Text>
          <View style={styles.portionControls}>
            <TextInput
              style={styles.gramInput}
              keyboardType="numeric"
              value={quantityStr}
              onChangeText={setQuantityStr}
              placeholder="0"
            />
            <Text style={styles.portionUnit}>Gram</Text>
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
          onPress={handleAddFood}
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
  portionControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  gramInput: {
    width: 120, height: 60, backgroundColor: '#F3F4F6', borderRadius: 12,
    fontSize: 28, fontWeight: '900', textAlign: 'center', color: '#111827'
  },
  portionUnit: { fontSize: 18, color: '#6B7280', fontWeight: '500', marginTop: 4 },
  
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
