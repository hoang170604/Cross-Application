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

// ─── Import Atomic Hooks & Types ─────────────────────────────────────────────
import { useNutrition, useWorkout } from '@/src/hooks';
import { DailyMeals } from '@/src/types';

// ─── Import Atomic Components ────────────────────────────────────────────────
import { ProgressBar } from '@/src/components/atoms/ProgressBar';
import { AppButton } from '@/src/components/atoms/AppButton';
import { MacroMetric } from '@/src/components/molecules/MacroMetric';
import { CalorieCircle } from '@/src/components/organisms/CalorieCircle';
import { MealCard } from '@/src/components/organisms/MealCard';
import { WorkoutChallengeCard } from '@/src/components/organisms/WorkoutChallengeCard';
import { WaterTrackerCard } from '@/src/components/organisms/WaterTrackerCard';

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
    getMacroTargets, 
    addWater,
    tdee
  } = useNutrition();

  const {
    startWorkoutChallenge, 
    pauseWorkoutChallenge, 
    resumeWorkoutChallenge,
    cancelWorkoutChallenge, 
    completeWorkoutChallenge,
  } = useWorkout();

  const [dayWeight, setDayWeight] = useState(String(userProfile.currentWeight ?? userProfile.weight ?? 70));
  const [isWeightFocused, setIsWeightFocused] = useState(false);

  useEffect(() => {
    setDayWeight(String(userProfile.currentWeight ?? userProfile.weight ?? 70));
  }, [userProfile.currentWeight, userProfile.weight]);

  // ── Memoized Calculations ─────────────────────────────────────────────────
  const calStats = useMemo(() => {
    const targetCals = userProfile.targetCalories || 1800;
    const consumed = totalEatenCalories;
    const burned = 301 + (userProfile.extraBurnedCalories || 0);
    const trueRemaining = targetCals + burned - consumed;
    const isOverCalorie = trueRemaining < 0;
    const remainingDisplay = Math.abs(trueRemaining);
    const walkMinutes = Math.ceil((remainingDisplay / 100) * 20);
    const jogMinutes = Math.ceil(walkMinutes / 2);
    const progressPercent = Math.min(1, consumed / (targetCals + burned));
    return { targetCals, consumed, burned, isOverCalorie, remainingDisplay, walkMinutes, jogMinutes, progressPercent };
  }, [totalEatenCalories, userProfile.targetCalories, userProfile.extraBurnedCalories]);

  const todayString = useMemo(() => new Intl.DateTimeFormat('vi-VN', DATE_FMT).format(new Date()), []);

  const macros = useMemo(() => {
    const tm = getMacroTargets(calStats.targetCals, userProfile.goal);
    return [
      { name: 'Tinh bột', value: totalEatenMacros.carbs, total: tm.carbs, color: '#FFB800' },
      { name: 'Chất đạm', value: totalEatenMacros.protein, total: tm.protein, color: '#00C48C' },
      { name: 'Chất béo', value: totalEatenMacros.fat, total: tm.fat, color: '#FF6B6B' },
    ];
  }, [calStats.targetCals, userProfile.goal, totalEatenMacros, getMacroTargets]);

  const fastingBadge = useMemo(() => {
    if (!userProfile.isFasting) return null;
    const g = userProfile.fastingGoal || 16;
    const isEating = userProfile.fastingState === 'EATING';
    const mascot = g <= 14 ? { icon: '🐱', name: '14:10' }
      : g <= 16 ? { icon: '🦊', name: '16:8' }
      : g <= 18 ? { icon: '🐯', name: '18:6' }
      : g <= 20 ? { icon: '🦁', name: '20:4' }
      : { icon: '🐉', name: 'OMAD' };
    return { isEating, mascot };
  }, [userProfile.isFasting, userProfile.fastingGoal, userProfile.fastingState]);

  // ── Stable Callbacks ──────────────────────────────────────────────────────
  const handleStartWorkout = useCallback(() => startWorkoutChallenge(calStats.remainingDisplay), [startWorkoutChallenge, calStats.remainingDisplay]);

  const handlePauseResume = useCallback(() => {
    userProfile.workoutChallenge?.isPaused ? resumeWorkoutChallenge() : pauseWorkoutChallenge();
  }, [userProfile.workoutChallenge?.isPaused, pauseWorkoutChallenge, resumeWorkoutChallenge]);

  const handleCancel = useCallback(() => {
    if (Platform.OS === 'web') {
      if (window.confirm('Bạn muốn hủy thử thách đi bộ không?')) cancelWorkoutChallenge();
    } else {
      Alert.alert('Xác nhận dở dang', 'Các nỗ lực sẽ không được cộng dồn.', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Bỏ cuộc', style: 'destructive', onPress: cancelWorkoutChallenge },
      ]);
    }
  }, [cancelWorkoutChallenge]);

  const handleComplete = useCallback(() => {
    completeWorkoutChallenge();
    Alert.alert('🎉 Tuyệt vời!', 'Calo đã được cộng vào cột Đốt Cháy. Sức khỏe như con tê giác!');
  }, [completeWorkoutChallenge]);

  const handleUpdateWeight = useCallback(() => {
    const n = Number(dayWeight);
    if (isNaN(n) || n <= 0) { Alert.alert('Lỗi', 'Vui lòng nhập số hợp lệ.'); return; }
    updateCurrentWeight(n);
    Alert.alert('Thành công', 'Đã cập nhật cân nặng mới nhất vào hồ sơ!');
  }, [dayWeight, updateCurrentWeight]);

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
                <Ionicons name="flame" size={24} color="#FF8C00" />
                <Text style={{ fontWeight: '700', fontSize: 18 }}>{userProfile.streakCount || 1}</Text>
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

                    {/* Macro Metrics row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      {macros.map((macro) => (
                        <MacroMetric 
                          key={macro.name}
                          label={macro.name}
                          value={macro.value}
                          total={macro.total}
                          color={macro.color}
                        />
                      ))}
                    </View>
                  </View>

                  {/* Fasting Status Badge */}
                  {fastingBadge && (
                    <View style={{ width: '100%', paddingVertical: 14, backgroundColor: fastingBadge.isEating ? '#ECFDF5' : '#FFFBEB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderTopWidth: 1, borderTopColor: fastingBadge.isEating ? '#D1FAE5' : '#FEF3C7' }}>
                      <Text style={{ fontSize: 16 }}>{fastingBadge.isEating ? '🥗' : fastingBadge.mascot.icon}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: fastingBadge.isEating ? '#047857' : '#B45309' }}>
                        {fastingBadge.isEating ? 'Bây giờ: Giờ nạp năng lượng' : `Bây giờ: Đang nhịn ăn (${fastingBadge.mascot.name})`}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Organism: Thử thách vận động & Cảnh báo Calo */}
                <WorkoutChallengeCard 
                  challenge={userProfile.workoutChallenge}
                  remainingDisplay={calStats.remainingDisplay}
                  walkMinutes={calStats.walkMinutes}
                  jogMinutes={calStats.jogMinutes}
                  onStart={handleStartWorkout}
                  onPauseResume={handlePauseResume}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                />
              </View>
            }
            ListFooterComponent={
              <View>
                {/* Organism: Theo dõi nước uống dùng chung */}
                <WaterTrackerCard 
                  intake={userProfile.waterIntake || 0}
                  target={userProfile.waterTarget || 2000}
                  onAddWater={() => addWater(200)}
                />

                {/* Ghi nhận cân nặng */}
                <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: isWeightFocused ? '#00C48C' : '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4, fontWeight: '500' }}>Cân nặng hôm nay</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <TextInput
                        value={dayWeight}
                        onChangeText={setDayWeight}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onFocus={() => setIsWeightFocused(true)}
                        onBlur={() => setIsWeightFocused(false)}
                        style={{ fontSize: 28, fontWeight: '900', color: '#1F2937', padding: 0, minWidth: 60 }}
                      />
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginLeft: 4 }}>kg</Text>
                    </View>
                  </View>
                  <AppButton title="Cập nhật" onPress={handleUpdateWeight} style={{ paddingHorizontal: 20 }} />
                </View>
              </View>
            }
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
