import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useUserProfile, DailyMeals, FoodItem } from '@/context/UserProfileContext';

const FoodItemRow = React.memo(({ item }: { item: FoodItem }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text style={{ fontSize: 14, color: '#374151', flex: 1 }}>• {item.name}</Text>
    <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>{item.calories} kcal</Text>
  </View>
));

export default function DiaryDashboardScreen() {
  const router = useRouter();
  const { userProfile, totalEatenCalories, totalEatenMacros, updateCurrentWeight, getMacroTargets, addWater, startWorkoutChallenge, pauseWorkoutChallenge, resumeWorkoutChallenge, cancelWorkoutChallenge, completeWorkoutChallenge } = useUserProfile();
  
  const waterIntake = userProfile.waterIntake || 0;
  const waterTarget = userProfile.waterTarget || 2000;
  const waterCups = Math.floor(waterIntake / 200);
  const targetCups = Math.floor(waterTarget / 200);
  const currentWeightNum = userProfile.currentWeight !== undefined ? userProfile.currentWeight : (userProfile.weight || 70);
  const [dayWeight, setDayWeight] = useState(String(currentWeightNum));

  useEffect(() => {
    const freshWeight = userProfile.currentWeight !== undefined ? userProfile.currentWeight : (userProfile.weight || 70);
    setDayWeight(String(freshWeight));
  }, [userProfile.currentWeight, userProfile.weight]);
  
  /**
   * CẤU HÌNH LOGIC NĂNG LƯỢNG (CALORIES)
   * - targetCals: Mức TDEE thực tế đã được chuẩn hóa theo Mục tiêu (VD: Giảm cân thì -500).
   * - consumed: Tổng lượng Calo đã nạp thông qua các bữa ăn trong ngày.
   * - burned: Lượng Calo đốt cháy thêm từ vận động (Hiện đang giả lập ở mức 301 kcal, sẽ mở rộng để lấy từ HealthKit).
   * - remaining: Tổng lượng Calo (Công suất dư) còn lại người dùng được phép nạp.
   */
  const targetCals = userProfile.targetCalories || 1800;
  const consumed = totalEatenCalories;
  const burned = 301 + (userProfile.extraBurnedCalories || 0);
  const trueRemaining = targetCals + burned - consumed;
  const isOverCalorie = trueRemaining < 0;
  const remainingDisplay = Math.abs(trueRemaining);
  
  // Tính toán số phút vận động (100kcal = 20 phút đi bộ)
  const walkMinutes = Math.ceil((remainingDisplay / 100) * 20);
  const jogMinutes = Math.ceil(walkMinutes / 2);

  // Bộ đếm thời gian (Local Timer) cập nhật giao diện
  const [localTimer, setLocalTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (userProfile.workoutChallenge?.isActive && !userProfile.workoutChallenge.isPaused) {
      interval = setInterval(() => {
        const wc = userProfile.workoutChallenge!;
        const elapsedNow = Date.now() - wc.lastResumeTime;
        const totalElapsed = wc.accumulatedMs + elapsedNow;
        const remaining = Math.max(0, wc.targetMs - totalElapsed);
        
        if (remaining <= 0) {
           clearInterval(interval);
           completeWorkoutChallenge();
           if (Platform.OS === 'web') {
               window.alert("🎉 Tuyệt vời! Bạn đã hoàn thành thử thách xóa nợ năng lượng! Phần Calo này đã tự động chuyển sang Cột Đốt Cháy.");
           } else {
               Alert.alert("🎉 Tuyệt vời!", "Bạn đã hoàn thành thử thách xóa nợ năng lượng! Phần Calo đã được cộng gộp vào Cột Đốt Cháy.");
           }
        } else {
           setLocalTimer(Date.now());
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [userProfile.workoutChallenge, completeWorkoutChallenge]);

  // Giải mã Data -> Render Values
  let wcRemainingMs = 0;
  let wcProgress = 0;
  if (userProfile.workoutChallenge?.isActive) {
     const wc = userProfile.workoutChallenge;
     const elapsedNow = wc.isPaused ? 0 : (Date.now() - wc.lastResumeTime);
     const totalElapsed = wc.accumulatedMs + elapsedNow;
     wcRemainingMs = Math.max(0, wc.targetMs - totalElapsed);
     wcProgress = Math.min(100, (totalElapsed / wc.targetMs) * 100);
  }

  const formatChallengeTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  const [isWeightFocused, setIsWeightFocused] = useState(false);

  const circumference = 2 * Math.PI * 88;
  const progressPercent = Math.min(1, consumed / (targetCals + burned));

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayString = new Intl.DateTimeFormat('vi-VN', options).format(new Date());

  const targetMacros = getMacroTargets(targetCals, userProfile.goal);

  /**
   * CẤU HÌNH ĐẠI LƯỢNG DINH DƯỠNG (MACROS)
   * Tùy thuộc vào Mục tiêu (từ `getMacroTargets`), tỉ lệ các chất sẽ được thiết lập tự động.
   * Ví dụ khi Giảm cân: 30% Tinh bột - 40% Đạm - 30% Béo theo hệ quy chiếu skill.md.
   * Cấu trúc mảng dưới đây ánh xạ (Map) Data để dựng UI Thanh Tiến Trình (Progress Bars).
   */
  const macros = [
    { name: 'Tinh bột', value: totalEatenMacros.carbs, total: targetMacros.carbs, color: '#FFB800' },
    { name: 'Chất đạm', value: totalEatenMacros.protein, total: targetMacros.protein, color: '#00C48C' },
    { name: 'Chất béo', value: totalEatenMacros.fat, total: targetMacros.fat, color: '#FF6B6B' },
  ];

  const mealsData = [
    { id: 'breakfast', name: 'Bữa sáng', time: '7:00 - 9:00' },
    { id: 'lunch', name: 'Bữa trưa', time: '12:00 - 14:00' },
    { id: 'dinner', name: 'Bữa tối', time: '18:00 - 20:00' },
    { id: 'snack', name: 'Bữa phụ', time: 'Bất kỳ' },
  ] as const;

  const renderMeal = ({ item: meal }: { item: typeof mealsData[number] }) => {
    const mealItems = userProfile.dailyMeals?.[meal.id as keyof DailyMeals] || [];
    const mealCals = mealItems.reduce((sum, item) => sum + item.calories, 0);

    return (
      <View style={{
        backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16,
        borderWidth: 1, borderColor: '#F3F4F6',
      }}>
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

        {/* Hiển thị món ăn */}
        {mealItems.length > 0 ? (
           <View style={{ marginBottom: 12, gap: 8 }}>
             {mealItems.map(item => (
               <FoodItemRow key={item.id} item={item} />
             ))}
           </View>
        ) : (
           <Text style={{ fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 16 }}>Chưa có món ăn</Text>
        )}

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/SearchScan', params: { mealType: meal.id } })}
          style={{
            width: '100%', paddingVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Ionicons name="add" size={20} color="#4B5563" />
          <Text style={{ color: '#4B5563', fontWeight: '600' }}>Thêm món</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
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
            data={mealsData}
            renderItem={renderMeal}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, paddingHorizontal: 24 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={{
                backgroundColor: '#fff', borderRadius: 24, marginBottom: 24,
                borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden'
              }}>
                <View style={{ padding: 24 }}>
                  {/* Top: Đã nạp - Còn lại - Đốt cháy */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>{consumed}</Text>
                      <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' }}>Đã nạp</Text>
                    </View>

                    {/* Vòng tiến trình */}
                    <View style={{ width: 140, height: 140, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                      <Svg width={140} height={140} style={{ transform: [{ rotate: '-90deg' }] }}>
                        <Circle cx={70} cy={70} r={64} stroke="#F3F4F6" strokeWidth={12} fill="none" strokeLinecap="round" />
                        <Circle
                          cx={70} cy={70} r={64}
                          stroke={isOverCalorie ? "#F43F5E" : "#00C48C"} strokeWidth={12} fill="none"
                          strokeDasharray={`${2 * Math.PI * 64}`}
                          strokeDashoffset={`${2 * Math.PI * 64 * (1 - progressPercent)}`}
                          strokeLinecap="round"
                        />
                      </Svg>
                      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: isOverCalorie ? '#F43F5E' : '#111827' }}>
                          {isOverCalorie ? `-${remainingDisplay}` : remainingDisplay.toLocaleString()}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '600' }}>
                          {isOverCalorie ? 'Vượt mức' : 'Còn lại'}
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>{burned}</Text>
                      <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' }}>Đốt cháy</Text>
                    </View>
                  </View>

                  {/* Dinh dưỡng (Macros) - 3 Cột ngang */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {macros.map((macro) => {
                      const percent = Math.max(0, Math.min(100, macro.total > 0 ? (macro.value / macro.total) * 100 : 0));
                      return (
                        <View key={macro.name} style={{ flex: 1, alignItems: 'center', paddingHorizontal: 6 }}>
                          <Text style={{ fontSize: 13, color: '#4B5563', fontWeight: '600', marginBottom: 12 }}>{macro.name}</Text>
                          
                          <View style={{ width: '100%', height: 4, backgroundColor: '#F3F4F6', borderRadius: 999, marginBottom: 12, justifyContent: 'center' }}>
                            <View style={{
                              position: 'absolute', left: 0, height: 4, borderRadius: 999,
                              backgroundColor: macro.color, width: `${percent}%`,
                            }} />
                            <View style={{
                              position: 'absolute', left: `${percent}%`, width: 10, height: 10, borderRadius: 5,
                              backgroundColor: macro.color, transform: [{ translateX: -5 }],
                              shadowColor: macro.color, shadowOpacity: 0.5, shadowRadius: 4, elevation: 2,
                            }} />
                          </View>

                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#111827' }}>
                            {macro.value} <Text style={{ color: '#9CA3AF', fontWeight: '500' }}>/ {macro.total} g</Text>
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Status bar */}
                {userProfile.isFasting && (() => {
                  const getMascot = (goal: number) => {
                    if (goal <= 14) return { icon: '🐱', name: '14:10' };
                    if (goal <= 16) return { icon: '🦊', name: '16:8' };
                    if (goal <= 18) return { icon: '🐯', name: '18:6' };
                    if (goal <= 20) return { icon: '🦁', name: '20:4' };
                    return { icon: '🐉', name: 'OMAD' };
                  };
                  const mascotInfo = getMascot(userProfile.fastingGoal || 16);

                  return (
                    <View style={{
                      width: '100%', paddingVertical: 14,
                      backgroundColor: userProfile.fastingState === 'EATING' ? '#ECFDF5' : '#FFFBEB',
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                      borderTopWidth: 1, borderTopColor: userProfile.fastingState === 'EATING' ? '#D1FAE5' : '#FEF3C7',
                    }}>
                      <Text style={{ fontSize: 16 }}>{userProfile.fastingState === 'EATING' ? '🥗' : mascotInfo.icon}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: userProfile.fastingState === 'EATING' ? '#047857' : '#B45309' }}>
                        {userProfile.fastingState === 'EATING' 
                          ? 'Bây giờ: Giờ nạp năng lượng' 
                          : `Bây giờ: Đang nhịn ăn (${mascotInfo.name})`}
                      </Text>
                    </View>
                  );
                })()}

                {/* Dòng khuyên nhủ (Smart Nudge) & Workout Challenge */}
                {userProfile.workoutChallenge?.isActive ? (
                  <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>🔥 ĐANG ĐỐT CHÁY CALO DƯ THỪA</Text>
                    <Text style={{ fontSize: 48, fontWeight: '900', color: '#111827', marginVertical: 8, fontVariant: ['tabular-nums'] }}>
                      {formatChallengeTime(wcRemainingMs)}
                    </Text>
                    
                    {/* Progress Bar */}
                    <View style={{ width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 20 }}>
                      <View style={{ height: '100%', backgroundColor: '#F59E0B', width: `${wcProgress}%` }} />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity 
                        onPress={() => userProfile.workoutChallenge?.isPaused ? resumeWorkoutChallenge() : pauseWorkoutChallenge()}
                        style={{ flex: 1, paddingVertical: 14, backgroundColor: '#111827', borderRadius: 999, alignItems: 'center' }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                          {userProfile.workoutChallenge?.isPaused ? 'Tiếp tục đi' : 'Tạm dừng'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => {
                           if (Platform.OS === 'web') {
                              const confirm = window.confirm('Bạn có chắc chắn muốn hủy bỏ thử thách đi bộ không? Lượng calo chưa đốt sẽ không được tính.');
                              if (confirm) cancelWorkoutChallenge();
                           } else {
                              Alert.alert('Xác nhận dở dang', 'Bạn có chắc chắn muốn từ bỏ thử thách đi bộ không? Các nỗ lực vừa qua sẽ không được cộng dồn.', [
                                { text: 'Hủy', style: 'cancel' },
                                { text: 'Bỏ cuộc', style: 'destructive', onPress: cancelWorkoutChallenge }
                              ]);
                           }
                        }}
                        style={{ paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FEE2E2', borderRadius: 999, alignItems: 'center' }}
                      >
                         <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14 }}>Dừng hẳn</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  isOverCalorie && (
                    <View style={{ backgroundColor: '#FFF1F2', borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#FECDD3' }}>
                      <Text style={{ fontSize: 14, color: '#E11D48', fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>
                        ⚠️ BẠN CẦN ĐỐT CHÁY {remainingDisplay.toLocaleString()} KCAL DƯ THỪA
                      </Text>
                      <Text style={{ fontSize: 13, color: '#BE123C', textAlign: 'center', lineHeight: 20, marginBottom: 12 }}>
                        Chỉ cần đi bộ thêm khoảng {walkMinutes} phút thôi!{"\n"}
                        {walkMinutes > 120 ? ` Hoặc chạy bộ trong ${jogMinutes} phút.` : ''}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => startWorkoutChallenge(remainingDisplay)}
                        style={{ backgroundColor: '#E11D48', borderRadius: 999, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                      >
                        <Ionicons name="walk" size={20} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Bắt đầu đi bộ ngay</Text>
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </View>
            }
            ListFooterComponent={
              <View>
                {/* Theo dõi nước uống */}
                <View style={{
                  backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16,
                  borderWidth: 1, borderColor: '#F3F4F6',
                }}>
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
                      <Text style={{ fontWeight: '700', color: '#3B82F6', fontSize: 18 }}>{waterCups} / {targetCups}</Text>
                      <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>cốc</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ flex: 1, height: 12, backgroundColor: '#EFF6FF', borderRadius: 999, overflow: 'hidden' }}>
                      <View style={{
                        height: '100%', backgroundColor: '#3B82F6', borderRadius: 999,
                        width: `${Math.min(100, (waterCups / targetCups) * 100)}%`,
                      }} />
                    </View>
                    <TouchableOpacity
                      onPress={() => addWater(200)}
                      style={{
                        width: 48, height: 48, backgroundColor: '#3B82F6', borderRadius: 24,
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Ghi nhận cân nặng */}
                <View style={{
                  backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16,
                  borderWidth: 1, 
                  borderColor: isWeightFocused ? '#00C48C' : '#F3F4F6',
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                }}>
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
                  <TouchableOpacity
                    onPress={() => {
                      const numTarget = Number(dayWeight);
                      if (isNaN(numTarget) || numTarget <= 0) {
                         Alert.alert("Lỗi", "Vui lòng nhập số hợp lệ.");
                         return;
                      }
                      updateCurrentWeight(numTarget);
                      Alert.alert("Thành công", "Đã cập nhật cân nặng mới nhất vào hồ sơ!");
                    }}
                    style={{
                      paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#00C48C', borderRadius: 999,
                    }}
                  >
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
