/**
 * @file MacroRings.tsx
 * @description Hiển thị 3 vòng tròn tiến trình cho Carbs, Fat, Protein
 * với giao diện tối phong cách dark-card.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MacroRingItemProps {
  label: string;
  value: number;
  total: number;
  color: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
}

interface MacroRingsProps {
  carbEaten: number;
  carbTarget: number;
  fatEaten: number;
  fatTarget: number;
  proteinEaten: number;
  proteinTarget: number;
}

// ─── Single Ring Item ─────────────────────────────────────────────────────────

const MacroRingItem: React.FC<MacroRingItemProps> = ({
  label,
  value,
  total,
  color,
  trackColor,
  size = 52,
  strokeWidth = 5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 && !isNaN(value) && !isNaN(total) ? Math.min(1, value / total) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.ringItem}>
      {/* SVG Ring */}
      <View style={{ width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* Text */}
      <View style={styles.ringTextBlock}>
        <Text style={styles.ringValue}>
          {value}/{total} g
        </Text>
        <Text style={styles.ringLabel}>{label}</Text>
      </View>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MacroRingsComponent: React.FC<MacroRingsProps> = ({
  carbEaten,
  carbTarget,
  fatEaten,
  fatTarget,
  proteinEaten,
  proteinTarget,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <MacroRingItem
        label="carbs"
        value={Math.round(carbEaten)}
        total={carbTarget || 0}
        color="#22C55E"
        trackColor={colors.iconBg}
        size={52}
        strokeWidth={5}
      />
      <View style={styles.divider} />
      <MacroRingItem
        label="fat"
        value={Math.round(fatEaten)}
        total={fatTarget || 0}
        color="#3B82F6"
        trackColor={colors.iconBg}
        size={52}
        strokeWidth={5}
      />
      <View style={styles.divider} />
      <MacroRingItem
        label="protein"
        value={Math.round(proteinEaten)}
        total={proteinTarget || 0}
        color="#F59E0B"
        trackColor={colors.iconBg}
        size={52}
        strokeWidth={5}
      />
    </View>
  );
};

export const MacroRings = React.memo(MacroRingsComponent);

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.cardBorder,
  },
  ringItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ringTextBlock: {
    flexDirection: 'column',
  },
  ringValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.2,
  },
  ringLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
});
