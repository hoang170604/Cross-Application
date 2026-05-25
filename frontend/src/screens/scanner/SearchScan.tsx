import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Alert,
  FlatList, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Import Atomic Hooks & Types ─────────────────────────────────────────────
import { useAppStore } from '@/src/store/useAppStore';
import apiClient from '@/src/api/apiClient';
import { useNutrition } from '@/src/hooks';
import { DailyMeals } from '@/src/types';
import { FoodItemDB } from '@/constants/foodDatabase';
import { useTheme } from '@/src/hooks/useTheme';
import { getAllFoods } from '@/src/api/foodService';


// Hàm lấy icon theo category (tương đương với các icon đã setup)
const getIconForCategory = (categoryName: string) => {
  if (!categoryName) return '🍲';
  const name = categoryName.toLowerCase();
  if (name.includes('nước')) return '🍲';
  if (name.includes('chiên') || name.includes('nướng')) return '🍗';
  if (name.includes('cơm') || name.includes('xôi')) return '🍛';
  if (name.includes('nhanh') || name.includes('bánh mì')) return '🥖';
  if (name.includes('tráng miệng')) return '🍧';
  if (name.includes('uống')) return '🧋';
  if (name.includes('rau') || name.includes('củ')) return '🥦';
  if (name.includes('trái cây')) return '🍎';
  if (name.includes('hải sản')) return '🦐';
  if (name.includes('thịt')) return '🥩';
  if (name.includes('trứng') || name.includes('sữa')) return '🥚';
  return '🍱';
};

// ─── Constants ────────────────────────────────────────────────────────────────
const GREEN = '#00C48C';
const FILTERS = [
  'Tất cả', 'Giàu Đạm', 'Ít Tinh bột', 'Ít Béo',
  'Món nước', 'Cơm/Xôi', 'Tráng miệng', 'Đồ uống', 'Đồ ăn nhanh',
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: QuickAddButton
// Nút "+" nhỏ — bấm nhiều lần được, icon tạm chuyển thành ✓ trong 700ms.
// ─────────────────────────────────────────────────────────────────────────────
interface QuickAddButtonProps {
  onPress: () => void;
}

const QuickAddButton = ({ onPress }: QuickAddButtonProps) => {
  const [checked, setChecked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = () => {
    onPress();

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.75, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();

    // Flash checkmark then revert
    setChecked(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setChecked(false), 700);
  };

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: checked ? GREEN : 'transparent',
          borderWidth: 2,
          borderColor: GREEN,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={checked ? 'checkmark' : 'add'}
          size={20}
          color={checked ? '#fff' : GREEN}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: FoodCardItem
// ─────────────────────────────────────────────────────────────────────────────
interface FoodCardItemProps {
  food: FoodItemDB;
  onQuickAdd: (food: FoodItemDB) => void;
  colors: ReturnType<typeof useTheme>;
}

const FoodCardItem = React.memo(({ food, onQuickAdd, colors }: FoodCardItemProps) => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        shadowColor: colors.shadow,
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      {/* Header row — icon | name+portion | calo + nút + */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Text style={{ fontSize: 32 }}>{food.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', fontSize: 17, color: colors.text }}>{food.name}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{food.portion}</Text>
        </View>
        {/* Calo + nút + */}
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '700', fontSize: 18, color: colors.text }}>{food.calories}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>kcal</Text>
          </View>
          <QuickAddButton onPress={() => onQuickAdd(food)} />
        </View>
      </View>

      {/* Macros row */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: colors.surface, padding: 10, borderRadius: 8, gap: 8,
      }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500', marginRight: 4 }}>Đạm</Text>
          <Text style={{ color: GREEN, fontWeight: '700', fontSize: 12 }}>{food.protein}g</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500', marginRight: 4 }}>T.Bột</Text>
          <Text style={{ color: '#F59E0B', fontWeight: '700', fontSize: 12 }}>{food.carb}g</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500', marginRight: 4 }}>Béo</Text>
          <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 12 }}>{food.fat}g</Text>
        </View>
      </View>
    </View>
  );
});
FoodCardItem.displayName = 'FoodCardItem';


// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: ToastNotification
// Nâng cấp: message cập nhật động — không re-mount, không flicker.
// ─────────────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  visible: boolean;
}

const ToastNotification = ({ message, visible }: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  // Lưu message trong ref để tránh stale closure khi animation đang chạy
  const [displayMessage, setDisplayMessage] = useState(message);

  // Cập nhật message ngay khi thay đổi (không cần ẩn/hiện lại)
  useEffect(() => {
    if (message) setDisplayMessage(message);
  }, [message]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 7, tension: 70 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 60,
        left: 24,
        right: 24,
        zIndex: 999,
        opacity,
        transform: [{ translateY }],
        backgroundColor: '#1a1a2e',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 20,
      }}
    >
      <View style={{
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: GREEN,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="checkmark" size={18} color="#fff" />
      </View>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, flex: 1 }}>
        {displayMessage}
      </Text>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Màn hình tìm kiếm và thêm lượng ăn.
 *
 * Chức năng:
 * - Quick-add (+): Bấm nhiều lần để thêm nhiều phần của cùng một món.
 * - Toast notification: Hiển thị số phần đã thêm, cập nhật động không flicker.
 * - Tự nhập: Form nhập món ăn thủ công.
 */
export default function SearchScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mealType = (params?.mealType as keyof DailyMeals) || 'breakfast';

  const { addFood } = useNutrition();
  const { userId } = useAppStore();
  const colors = useTheme();

  // ── Tabs & filters ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  // State lưu danh sách food từ BE
  const [foods, setFoods] = useState<FoodItemDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Quick-add count per food (key = food.id) ─────────────────────────────────
  const quickAddCountsRef = useRef<Map<number, number>>(new Map());

  // ── Toast state ─────────────────────────────────────────────────────────────
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Custom food inputs ──────────────────────────────────────────────────────
  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarb, setCustomCarb] = useState('');
  const [customFat, setCustomFat] = useState('');

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const res = await getAllFoods();
        if (res && res.data) {
          // Chuyển đổi dữ liệu BE -> UI
          const mappedFoods: FoodItemDB[] = res.data.map(f => ({
            id: f.id,
            name: f.name,
            calories: f.caloriesPer100g,
            protein: f.proteinPer100g,
            carb: f.carbPer100g,
            fat: f.fatPer100g,
            portion: '100g',
            icon: getIconForCategory(f.category?.name || ''),
            category: f.category?.name || 'Khác',
            tags: []
          }));
          setFoods(mappedFoods);
        }
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesFilter = true;
      if (selectedFilter !== 'Tất cả') {
        if (selectedFilter === 'Giàu Đạm') {
          matchesFilter = food.protein > 15;
        } else if (selectedFilter === 'Ít Tinh bột') {
          matchesFilter = food.carb < 20;
        } else if (selectedFilter === 'Ít Béo') {
          matchesFilter = food.fat < 10;
        } else {
          matchesFilter = food.category === selectedFilter;
        }
      }
      return matchesSearch && matchesFilter;
    });
  }, [foods, searchQuery, selectedFilter]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      quickAddCountsRef.current.clear();
    }, 2500);
  }, []);

  const handleQuickAdd = useCallback(async (food: FoodItemDB) => {
    const prev = quickAddCountsRef.current.get(food.id) ?? 0;
    const next = prev + 1;
    quickAddCountsRef.current.set(food.id, next);

    const countLabel = next > 1 ? `${next} phần` : '1 phần';
    const msg = `Đã thêm ${countLabel} ${food.name}`;

    try {
       await addFood(mealType, {
         id: food.id,
         name: food.name,
         calories: food.calories,
         protein: food.protein,
         carb: food.carb,
         fat: food.fat,
         quantity: 100,
       });
       showToast(msg);
    } catch (error) {
       console.error('[SearchScan] Error adding food:', error);
       Alert.alert("Lỗi", "Không thể thêm món ăn. Vui lòng thử lại.");
    }
  }, [addFood, mealType, showToast]);

  const handleAddCustom = async () => {
    if (!customName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn.');
      return;
    }
    const numCals = Number(customCals);
    if (isNaN(numCals) || numCals <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập lượng Calo hợp lệ lớn hơn 0.');
      return;
    }
    const protein = Number(customProtein) || 0;
    const carb = Number(customCarb) || 0;
    const fat = Number(customFat) || 0;

    try {
      // Đối với món tự nhập, id = 0 để Backend biết đây là custom food
      await addFood(mealType, {
        id: 0, 
        name: customName.trim(),
        calories: numCals,
        protein,
        carb,
        fat,
        quantity: 100,
      });
      router.back();
    } catch (error) {
      console.error('[SearchScan] Error adding custom food:', error);
      Alert.alert("Lỗi", "Không thể thêm món ăn. Vui lòng thử lại.");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

        {/* ── Header ── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: colors.background, zIndex: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
                alignItems: 'center', justifyContent: 'center',
                shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
              }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2, color: colors.text }}>TÌM KIẾM</Text>
          </View>

          {/* Search bar */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: colors.card, 
            borderRadius: 999, 
            paddingHorizontal: 16, 
            paddingVertical: Platform.OS === 'ios' ? 10 : 6,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.cardBorder || 'transparent',
            shadowColor: colors.shadow, 
            shadowOpacity: 0.04, 
            shadowRadius: 4, 
            elevation: 1 
          }}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm món ăn..."
              placeholderTextColor={colors.textSecondary}
              style={{
                flex: 1,
                fontSize: 16, 
                color: colors.text,
                paddingVertical: 4,
                paddingHorizontal: 0,
              }}
            />
          </View>

          {/* Filter chips */}
          {activeTab === 'search' && (
            <View style={{ marginBottom: 16 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {FILTERS.map((filter) => {
                  const isActive = selectedFilter === filter;
                  return (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => setSelectedFilter(filter)}
                      style={{
                        paddingHorizontal: 16, paddingVertical: 8,
                        backgroundColor: isActive ? GREEN : colors.card,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: isActive ? GREEN : colors.cardBorder,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: isActive ? '600' : '500', color: isActive ? '#fff' : colors.textSecondary }}>
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.cardBorder }}>
            {(['search', 'custom'] as const).map((tab) => {
              const label = tab === 'search' ? 'Tìm kiếm' : 'Tự nhập';
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{ paddingBottom: 12, borderBottomWidth: isActive ? 2 : 0, borderBottomColor: GREEN }}
                >
                  <Text style={{ fontWeight: isActive ? '600' : '500', color: isActive ? GREEN : colors.textSecondary }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Content ── */}
        <View style={{ flex: 1 }}>
          {activeTab === 'search' ? (
            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 24,
                paddingTop: 8,
              }}
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={10}
              renderItem={({ item: food }) => (
                <FoodCardItem
                  food={food}
                  onQuickAdd={handleQuickAdd}
                  colors={colors}
                />
              )}
            />
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ backgroundColor: colors.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: colors.cardBorder }}>
                <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 16, color: colors.text }}>Nhập món ăn thủ công</Text>

                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Tên món ăn *</Text>
                <TextInput
                  value={customName} onChangeText={setCustomName}
                  placeholder="VD: Ức gà xào sả ớt tự nấu"
                  placeholderTextColor={colors.textSecondary}
                  style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, color: colors.text }}
                />

                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Tổng Calo (kcal) *</Text>
                <TextInput
                  value={customCals} onChangeText={setCustomCals}
                  placeholder="0" placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, color: colors.text }}
                />

                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Chất đạm (g)', value: customProtein, setter: setCustomProtein },
                    { label: 'Tinh bột (g)', value: customCarb, setter: setCustomCarb },
                    { label: 'Chất béo (g)', value: customFat, setter: setCustomFat },
                  ].map(({ label, value, setter }) => (
                    <View key={label} style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 }}>{label}</Text>
                      <TextInput
                        value={value} onChangeText={setter}
                        placeholder="0" placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                        style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text }}
                      />
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleAddCustom}
                  style={{ width: '100%', paddingVertical: 16, backgroundColor: GREEN, borderRadius: 999, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Xác nhận thêm</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>

        {/* ── Toast Notification ── */}
        <ToastNotification message={toastMessage} visible={toastVisible} />

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
