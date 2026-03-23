import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useUserProfile, DailyMeals } from '@/context/UserProfileContext';

export default function DiaryDashboardScreen() {
  const router = useRouter();
  const { userProfile, totalEatenCalories, totalEatenMacros, updateCurrentWeight, getMacroTargets } = useUserProfile();
  
  const [waterCups, setWaterCups] = useState(0);
  const currentWeightNum = userProfile.currentWeight !== undefined ? userProfile.currentWeight : (userProfile.weight || 70);
  const [dayWeight, setDayWeight] = useState(String(currentWeightNum));

  useEffect(() => {
    const freshWeight = userProfile.currentWeight !== undefined ? userProfile.currentWeight : (userProfile.weight || 70);
    setDayWeight(String(freshWeight));
  }, [userProfile.currentWeight, userProfile.weight]);
  
  const targetCals = userProfile.targetCalories || 1800;
  const consumed = totalEatenCalories;
  const burned = 301;
  const remaining = Math.max(0, targetCals + burned - consumed);
  
  const [isWeightFocused, setIsWeightFocused] = useState(false);

  const circumference = 2 * Math.PI * 88;
  const progressPercent = Math.min(1, consumed / (targetCals + burned));

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayString = new Intl.DateTimeFormat('vi-VN', options).format(new Date());

  const targetMacros = getMacroTargets(targetCals, userProfile.goal);

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

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {/* Header */}
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

          <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Hero Calorie Card */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>Đã nạp</Text>
              <Text style={{ fontSize: 24, fontWeight: '700' }}>{consumed}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>Đốt cháy</Text>
              <Text style={{ fontSize: 24, fontWeight: '700' }}>301</Text>
            </View>
          </View>

          {/* Circular Progress */}
          <View style={{ width: 192, height: 192, alignSelf: 'center', marginBottom: 24, position: 'relative' }}>
            <Svg width={192} height={192} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={96} cy={96} r={88} stroke="#E5E7EB" strokeWidth={16} fill="none" />
              <Circle
                cx={96} cy={96} r={88}
                stroke="#00C48C" strokeWidth={16} fill="none"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - progressPercent)}`}
                strokeLinecap="round"
              />
            </Svg>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: '700' }}>{remaining.toLocaleString()}</Text>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>Còn lại</Text>
            </View>
          </View>

          {/* Macros */}
          <View style={{ flexDirection: 'column', gap: 16 }}>
            {macros.map((macro) => (
              <View key={macro.name} style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: '#374151', fontWeight: '600' }}>{macro.name}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{macro.value}g / {macro.total}g</Text>
                </View>
                <View style={{ height: 10, backgroundColor: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                  <View style={{
                    height: '100%', borderRadius: 999,
                    backgroundColor: macro.color,
                    width: `${Math.max(0, Math.min(100, macro.total > 0 ? (macro.value / macro.total) * 100 : 0))}%`,
                  }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Meals */}
        {mealsData.map((meal) => {
          const mealItems = userProfile.dailyMeals?.[meal.id as keyof DailyMeals] || [];
          const mealCals = mealItems.reduce((sum, item) => sum + item.calories, 0);

          return (
          <View key={meal.id} style={{
            backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16,
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
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

            {/* Render Food Items */}
            {mealItems.length > 0 ? (
               <View style={{ marginBottom: 12, gap: 8 }}>
                 {mealItems.map(item => (
                   <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Text style={{ fontSize: 14, color: '#374151', flex: 1 }}>• {item.name}</Text>
                     <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>{item.calories} kcal</Text>
                   </View>
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
        })}

        {/* Water Tracker */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
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
              <Text style={{ fontWeight: '700', color: '#3B82F6', fontSize: 18 }}>{waterCups} / 10</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>cốc</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ flex: 1, height: 12, backgroundColor: '#EFF6FF', borderRadius: 999, overflow: 'hidden' }}>
              <View style={{
                height: '100%', backgroundColor: '#3B82F6', borderRadius: 999,
                width: `${(waterCups / 10) * 100}%`,
              }} />
            </View>
            <TouchableOpacity
              onPress={() => setWaterCups((prev) => Math.min(10, prev + 1))}
              style={{
                width: 48, height: 48, backgroundColor: '#3B82F6', borderRadius: 24,
                alignItems: 'center', justifyContent: 'center',
                shadowColor: '#3B82F6', shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
              }}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Logger */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16,
          borderWidth: 1, 
          borderColor: isWeightFocused ? '#00C48C' : '#F3F4F6',
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          shadowColor: isWeightFocused ? '#00C48C' : '#000', 
          shadowOpacity: isWeightFocused ? 0.2 : 0.04, 
          shadowRadius: isWeightFocused ? 8 : 4, 
          elevation: isWeightFocused ? 4 : 1,
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
              shadowColor: '#86EFAC', shadowOpacity: 0.3, shadowRadius: 4, elevation: 2,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
