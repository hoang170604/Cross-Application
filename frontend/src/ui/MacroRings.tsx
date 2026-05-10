
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

interface MacroCircleProps {
  label: string;
  consumed: number;
  goal: number;
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

const MacroCircle: React.FC<MacroCircleProps> = ({
  label,
  consumed,
  goal,
  color,
  trackColor,
  size = 68,
  strokeWidth = 7,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = goal > 0 && !isNaN(consumed) && !isNaN(goal) ? Math.min(1, consumed / goal) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.ringItem}>
      {/* SVG Ring with Inner Text */}
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
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
      </View>

      {/* Label and Total Goal */}
      <View style={styles.ringTextBlock}>
        <Text style={styles.ringLabel}>{label}</Text>
        <Text style={styles.ringCombinedValue}>{consumed}/{goal} g</Text>
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
      <MacroCircle
        label="Carbs"
        consumed={Math.round(carbEaten)}
        goal={carbTarget || 0}
        color="#3B82F6" // Premium Blue for Carbs
        trackColor={colors.iconBg}
      />
      <View style={styles.divider} />
      <MacroCircle
        label="Fat"
        consumed={Math.round(fatEaten)}
        goal={fatTarget || 0}
        color="#F59E0B" // Vibrant Orange for Fat
        trackColor={colors.iconBg}
      />
      <View style={styles.divider} />
      <MacroCircle
        label="Protein"
        consumed={Math.round(proteinEaten)}
        goal={proteinTarget || 0}
        color="#10B981" // Emerald Green for Protein
        trackColor={colors.iconBg}
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
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow || '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: colors.cardBorder,
    opacity: 0.6,
  },
  ringItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTextBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  ringLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'lowercase',
    letterSpacing: 0.5,
  },
  ringCombinedValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
});
