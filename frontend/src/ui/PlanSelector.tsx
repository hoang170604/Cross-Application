import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeColors } from '@/src/core/theme';
import { useTheme } from '@/src/hooks/useTheme';
import { FASTING_PLANS } from '@/src/core/fastingConstants';

export interface PlanSelectorProps {
  goalHours: number;
  setGoalHours: (hours: number) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({ goalHours, setGoalHours }) => {
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Chế độ nhịn ăn</Text>
      <View style={styles.planGrid}>
        {FASTING_PLANS.map((plan) => {
          const isSelected = goalHours === plan.duration;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planChip, isSelected && styles.planChipActive]}
              onPress={() => setGoalHours(plan.duration)}
              activeOpacity={0.7}
            >
              <Text style={[styles.planChipName, isSelected && styles.planChipNameActive]}>
                {plan.name}
              </Text>
              <Text style={[styles.planChipEating, isSelected && styles.planChipEatingActive]}>
                {plan.eating}g ăn
              </Text>
              {isSelected && (
                <View style={styles.planSelectedDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.planTagline}>
        {FASTING_PLANS.find(p => p.duration === goalHours)?.tagline ?? ''}
      </Text>
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
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16,
  },
  planGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  planChip: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    position: 'relative',
  },
  planChipActive: {
    backgroundColor: '#0ea5e914',
    borderColor: '#0ea5e9',
  },
  planChipName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  planChipNameActive: { color: '#0ea5e9' },
  planChipEating: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
    opacity: 0.7,
  },
  planChipEatingActive: { color: '#0ea5e9', opacity: 1 },
  planSelectedDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0ea5e9',
  },
  planTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
