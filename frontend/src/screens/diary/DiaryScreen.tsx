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

import { useNutrition, useTracking } from '@/src/hooks';
import { DailyMeals } from '@/src/types';
import { useTheme } from '@/src/hooks/useTheme';

// ─── Import Atomic Components ────────────────────────────────────────────────
import { ProgressBar } from '@/src/ui/core/ProgressBar';
import { AppButton } from '@/src/ui/core/AppButton';
import { CalorieCircle } from '@/src/ui/CalorieCircle';
import { MealCard } from '@/src/ui/MealCard';
import { MacroRings } from '@/src/ui/MacroRings';
import { ActivitySection } from '@/src/ui/ActivitySection';
import { TrackingSection } from '@/src/ui/TrackingSection';

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

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, paddingHorizontal: 24 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginBottom: 8 }}>
              {/* Organism: Biểu đồ Calo tập trung */}
              <View style={{ backgroundColor: colors.card, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' }}>
                <View style={{ padding: 24 }}>
                  <CalorieCircle
                    consumed={calorieStats.consumed}
                    burned={calorieStats.burned}
                    remaining={calorieStats.remaining}
                    isOver={calorieStats.isOver}
                    progress={calorieStats.progress}
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

            {/* Thẻ Nutrition mới */}
            <MealCard />

            {/* Theo dõi Nước & Cân nặng */}
            <TrackingSection />
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}



