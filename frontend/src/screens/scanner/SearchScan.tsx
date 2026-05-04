import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, FlatList, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
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
import { useEffect } from 'react';

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

/**
 * Màn hình tìm kiếm và thêm lượng ăn.
 */
export default function SearchScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mealType = (params?.mealType as keyof DailyMeals) || 'breakfast';
  
  // Sử dụng hook chuyên biệt từ kiến trúc Atomic
  const { addFood } = useNutrition();
  const { userId } = useAppStore();
  const colors = useTheme();

  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  
  // State lưu danh sách food từ BE
  const [foods, setFoods] = useState<FoodItemDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarb, setCustomCarb] = useState('');
  const [customFat, setCustomFat] = useState('');

  const FILTERS = ['Tất cả', 'Giàu Đạm', 'Ít Tinh bột', 'Ít Béo', 'Món nước', 'Cơm/Xôi', 'Tráng miệng', 'Đồ uống', 'Đồ ăn nhanh'];

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

  const handleAddDataFood = async (food: FoodItemDB) => {
     try {
       // Sử dụng action addFood từ hook useNutrition
       // Action này đã bao gồm: Lưu SQLite local + Gọi API sync lên Backend
       await addFood(mealType, {
         id: food.id,
         name: food.name,
         calories: food.calories,
         protein: food.protein,
         carb: food.carb,
         fat: food.fat,
         quantity: 100, // Mặc định 100g
       });
       router.back();
     } catch (error) {
       console.error('[SearchScan] Error adding food:', error);
       Alert.alert("Lỗi", "Không thể thêm món ăn. Vui lòng thử lại.");
     }
  };

  const handleAddCustom = async () => {
     if (!customName.trim()) {
       Alert.alert("Lỗi", "Vui lòng nhập tên món ăn.");
       return;
     }
     const numCals = Number(customCals);
     if (isNaN(numCals) || numCals <= 0) {
       Alert.alert("Lỗi", "Vui lòng nhập lượng Calo hợp lệ lớn hơn 0.");
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <View style={{ flex: 1, position: 'relative' }}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm món ăn..."
              placeholderTextColor={colors.textSecondary}
              style={{
                width: '100%', paddingLeft: 48, paddingRight: 16, paddingVertical: 12,
                backgroundColor: colors.card, borderRadius: 999,
                fontSize: 16, color: colors.text,
                shadowColor: colors.shadow, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
              }}
            />
          </View>
        </View>

        {activeTab === 'search' && (
          <View style={{ marginBottom: 16 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {FILTERS.map((filter) => {
                const isSelected = selectedFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => setSelectedFilter(filter)}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 8,
                      backgroundColor: isSelected ? '#00C48C' : colors.card,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: isSelected ? '#00C48C' : colors.cardBorder,
                    }}
                  >
                    <Text style={{ 
                      fontSize: 14, 
                      fontWeight: isSelected ? '600' : '500', 
                      color: isSelected ? '#fff' : colors.textSecondary 
                    }}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.cardBorder }}>
          <TouchableOpacity 
            onPress={() => setActiveTab('search')}
            style={{ paddingBottom: 12, borderBottomWidth: activeTab === 'search' ? 2 : 0, borderBottomColor: '#00C48C' }}
          >
            <Text style={{ fontWeight: activeTab === 'search' ? '600' : '500', color: activeTab === 'search' ? '#00C48C' : colors.textSecondary }}>Tìm kiếm</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('custom')}
            style={{ paddingBottom: 12, borderBottomWidth: activeTab === 'custom' ? 2 : 0, borderBottomColor: '#00C48C' }}
          >
            <Text style={{ fontWeight: activeTab === 'custom' ? '600' : '500', color: activeTab === 'custom' ? '#00C48C' : colors.textSecondary }}>Tự nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === 'search' ? (
          <FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}
            initialNumToRender={10}
            windowSize={5}
            maxToRenderPerBatch={10}
            renderItem={({ item: food }) => (
              <View style={{
              width: '100%', flexDirection: 'column', gap: 12,
              padding: 16, backgroundColor: colors.card, borderRadius: 16, marginBottom: 16,
              borderWidth: 1, borderColor: colors.cardBorder,
              shadowColor: colors.shadow, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                 <Text style={{ fontSize: 32 }}>{food.icon}</Text>
                 <View style={{ flex: 1 }}>
                   <Text style={{ fontWeight: '700', fontSize: 18, color: colors.text }}>{food.name}</Text>
                   <Text style={{ fontSize: 14, color: colors.textSecondary }}>{food.portion}</Text>
                 </View>
                 <View style={{ alignItems: 'flex-end' }}>
                   <Text style={{ fontWeight: '700', fontSize: 18, color: colors.text }}>{food.calories}</Text>
                   <Text style={{ fontSize: 12, color: colors.textSecondary }}>kcal</Text>
                 </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, padding: 12, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500' }}>Đạm <Text style={{ color: '#00C48C', fontWeight: '700' }}>{food.protein}g</Text></Text>
                <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500' }}>T.Bột <Text style={{ color: '#F59E0B', fontWeight: '700' }}>{food.carb}g</Text></Text>
                <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500' }}>Béo <Text style={{ color: '#EF4444', fontWeight: '700' }}>{food.fat}g</Text></Text>
              </View>

              <TouchableOpacity 
                onPress={() => handleAddDataFood(food)} 
                style={{
                  width: '100%', paddingVertical: 12, backgroundColor: '#00C48C', borderRadius: 12,
                  alignItems: 'center', justifyContent: 'center', marginTop: 4,
                }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Thêm món này</Text>
              </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
            <View style={{ backgroundColor: colors.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: colors.cardBorder }}>
            <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 16, color: colors.text }}>Nhập món ăn thủ công</Text>
            
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Tên món ăn *</Text>
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder="VD: Ức gà xào sả ớt tự nấu"
              placeholderTextColor={colors.textSecondary}
              style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, color: colors.text }}
            />

            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Tổng Calo (kcal) *</Text>
            <TextInput
              value={customCals}
              onChangeText={setCustomCals}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, color: colors.text }}
            />

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Chất đạm (g)</Text>
                <TextInput
                  value={customProtein}
                  onChangeText={setCustomProtein}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Tinh bột (g)</Text>
                <TextInput
                  value={customCarb}
                  onChangeText={setCustomCarb}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Chất béo (g)</Text>
                <TextInput
                  value={customFat}
                  onChangeText={setCustomFat}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text }}
                />
              </View>
            </View>
            <TouchableOpacity 
              onPress={handleAddCustom}
              style={{ width: '100%', paddingVertical: 16, backgroundColor: '#00C48C', borderRadius: 999, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Xác nhận thêm</Text>
            </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

