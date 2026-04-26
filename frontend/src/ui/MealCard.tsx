/**
 * @file MealCard.tsx
 * @description Sinh vật (Organism) thẻ bữa ăn trong danh sách Nhật ký.
 * Bao gồm tên bữa ăn, tổng calo, và danh sách món ăn đã nạp.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem } from '@/src/types';
import { FoodItemRow } from './FoodItemRow';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

interface MealCardProps {
  /** Tên bữa ăn (VD: Bữa sáng, Bữa trưa...) */
  title: string;
  /** Khoảng thời gian truyền thống (VD: 7:00 - 9:00) */
  time: string;
  /** Danh sách món ăn nạp vào */
  items: FoodItem[];
  /** Tổng calo của bữa ăn (kcal) */
  totalCalories: number;
  /** Hàm xử lý khi nhấn "Thêm món" */
  onAddPress: () => void;
}

/**
 * Hiển thị thẻ thông tin bữa ăn chi tiết.
 * Sử dụng React.memo để ngăn re-render khi các thẻ khác trong danh sách thay đổi.
 */
const MealCardComponent: React.FC<MealCardProps> = ({
  title,
  time,
  items,
  totalCalories,
  onAddPress
}) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      {/* Tiêu đề & Tổng calo */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.timeLabel}>{time}</Text>
        </View>
        <View style={styles.calWrapper}>
          <Text style={styles.calText}>{totalCalories.toLocaleString()} <Text style={styles.unitText}>kcal</Text></Text>
          {items.length > 0 && (
            <Text style={styles.itemCount}>{items.length} món</Text>
          )}
        </View>
      </View>

      {/* Danh sách món ăn */}
      {items.length > 0 ? (
        <View style={styles.listContainer}>
          {items.map((item) => (
            <FoodItemRow key={item.id} item={item} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Chưa có món ăn được ghi nhận</Text>
      )}

      {/* Nút thêm nhanh */}
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onAddPress}
        style={styles.addButton}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="add" size={18} color="#00C48C" />
        </View>
        <Text style={styles.addButtonText}>Thêm món ăn</Text>
      </TouchableOpacity>
    </View>
  );
};

export const MealCard = React.memo(MealCardComponent);

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card, 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16,
  },
  title: { 
    fontWeight: '800', 
    fontSize: 18,
    color: colors.text,
  },
  timeLabel: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    marginTop: 4,
    fontWeight: '500',
  },
  calWrapper: { 
    alignItems: 'flex-end',
  },
  calText: { 
    fontWeight: '800', 
    fontSize: 18,
    color: colors.text,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  itemCount: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    marginTop: 4,
    fontWeight: '500',
  },
  listContainer: { 
    marginBottom: 16, 
    gap: 10,
  },
  emptyText: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    fontStyle: 'italic', 
    marginBottom: 20,
    textAlign: 'center',
    paddingVertical: 10,
  },
  addButton: { 
    width: '100%', 
    paddingVertical: 12, 
    backgroundColor: colors.success + '1A', // 10% opacity
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.success + '40', // 25% opacity
  },
  addButtonText: { 
    color: colors.success, 
    fontWeight: '700',
    fontSize: 14,
  },
});
