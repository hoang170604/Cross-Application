import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useUserProfile, DailyMeals, FoodItem, WorkoutChallengeState } from '@/context/UserProfileContext';

// ─── Memo Sub-Components ─────────────────────────────────────────────────────

/** Hàng món ăn: chỉ re-render khi `item` thay đổi */
const FoodItemRow = React.memo(({ item }: { item: FoodItem }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text style={{ fontSize: 14, color: '#374151', flex: 1 }}>• {item.name}</Text>
    <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>{item.calories} kcal</Text>
  </View>
));

/**
 * Đồng hồ đếm ngược hoàn toàn cô lập.
 * setInterval 1s/lần chỉ re-render component này,
 * KHÔNG kéo toàn màn hình / FlatList re-render.
 */
const WorkoutTimerDisplay = React.memo(({ challenge, onPauseResume, onCancel, onComplete }: {
  challenge: WorkoutChallengeState;
  onPauseResume: () => void;
  onCancel: () => void;
  onComplete: () => void;
}) => {
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!challenge.isActive || challenge.isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const elapsed = challenge.accumulatedMs + (Date.now() - challenge.lastResumeTime);
      if (elapsed >= challenge.targetMs) { clearInterval(intervalRef.current!); onComplete(); }
      else setTick(t => t + 1);
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [challenge.isActive, challenge.isPaused, challenge.lastResumeTime, challenge.accumulatedMs, challenge.targetMs, onComplete]);

  const elapsedNow = challenge.isPaused ? 0 : (Date.now() - challenge.lastResumeTime);
  const totalElapsed = challenge.accumulatedMs + elapsedNow;
  const remainingMs = Math.max(0, challenge.targetMs - totalElapsed);
  const progress = Math.min(100, (totalElapsed / challenge.targetMs) * 100);
  const totalSec = Math.floor(remainingMs / 1000);
  const mm = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const ss = (totalSec % 60).toString().padStart(2, '0');

  return (
    <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}>
      <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>🔥 ĐANG ĐỐT CHÁY CALO DƯ THỪA</Text>
      <Text style={{ fontSize: 48, fontWeight: '900', color: '#111827', marginVertical: 8, fontVariant: ['tabular-nums'] }}>{mm}:{ss}</Text>
      <View style={{ width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 20 }}>
        <View style={{ height: '100%', backgroundColor: '#F59E0B', width: `${progress}%` }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={onPauseResume} style={{ flex: 1, paddingVertical: 14, backgroundColor: '#111827', borderRadius: 999, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{challenge.isPaused ? 'Tiếp tục đi' : 'Tạm dừng'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={{ paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FEE2E2', borderRadius: 999, alignItems: 'center' }}>
          <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14 }}>Dừng hẳn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

/** Thẻ cảnh báo vượt Calo */
const CalorieOverCard = React.memo(({ remainingDisplay, walkMinutes, jogMinutes, onStart }: {
  remainingDisplay: number; walkMinutes: number; jogMinutes: number; onStart: () => void;
}) => (
  <View style={{ backgroundColor: '#FFF1F2', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FECDD3' }}>
    <Text style={{ fontSize: 14, color: '#E11D48', fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>
      ⚠️ BẠN CẦN ĐỐT CHÁY {remainingDisplay.toLocaleString()} KCAL DƯ THỪA
    </Text>
    <Text style={{ fontSize: 13, color: '#BE123C', textAlign: 'center', lineHeight: 20, marginBottom: 12 }}>
      Chỉ cần đi bộ thêm khoảng {walkMinutes} phút thôi!{"\n"}{walkMinutes > 120 ? `Hoặc chạy bộ trong ${jogMinutes} phút.` : ''}
    </Text>
    <TouchableOpacity onPress={onStart} style={{ backgroundColor: '#E11D48', borderRadius: 999, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
      <Ionicons name="walk" size={20} color="#fff" style={{ marginRight: 6 }} />
      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Bắt đầu đi bộ ngay</Text>
    </TouchableOpacity>
  </View>
));

// Tĩnh — định nghĩa ngoài component để không tái tạo mỗi render
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
  const {
    userProfile, totalEatenCalories, totalEatenMacros,
    updateCurrentWeight, getMacroTargets, addWater,
    startWorkoutChallenge, pauseWorkoutChallenge, resumeWorkoutChallenge,
    cancelWorkoutChallenge, completeWorkoutChallenge,
  } = useUserProfile();

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

  const waterStats = useMemo(() => ({
    waterCups: Math.floor((userProfile.waterIntake || 0) / 200),
    targetCups: Math.floor((userProfile.waterTarget || 2000) / 200),
  }), [userProfile.waterIntake, userProfile.waterTarget]);

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

  const handleAddWater = useCallback(() => addWater(200), [addWater]);

  const handleUpdateWeight = useCallback(() => {
    const n = Number(dayWeight);
    if (isNaN(n) || n <= 0) { Alert.alert('Lỗi', 'Vui lòng nhập số hợp lệ.'); return; }
    updateCurrentWeight(n);
    Alert.alert('Thành công', 'Đã cập nhật cân nặng mới nhất vào hồ sơ!');
  }, [dayWeight, updateCurrentWeight]);

  /** renderMeal: useCallback → FlatList không invalidate card khác khi 1 card thay đổi */
  const renderMeal = useCallback(({ item: meal }: { item: typeof MEALS_DATA[number] }) => {
    const mealItems = userProfile.dailyMeals?.[meal.id as keyof DailyMeals] || [];
    const mealCals = mealItems.reduce((s, i) => s + i.calories, 0);
    return (
      <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View>
            <Text style={{ fontWeight: '700', fontSize: 18 }}>{meal.name}</Text>
            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{meal.time}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '700', fontSize: 18 }}>{mealCals} kcal</Text>
            {mealItems.length > 0 && <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{mealItems.length} món</Text>}
          </View>
        </View>
        {mealItems.length > 0 ? (
          <View style={{ marginBottom: 12, gap: 8 }}>
            {mealItems.map(item => <FoodItemRow key={item.id} item={item} />)}
          </View>
        ) : (
          <Text style={{ fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 16 }}>Chưa có món ăn</Text>
        )}
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/SearchScan', params: { mealType: meal.id } })}
          style={{ width: '100%', paddingVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Ionicons name="add" size={20} color="#4B5563" />
          <Text style={{ color: '#4B5563', fontWeight: '600' }}>Thêm món</Text>
        </TouchableOpacity>
      </View>
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
              <>
                {/* Thẻ Calo Overview */}
                <View style={{ backgroundColor: '#fff', borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' }}>
                  <View style={{ padding: 24 }}>
                    {/* Hàng Đã nạp — Vòng tròn — Đốt cháy */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>{calStats.consumed}</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' }}>Đã nạp</Text>
                      </View>
                      <View style={{ width: 140, height: 140, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                        <Svg width={140} height={140} style={{ transform: [{ rotate: '-90deg' }] }}>
                          <Circle cx={70} cy={70} r={64} stroke="#F3F4F6" strokeWidth={12} fill="none" strokeLinecap="round" />
                          <Circle
                            cx={70} cy={70} r={64}
                            stroke={calStats.isOverCalorie ? '#F43F5E' : '#00C48C'} strokeWidth={12} fill="none"
                            strokeDasharray={`${2 * Math.PI * 64}`}
                            strokeDashoffset={`${2 * Math.PI * 64 * (1 - calStats.progressPercent)}`}
                            strokeLinecap="round"
                          />
                        </Svg>
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 28, fontWeight: '800', color: calStats.isOverCalorie ? '#F43F5E' : '#111827' }}>
                            {calStats.isOverCalorie ? `-${calStats.remainingDisplay}` : calStats.remainingDisplay.toLocaleString()}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '600' }}>
                            {calStats.isOverCalorie ? 'Vượt mức' : 'Còn lại'}
                          </Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>{calStats.burned}</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' }}>Đốt cháy</Text>
                      </View>
                    </View>

                    {/* Macros - 3 Cột */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      {macros.map((macro) => {
                        const pct = Math.max(0, Math.min(100, macro.total > 0 ? (macro.value / macro.total) * 100 : 0));
                        return (
                          <View key={macro.name} style={{ flex: 1, alignItems: 'center', paddingHorizontal: 6 }}>
                            <Text style={{ fontSize: 13, color: '#4B5563', fontWeight: '600', marginBottom: 12 }}>{macro.name}</Text>
                            <View style={{ width: '100%', height: 4, backgroundColor: '#F3F4F6', borderRadius: 999, marginBottom: 12, justifyContent: 'center' }}>
                              <View style={{ position: 'absolute', left: 0, height: 4, borderRadius: 999, backgroundColor: macro.color, width: `${pct}%` }} />
                              <View style={{ position: 'absolute', left: `${pct}%`, width: 10, height: 10, borderRadius: 5, backgroundColor: macro.color, transform: [{ translateX: -5 }], shadowColor: macro.color, shadowOpacity: 0.5, shadowRadius: 4, elevation: 2 }} />
                            </View>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#111827' }}>
                              {macro.value} <Text style={{ color: '#9CA3AF', fontWeight: '500' }}>/ {macro.total} g</Text>
                            </Text>
                          </View>
                        );
                      })}
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

                {/* Workout Challenge / Smart Nudge — Cô lập khỏi phần còn lại */}
                {userProfile.workoutChallenge?.isActive ? (
                  <WorkoutTimerDisplay
                    challenge={userProfile.workoutChallenge}
                    onPauseResume={handlePauseResume}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                  />
                ) : calStats.isOverCalorie ? (
                  <CalorieOverCard
                    remainingDisplay={calStats.remainingDisplay}
                    walkMinutes={calStats.walkMinutes}
                    jogMinutes={calStats.jogMinutes}
                    onStart={handleStartWorkout}
                  />
                ) : null}
              </>
            }
            ListFooterComponent={
              <View>
                {/* Theo dõi nước uống */}
                <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="water" size={20} color="#3B82F6" />
                      </View>
                      <View>
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>Nước uống</Text>
                        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>(Mục tiêu: 2 Lít / 200ml mỗi cốc)</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: '700', color: '#3B82F6', fontSize: 18 }}>{waterStats.waterCups} / {waterStats.targetCups}</Text>
                      <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>cốc</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ flex: 1, height: 12, backgroundColor: '#EFF6FF', borderRadius: 999, overflow: 'hidden' }}>
                      <View style={{ height: '100%', backgroundColor: '#3B82F6', borderRadius: 999, width: `${Math.min(100, waterStats.targetCups > 0 ? (waterStats.waterCups / waterStats.targetCups) * 100 : 0)}%` }} />
                    </View>
                    <TouchableOpacity onPress={handleAddWater} style={{ width: 48, height: 48, backgroundColor: '#3B82F6', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

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
                  <TouchableOpacity onPress={handleUpdateWeight} style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#00C48C', borderRadius: 999 }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Cập nhật</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
