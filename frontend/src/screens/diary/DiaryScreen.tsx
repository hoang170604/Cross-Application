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
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/hooks/useTheme';

// ─── Import Atomic Components ────────────────────────────────────────────────
import { ProgressBar } from '@/src/ui/core/ProgressBar';
import { AppButton } from '@/src/ui/core/AppButton';
import { CalorieCircle } from '@/src/ui/CalorieCircle';
import { MealCard } from '@/src/ui/MealCard';
import { MacroRings } from '@/src/ui/MacroRings';
import { ActivitySection } from '@/src/ui/ActivitySection';

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
    totalEatenMacros,
    updateCurrentWeight,
    tdee
  } = useNutrition();

  // ── Activity state ────────────────────────────────────────────────
  const { activityCalories } = useAppStore();

  const colors = useTheme();





  // ── Memoized Calculations ─────────────────────────────────────────────────
  const calStats = useMemo(() => {
    const targetCals = userProfile.targetCalories || 1800;
    const consumed = totalEatenCalories;
    const burned = activityCalories; // Calo đốt cháy từ hoạt động thể chất
    const trueRemaining = targetCals + burned - consumed;
    const isOverCalorie = trueRemaining < 0;
    const remainingDisplay = Math.abs(trueRemaining);
    const progressPercent = Math.min(1, consumed / Math.max(1, targetCals + burned));
    return { targetCals, consumed, burned, isOverCalorie, remainingDisplay, progressPercent };
  }, [totalEatenCalories, userProfile.targetCalories, activityCalories]);

  const todayString = useMemo(() => new Intl.DateTimeFormat('vi-VN', DATE_FMT).format(new Date()), []);



  /** Hàm callback để truy xuất và hiển thị dữ liệu của từng thẻ bữa ăn hằng ngày */
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
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Thanh tiêu đề */}
          <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: colors.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2, color: colors.text }}>NUTRITRACK</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontWeight: '700', fontSize: 18, color: colors.text }}>1</Text>
              </View>
            </View>
            <Text style={{ fontSize: 14, color: colors.textSecondary, fontWeight: '500', textTransform: 'capitalize' }}>{todayString}</Text>
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
                <View style={{ backgroundColor: colors.card, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' }}>
                  <View style={{ padding: 24 }}>
                    <CalorieCircle 
                      consumed={calStats.consumed}
                      burned={calStats.burned}
                      remaining={calStats.remainingDisplay}
                      isOver={calStats.isOverCalorie}
                      progress={calStats.progressPercent}
                    />
                  </View>
                  {/* Macro rings: Carbs / Fat / Protein */}
                  <MacroRings
                    carbEaten={totalEatenMacros.carb}
                    carbTarget={userProfile.targetCarb ?? 0}
                    fatEaten={totalEatenMacros.fat}
                    fatTarget={userProfile.targetFat ?? 0}
                    proteinEaten={totalEatenMacros.protein}
                    proteinTarget={userProfile.targetProtein ?? 0}
                  />
                </View>


                {/* Hoạt động thể chất */}
                <ActivitySection />
              </View>
            }
            ListFooterComponent={<View />}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}



