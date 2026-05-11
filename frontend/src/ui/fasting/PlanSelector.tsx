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
          const isSelected = goalHours === plan.duration;
          const meta = PLAN_META[plan.id] ?? { emoji: '🕐', color: '#64748B' };
          const isLast = idx === FASTING_PLANS.length - 1;

          return (
            <React.Fragment key={plan.id}>
              <TouchableOpacity
                style={[styles.planRow, isSelected && styles.planRowActive]}
                onPress={() => setGoalHours(plan.duration)}
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

              {!isLast && <View style={styles.divider} />}
            </React.Fragment>
          );
        })}
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
});
