import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Import Atomic Hooks & Types ─────────────────────────────────────────────
import { useNutrition } from '@/src/hooks';
import { DailyMeals } from '@/src/types';
import { VIETNAMESE_FOOD_DB, FoodItemDB } from '@/constants/foodDatabase';

/**
 * Màn hình Tìm kiếm & Thêm món ăn thủ công.
 * Sử dụng hook useNutrition để cập nhật dữ liệu bữa ăn.
 */
export default function SearchScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mealType = (params?.mealType as keyof DailyMeals) || 'breakfast';
  
  // Sử dụng hook chuyên biệt từ kiến trúc Atomic
  const { addFood } = useNutrition();

  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  
  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  const FILTERS = ['Tất cả', 'Giàu Đạm', 'Ít Tinh bột', 'Ít Béo', 'Món nước', 'Cơm/Xôi', 'Tráng miệng', 'Đồ uống', 'Đồ ăn nhanh'];

  const filteredFoods = useMemo(() => {
    return VIETNAMESE_FOOD_DB.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (selectedFilter !== 'Tất cả') {
        if (selectedFilter === 'Giàu Đạm') {
          matchesFilter = food.protein > 15;
        } else if (selectedFilter === 'Ít Tinh bột') {
          matchesFilter = food.carbs < 20;
        } else if (selectedFilter === 'Ít Béo') {
          matchesFilter = food.fat < 10;
        } else {
          matchesFilter = food.category === selectedFilter;
        }
      }

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  const handleAddDataFood = (food: FoodItemDB) => {
     addFood(mealType, {
       id: Math.random().toString(),
       name: food.name,
       calories: food.calories,
       protein: food.protein,
       carbs: food.carbs,
       fat: food.fat
     });
     router.back();
  };

  const handleAddCustom = () => {
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
     const carbs = Number(customCarbs) || 0;
     const fat = Number(customFat) || 0;

     addFood(mealType, {
       id: Math.random().toString(),
       name: customName.trim(),
       calories: numCals,
       protein,
       carbs,
       fat,
     });
     
     router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F9FAFB', zIndex: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2 }}>TÌM KIẾM</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <View style={{ flex: 1, position: 'relative' }}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm món ăn..."
              placeholderTextColor="#9CA3AF"
              style={{
                width: '100%', paddingLeft: 48, paddingRight: 16, paddingVertical: 12,
                backgroundColor: '#fff', borderRadius: 999,
                fontSize: 16, color: '#111827',
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
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
                      backgroundColor: isSelected ? '#00C48C' : '#fff',
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: isSelected ? '#00C48C' : '#E5E7EB',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 14, 
                      fontWeight: isSelected ? '600' : '500', 
                      color: isSelected ? '#fff' : '#4B5563' 
                    }}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
          <TouchableOpacity 
            onPress={() => setActiveTab('search')}
            style={{ paddingBottom: 12, borderBottomWidth: activeTab === 'search' ? 2 : 0, borderBottomColor: '#00C48C' }}
          >
            <Text style={{ fontWeight: activeTab === 'search' ? '600' : '500', color: activeTab === 'search' ? '#00C48C' : '#9CA3AF' }}>Tìm kiếm</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('custom')}
            style={{ paddingBottom: 12, borderBottomWidth: activeTab === 'custom' ? 2 : 0, borderBottomColor: '#00C48C' }}
          >
            <Text style={{ fontWeight: activeTab === 'custom' ? '600' : '500', color: activeTab === 'custom' ? '#00C48C' : '#9CA3AF' }}>Tự nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}>
        {activeTab === 'search' ? (
          filteredFoods.map((food, idx) => (
            <View key={food.id} style={{
              width: '100%', flexDirection: 'column', gap: 12,
              padding: 16, backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                 <Text style={{ fontSize: 32 }}>{food.icon}</Text>
                 <View style={{ flex: 1 }}>
                   <Text style={{ fontWeight: '700', fontSize: 18 }}>{food.name}</Text>
                   <Text style={{ fontSize: 14, color: '#6B7280' }}>{food.portion}</Text>
                 </View>
                 <View style={{ alignItems: 'flex-end' }}>
                   <Text style={{ fontWeight: '700', fontSize: 18 }}>{food.calories}</Text>
                   <Text style={{ fontSize: 12, color: '#6B7280' }}>kcal</Text>
                 </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, color: '#111827', fontWeight: '500' }}>Đạm <Text style={{ color: '#00C48C', fontWeight: '700' }}>{food.protein}g</Text></Text>
                <Text style={{ fontSize: 12, color: '#111827', fontWeight: '500' }}>T.Bột <Text style={{ color: '#F59E0B', fontWeight: '700' }}>{food.carbs}g</Text></Text>
                <Text style={{ fontSize: 12, color: '#111827', fontWeight: '500' }}>Béo <Text style={{ color: '#EF4444', fontWeight: '700' }}>{food.fat}g</Text></Text>
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
          ))
        ) : (
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F3F4F6' }}>
            <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Nhập món ăn thủ công</Text>
            
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Tên món ăn *</Text>
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder="VD: Ức gà xào sả ớt tự nấu"
              style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 }}
            />

            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Tổng Calo (kcal) *</Text>
            <TextInput
              value={customCals}
              onChangeText={setCustomCals}
              placeholder="0"
              keyboardType="numeric"
              style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 }}
            />

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Chất đạm (g)</Text>
                <TextInput
                  value={customProtein}
                  onChangeText={setCustomProtein}
                  placeholder="0"
                  keyboardType="numeric"
                  style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 16 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Tinh bột (g)</Text>
                <TextInput
                  value={customCarbs}
                  onChangeText={setCustomCarbs}
                  placeholder="0"
                  keyboardType="numeric"
                  style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 16 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Chất béo (g)</Text>
                <TextInput
                  value={customFat}
                  onChangeText={setCustomFat}
                  placeholder="0"
                  keyboardType="numeric"
                  style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 16 }}
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
