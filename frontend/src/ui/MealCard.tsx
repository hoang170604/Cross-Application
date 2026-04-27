/**
 * @file MealCard.tsx
 * @description Sinh vật (Organism) thẻ Nutrition chứa tất cả các bữa ăn.
 * Dựa trên thiết kế gom nhóm tất cả các bữa ăn vào một card duy nhất.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { FoodItem, DailyMeals } from '@/src/types';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

interface MealCardProps {
  /** Danh sách các bữa ăn trong ngày */
  dailyMeals?: DailyMeals;
  /** Mục tiêu calo trong ngày để tính tỷ lệ cho các bữa chính */
  targetCalories?: number;
}

const MEALS_CONFIG = [
  { id: 'breakfast', name: 'Bữa sáng', emoji: '🍳', targetRatio: 0 },
  { id: 'lunch', name: 'Bữa trưa', emoji: '🍝', targetRatio: 0.4 }, // 40%
  { id: 'dinner', name: 'Bữa tối', emoji: '🥗', targetRatio: 0.4 }, // 40%
  { id: 'snack', name: 'Đồ ăn vặt', emoji: '🥨', targetRatio: 0 },
];

/**
 * Hiển thị thẻ Nutrition tổng hợp.
 */
const MealCardComponent: React.FC<MealCardProps> = ({
  dailyMeals,
  targetCalories = 2000,
}) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dinh Dưỡng</Text>
        {/* <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.headerMore}>More</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.card}>
        {MEALS_CONFIG.map((meal, index) => {
          const items = dailyMeals?.[meal.id as keyof DailyMeals] || [];
          const consumed = items.reduce((sum, item) => sum + item.calories, 0);
          const target = meal.targetRatio ? Math.round(targetCalories * meal.targetRatio) : 0;
          const isLast = index === MEALS_CONFIG.length - 1;
          
          const foodNames = items.map(i => i.name).join(', ');
          const progress = target > 0 ? Math.min(consumed / target, 1) : 0;

          return (
            <React.Fragment key={meal.id}>
              <View style={styles.row}>
                {/* Icon & Ring */}
                <View style={styles.iconContainer}>
                  {target > 0 && (
                    <Svg width={48} height={48} style={{ position: 'absolute' }}>
                      <Circle
                        cx={24} cy={24} r={22}
                        stroke={colors.cardBorder} strokeWidth={4} fill="none"
                      />
                      <Circle
                        cx={24} cy={24} r={22}
                        stroke="#00E5FF" // cyan accent
                        strokeWidth={4} fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 22}
                        strokeDashoffset={2 * Math.PI * 22 * (1 - progress)}
                        transform="rotate(-90 24 24)"
                      />
                    </Svg>
                  )}
                  <View style={styles.emojiCircle}>
                    <Text style={styles.emoji}>{meal.emoji}</Text>
                  </View>
                </View>

                {/* Details */}
                <TouchableOpacity 
                  style={styles.detailsContainer} 
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: '/SearchScan', params: { mealType: meal.id } })}
                >
                  <View style={styles.titleRow}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.text} style={{ marginLeft: 4 }} />
                  </View>
                  
                  {(target > 0 || consumed > 0) ? (
                    <Text style={styles.caloriesText}>
                      {consumed} {target > 0 ? `/ ${target} ` : ''}kcal
                    </Text>
                  ) : (
                    // Display something or nothing for empty no-target meals
                    <View />
                  )}
                  
                  {foodNames.length > 0 && (
                    <Text style={styles.foodNames} numberOfLines={1}>
                      {foodNames}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Add Button */}
                <TouchableOpacity 
                  style={[
                    styles.addButton, 
                    target > 0 ? styles.addButtonMain : styles.addButtonSecondary
                  ]} 
                  onPress={() => router.push({ pathname: '/SearchScan', params: { mealType: meal.id } })}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="add" 
                    size={22} 
                    color={target > 0 ? colors.background : colors.text} 
                  />
                </TouchableOpacity>
              </View>
              {!isLast && <View style={styles.divider} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export const MealCard = React.memo(MealCardComponent);

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  headerMore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00E5FF',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  caloriesText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  foodNames: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  addButtonMain: {
    backgroundColor: colors.text,
  },
  addButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 16,
  },
});

