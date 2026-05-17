/**
 * @file PlanSelector.tsx
 * @description Thẻ chọn chế độ nhịn ăn — thiết kế premium dạng danh sách
 * với icon emoji, tên chế độ, cửa sổ ăn và mô tả ngắn.
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/src/core/theme';
import { useTheme } from '@/src/hooks/useTheme';
import { FASTING_PLANS } from '@/src/core/fastingConstants';

export interface PlanSelectorProps {
  goalHours: number;
  setGoalHours: (hours: number) => void;
}

// Bổ sung emoji cho mỗi chế độ
const PLAN_META: Record<string, { emoji: string; color: string }> = {
  '14-10': { emoji: '🌱', color: '#10B981' },
  '16-8':  { emoji: '⭐', color: '#0ea5e9' },
  '18-6':  { emoji: '🔥', color: '#F59E0B' },
  '20-4':  { emoji: '⚡', color: '#8B5CF6' },
};

export const PlanSelector: React.FC<PlanSelectorProps> = ({ goalHours, setGoalHours }) => {
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [isCustomExpanded, setIsCustomExpanded] = React.useState(false);

  const isStandardPlan = FASTING_PLANS.some(p => p.duration === goalHours);
  const isCustomSelected = !isStandardPlan || isCustomExpanded;

  const handleDecrease = () => {
    if (goalHours > 1) setGoalHours(goalHours - 1);
  };
  const handleIncrease = () => {
    if (goalHours < 23) setGoalHours(goalHours + 1);
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="clock-time-four-outline" size={20} color="#0ea5e9" />
        <Text style={styles.headerTitle}>Chế Độ Nhịn Ăn</Text>
      </View>

      <Text style={styles.headerSubtitle}>
        Chọn lịch trình phù hợp với lối sống của bạn
      </Text>

      {/* Plan List */}
      <View style={styles.planList}>
        {FASTING_PLANS.map((plan, idx) => {
          const isSelected = goalHours === plan.duration && !isCustomExpanded;
          const meta = PLAN_META[plan.id] ?? { emoji: '🕐', color: '#64748B' };

          return (
            <React.Fragment key={plan.id}>
              <TouchableOpacity
                style={[styles.planRow, isSelected && styles.planRowActive]}
                onPress={() => {
                  setIsCustomExpanded(false);
                  setGoalHours(plan.duration);
                }}
                activeOpacity={0.7}
              >
                {/* Left: Emoji Badge */}
                <View style={[styles.emojiBadge, { backgroundColor: meta.color + '20' }]}>
                  <Text style={styles.emoji}>{meta.emoji}</Text>
                </View>

                {/* Center: Plan Info */}
                <View style={styles.planInfo}>
                  <View style={styles.planNameRow}>
                    <Text style={[styles.planName, isSelected && { color: meta.color }]}>
                      {plan.name}
                    </Text>
                    {isSelected && (
                      <View style={[styles.badge, { backgroundColor: meta.color + '20' }]}>
                        <Text style={[styles.badgeText, { color: meta.color }]}>Đang chọn</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.planTagline}>{plan.tagline}</Text>
                  <View style={styles.windowRow}>
                    <View style={styles.windowChip}>
                      <MaterialCommunityIcons name="timer-sand" size={11} color={colors.textSecondary} />
                      <Text style={styles.windowText}>{plan.duration}g nhịn</Text>
                    </View>
                    <View style={styles.windowChip}>
                      <MaterialCommunityIcons name="food-fork-drink" size={11} color={colors.textSecondary} />
                      <Text style={styles.windowText}>{plan.eating}g ăn</Text>
                    </View>
                  </View>
                </View>

                {/* Right: Radio */}
                <View style={[styles.radio, isSelected && { borderColor: meta.color }]}>
                  {isSelected && <View style={[styles.radioFill, { backgroundColor: meta.color }]} />}
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
            </React.Fragment>
          );
        })}

        {/* Custom Plan Option */}
        <TouchableOpacity
          style={[styles.planRow, isCustomSelected && styles.planRowActive]}
          onPress={() => setIsCustomExpanded(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.emojiBadge, { backgroundColor: '#db277720' }]}>
            <Text style={styles.emoji}>⚙️</Text>
          </View>
          
          <View style={styles.planInfo}>
            <View style={styles.planNameRow}>
              <Text style={[styles.planName, isCustomSelected && { color: '#db2777' }]}>Tùy chỉnh</Text>
              {isCustomSelected && (
                <View style={[styles.badge, { backgroundColor: '#db277720' }]}>
                  <Text style={[styles.badgeText, { color: '#db2777' }]}>Đang chọn</Text>
                </View>
              )}
            </View>
            <Text style={styles.planTagline}>Tự thiết lập thời gian nhịn ăn</Text>
          </View>
          
          <View style={[styles.radio, isCustomSelected && { borderColor: '#db2777' }]}>
            {isCustomSelected && <View style={[styles.radioFill, { backgroundColor: '#db2777' }]} />}
          </View>
        </TouchableOpacity>
        
        {/* Expanded Custom Controls */}
        {isCustomSelected && (
          <View style={styles.customControls}>
             <Text style={styles.customLabel}>Nhịn ăn: {goalHours} giờ</Text>
             <View style={styles.customStepper}>
                <TouchableOpacity style={styles.stepBtn} onPress={handleDecrease}>
                   <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.stepValue}>{goalHours}g</Text>
                <TouchableOpacity style={styles.stepBtn} onPress={handleIncrease}>
                   <MaterialCommunityIcons name="plus" size={20} color={colors.text} />
                </TouchableOpacity>
             </View>
             <Text style={styles.customSubLabel}>Thời gian ăn uống sẽ là {24 - goalHours} giờ</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '400',
    marginBottom: 18,
    marginTop: 2,
  },
  planList: {
    gap: 0,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  planRowActive: {
    backgroundColor: colors.surface,
    borderColor: colors.cardBorder,
  },
  emojiBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 22,
  },
  planInfo: {
    flex: 1,
    gap: 3,
  },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  planTagline: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  windowRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  windowChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.background,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  windowText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    opacity: 0.5,
    marginHorizontal: 12,
  },
  customControls: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#db277730',
  },
  customLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  customStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 8,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  stepValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#db2777',
    minWidth: 40,
    textAlign: 'center',
  },
  customSubLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
});
