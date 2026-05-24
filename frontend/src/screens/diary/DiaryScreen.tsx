import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNutrition, useTracking, useFasting } from '@/src/hooks';
import { DailyMeals } from '@/src/types';
import { useTheme } from '@/src/hooks/useTheme';

// ─── Import Atomic Components ────────────────────────────────────────────────
import { ProgressBar } from '@/src/ui/core/ProgressBar';
import { AppButton } from '@/src/ui/core/AppButton';
import { CalorieCircle } from '@/src/ui/diary/CalorieCircle';
import { MealCard } from '@/src/ui/diary/MealCard';
import { MacroRings } from '@/src/ui/diary/MacroRings';
import { ActivitySection } from '@/src/ui/activity/ActivitySection';
import { TrackingSection } from '@/src/ui/tracking/TrackingSection';

// ─── Constants ────────────────────────────────────────────────────────────────

const DATE_FMT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DiaryDashboardScreen() {
  const router = useRouter();
  const colors = useTheme();

  // ─── Custom Hooks (Positioning logic away from UI) ─────────────────────────
  const {
    userProfile,
    totalEatenMacros,
    calorieStats
  } = useNutrition();

  const { fastingMode } = useFasting();

  const todayString = useMemo(() =>
    new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date()),
    []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
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

        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          style={{ flex: 1, paddingHorizontal: 24 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Organism: Biểu đồ Calo tập trung & Macros */}
          <View style={{ backgroundColor: colors.card, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: colors.cardBorder, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, overflow: 'hidden' }}>
            <View style={{ padding: 24, paddingBottom: 16 }}>
              <CalorieCircle
                consumed={calorieStats.consumed}
                burned={calorieStats.burned}
                remaining={calorieStats.remaining}
                isOver={calorieStats.isOver}
                progress={calorieStats.progress}
              />
            </View>

            {/* Macro rings: Carbs / Fat / Protein */}
            <View style={{ paddingHorizontal: 12, paddingBottom: 20 }}>
              <MacroRings
                carbEaten={totalEatenMacros.carb}
                carbTarget={userProfile.targetCarb ?? 0}
                fatEaten={totalEatenMacros.fat}
                fatTarget={userProfile.targetFat ?? 0}
                proteinEaten={totalEatenMacros.protein}
                proteinTarget={userProfile.targetProtein ?? 0}
              />
            </View>

            {/* Status Bar */}
            {fastingMode !== 'idle' && (
              <View style={{
                backgroundColor: fastingMode === 'eating' ? '#10B98122' : '#0ea5e922',
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '800',
                  letterSpacing: 0.5,
                  color: fastingMode === 'eating' ? '#10B981' : '#0ea5e9'
                }}>
                  {fastingMode === 'eating' ? '🍽️ Hiện tại: Đang ăn' : '✦ Hiện tại: Nhịn ăn'}
                </Text>
              </View>
            )}
          </View>

          {/* Hoạt động thể chất */}
          <ActivitySection />

          {/* Thẻ Nutrition mới */}
          <MealCard />

          {/* Theo dõi Nước & Cân nặng */}
          <TrackingSection />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}



