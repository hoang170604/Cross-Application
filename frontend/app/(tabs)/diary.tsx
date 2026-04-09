import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNutrition } from '@/src/hooks';
import { DailyMeals } from '@/src/types';

// ─── Import Atomic Components ────────────────────────────────────────────────
import { ProgressBar } from '@/src/components/atoms/ProgressBar';
import { AppButton } from '@/src/components/atoms/AppButton';
import { CalorieCircle } from '@/src/components/organisms/CalorieCircle';
import { MealCard } from '@/src/components/organisms/MealCard';

// ─── Định cấu hình dữ liệu tĩnh ───────────────────────────────────────────────
const MEALS_DATA = [
  { id: 'breakfast', name: 'Bữa sáng', time: '7:00 - 9:00' },
  { id: 'lunch', name: 'Bữa trưa', time: '12:00 - 14:00' },
  { id: 'dinner', name: 'Bữa tối', time: '18:00 - 20:00' },
  { id: 'snack', name: 'Bữa phụ', time: 'Bất kỳ' },
] as const;

const DATE_FMT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DiaryDashboardScreen() {
  const router = useRouter();
  
  // Sử dụng các Hook chuyên biệt theo chuẩn Atomic
  const {
    userProfile, 
    totalEatenCalories, 
    updateCurrentWeight,
    tdee
  } = useNutrition();

  // Cân nặng đã được quản lý tập trung qua Hook useNutrition và Organism WeightProgressCard

  // ── Memoized Calculations ─────────────────────────────────────────────────
  const calStats = useMemo(() => {
    const targetCals = userProfile.targetCalories || 1800;
    const consumed = totalEatenCalories;
    const burned = 301;
    const trueRemaining = targetCals + burned - consumed;
    const isOverCalorie = trueRemaining < 0;
    const remainingDisplay = Math.abs(trueRemaining);
    const progressPercent = Math.min(1, consumed / (targetCals + burned));
    return { targetCals, consumed, burned, isOverCalorie, remainingDisplay, progressPercent };
  }, [totalEatenCalories, userProfile.targetCalories]);

  const todayString = useMemo(() => new Intl.DateTimeFormat('vi-VN', DATE_FMT).format(new Date()), []);

  // Logic cập nhật cân nặng được WeightProgressCard thực thi trực tiếp qua updateCurrentWeight

  /** renderMeal: Sử dụng Organism MealCard đã đóng gói */
  const renderMeal = useCallback(({ item: meal }: { item: typeof MEALS_DATA[number] }) => {
    const mealItems = userProfile.dailyMeals?.[meal.id as keyof DailyMeals] || [];
    const mealCals = mealItems.reduce((s, i) => s + i.calories, 0);
    
    return (
      <MealCard 
        title={meal.name}
        time={meal.time}
        items={mealItems}
        totalCalories={mealCals}
        onAddPress={() => router.push({ pathname: '/SearchScan', params: { mealType: meal.id } })}
      />
    );
  }, [userProfile.dailyMeals, router]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {/* Thanh tiêu đề */}
          <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F9FAFB' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2 }}>NUTRITRACK</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontWeight: '700', fontSize: 18 }}>1</Text>
              </View>
            </View>
            <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500', textTransform: 'capitalize' }}>{todayString}</Text>
          </View>

          <FlatList
            data={MEALS_DATA}
            renderItem={renderMeal}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, paddingHorizontal: 24 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            windowSize={5}
            removeClippedSubviews={true}
            ListHeaderComponent={
              <View style={{ marginBottom: 8 }}>
                {/* Organism: Biểu đồ Calo tập trung */}
                <View style={{ backgroundColor: '#fff', borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' }}>
                  <View style={{ padding: 24 }}>
                    <CalorieCircle 
                      consumed={calStats.consumed}
                      burned={calStats.burned}
                      remaining={calStats.remainingDisplay}
                      isOver={calStats.isOverCalorie}
                      progress={calStats.progressPercent}
                    />
                  </View>
                </View>
              </View>
            }
            ListFooterComponent={<View />}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
