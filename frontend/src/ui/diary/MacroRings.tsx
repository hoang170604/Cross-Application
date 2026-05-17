
/**
 * @file MacroRings.tsx
 * @description Hiển thị 3 thanh tiến trình cho Tinh bột, Chất béo, Đạm
 * trên cùng một hàng ngang.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MacroBarProps {
  label: string;
  consumed: number;
  goal: number;
  color: string;
  trackColor: string;
}

interface MacroRingsProps {
  carbEaten: number;
  carbTarget: number;
  fatEaten: number;
  fatTarget: number;
  proteinEaten: number;
  proteinTarget: number;
}

// ─── Single Bar Item ──────────────────────────────────────────────────────────

const MacroBar: React.FC<MacroBarProps> = ({
  label,
  consumed,
  goal,
  color,
  trackColor,
}) => {
  const progress = goal > 0 && !isNaN(consumed) && !isNaN(goal) ? Math.min(1, consumed / goal) : 0;
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.barItem}>
      <Text style={styles.barLabel}>{label}</Text>
      
      {/* Progress Bar Container */}
      <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
        <View 
          style={[
            styles.barFill, 
            { 
              backgroundColor: color, 
              width: `${progress * 100}%`,
            }
          ]} 
        />
      </View>

      <Text style={styles.barValue}>{consumed}/{goal}g</Text>
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
      <MacroBar
        label="Tinh bột"
        consumed={Math.round(carbEaten)}
        goal={carbTarget || 0}
        color="#3B82F6" 
        trackColor={colors.isDark ? '#2D3748' : '#EDF2F7'}
      />
      <View style={styles.divider} />
      <MacroBar
        label="Chất béo"
        consumed={Math.round(fatEaten)}
        goal={fatTarget || 0}
        color="#F59E0B" 
        trackColor={colors.isDark ? '#2D3748' : '#EDF2F7'}
      />
      <View style={styles.divider} />
      <MacroBar
        label="Đạm"
        consumed={Math.round(proteinEaten)}
        goal={proteinTarget || 0}
        color="#10B981" 
        trackColor={colors.isDark ? '#2D3748' : '#EDF2F7'}
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.cardBorder,
    marginHorizontal: 2,
    opacity: 0.5,
  },
});
