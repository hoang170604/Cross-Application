import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  LayoutAnimation, Platform, UIManager, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNutrition } from '@/src/hooks';
import { SharedHeader } from '@/src/ui/SharedHeader';
import { useTheme } from '@/src/hooks/useTheme';
import { FoodItem, DailyMeals } from '@/src/types';

// Kích hoạt LayoutAnimation cho Android để checkbox trượt mượt mà
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function MealDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mealType = (params.mealType as keyof DailyMeals) || 'lunch';
  const colors = useTheme();

  const { userProfile, removeFoods } = useNutrition();
  const foods = userProfile.dailyMeals?.[mealType] || [];

  // State quản lý chế độ Edit và mảng ID các món được chọn
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Tắt bật Edit Mode
  const toggleEditMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditMode(!isEditMode);
    setSelectedIds([]); // Xóa danh sách chọn khi thoát hoặc vào Edit
  };

  // Chọn / bỏ chọn 1 item
  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Chọn tất cả / Bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === foods.length) {
      setSelectedIds([]); // Deselect All
    } else {
      setSelectedIds(foods.map((f) => f.id)); // Select All
    }
  };

  // Nút xóa nhiều món
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    Alert.alert(
      'Xóa món ăn',
      `Bạn có chắc chắn muốn xóa ${selectedIds.length} món ăn đã chọn khỏi bữa ăn này?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            removeFoods(mealType, selectedIds);
            setIsEditMode(false);
            setSelectedIds([]);
          } 
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: FoodItem }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        activeOpacity={isEditMode ? 0.7 : 1}
        onPress={() => isEditMode && toggleSelection(item.id)}
        style={[
          styles.card,
          { 
            backgroundColor: isSelected ? (colors.isDark ? '#1a3333' : '#eafaf4') : colors.card, 
            borderColor: isSelected ? '#00E5FF' : colors.cardBorder 
          }
        ]}
      >
        <View style={styles.cardContent}>
          {/* Cột Checkbox bên trái xuất hiện khi Edit Mode */}
          {isEditMode && (
            <View style={styles.checkboxContainer}>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={isSelected ? "#00E5FF" : colors.textSecondary}
              />
            </View>
          )}

          {/* Cột Thông tin món ăn */}
          <View style={styles.foodInfo}>
            <Text style={[styles.foodName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.foodDetail, { color: colors.textSecondary }]}>
              {item.quantity}g • {item.calories} kcal
            </Text>
          </View>
          
          {/* Cột Macros tóm tắt */}
          <View style={styles.macroRow}>
            <Text style={[styles.macroText, { color: '#00C48C' }]}>{item.protein}g Đạm</Text>
            <Text style={[styles.macroText, { color: '#FFB800' }]}>{item.carb}g T.Bột</Text>
            <Text style={[styles.macroText, { color: '#FF6B6B' }]}>{item.fat}g Béo</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Tên hiển thị trên Header
  const mealNameMap: Record<string, string> = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
    snack: 'Ăn vặt'
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <SharedHeader 
        title={mealNameMap[mealType] || 'Danh sách món ăn'} 
        showBack 
        rightAction={
          foods.length > 0 ? (
            <TouchableOpacity onPress={toggleEditMode} style={styles.headerBtn}>
              <Text style={{ color: isEditMode ? '#FF3B30' : '#00E5FF', fontWeight: '700', fontSize: 16 }}>
                {isEditMode ? 'Hủy' : 'Edit'}
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Thanh công cụ Select All khi ở Edit Mode */}
      {isEditMode && foods.length > 0 && (
        <View style={[styles.editActions, { borderBottomColor: colors.cardBorder }]}>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={{ color: '#00E5FF', fontWeight: '600', fontSize: 15 }}>
              {selectedIds.length === foods.length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: colors.text, fontWeight: '500' }}>
            Đã chọn: {selectedIds.length}
          </Text>
        </View>
      )}

      <FlatList
        data={foods}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={64} color={colors.textSecondary} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Bạn chưa thêm món nào cho bữa này.</Text>
          </View>
        }
      />

      {/* Nút Xóa (Bottom Bar) */}
      {isEditMode && selectedIds.length > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Xóa ({selectedIds.length}) món</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Nút Floating Add: Chuyển qua trang SearchScan để thêm món mới (Chỉ hiện khi KHÔNG ở Edit Mode) */}
      {!isEditMode && (
        <TouchableOpacity 
          style={styles.floatingAddBtn}
          onPress={() => router.push({ pathname: '/SearchScan', params: { mealType } })}
        >
          <Ionicons name="add" size={28} color="#000" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBtn: { 
    padding: 8 
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  listContent: { 
    padding: 24, 
    paddingBottom: 100 
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  foodDetail: {
    fontSize: 13,
  },
  macroRow: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00E5FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  }
});
