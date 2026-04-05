/**
 * @file WeightProgressCard.tsx
 * @description Sinh vật (Organism) thẻ tiến độ cân nặng.
 * Hiển thị cân nặng hiện tại, mục tiêu, mức thay đổi và thanh tiến trình.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../atoms/ProgressBar';

interface WeightProgressCardProps {
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  goal: string;
}

export const WeightProgressCard: React.FC<WeightProgressCardProps> = ({
  currentWeight,
  startWeight,
  targetWeight,
  goal
}) => {
  const isLose = goal === 'lose_weight' || goal === 'lose';
  const isGain = goal === 'gain_muscle' || goal === 'gain';
  
  let progress = 0;
  if (startWeight !== targetWeight) {
    if (isLose) {
      progress = Math.max(0, Math.min(100, ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100));
    } else if (isGain) {
      progress = Math.max(0, Math.min(100, ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100));
    } else {
      progress = 100;
    }
  } else {
    progress = 100;
  }

  const diff = currentWeight - startWeight;
  const diffPrefix = isGain ? '+' : '-';
  const displayDiff = Math.abs(diff).toFixed(1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tiến độ Cân nặng</Text>
      <View style={styles.header}>
        <View>
          <View style={styles.currentWeightRow}>
            <Text style={styles.currentValue}>{currentWeight.toFixed(1)}</Text>
            <Text style={styles.unit}>kg</Text>
          </View>
          <Text style={[styles.diffText, { color: '#00C48C' }]}>
            {diffPrefix}{displayDiff} kg kể từ khi bắt đầu
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <ProgressBar progress={progress / 100} fillColor="#00C48C" height={10} />
        <View style={styles.labelRow}>
          <Text style={styles.label}>Bắt đầu: {startWeight.toFixed(1)} kg</Text>
          <Text style={styles.label}>Mục tiêu: {targetWeight.toFixed(1)} kg</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontWeight: '800',
    marginBottom: 16,
    fontSize: 16,
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: 20,
  },
  currentWeightRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
  },
  unit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 4,
  },
  diffText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  progressSection: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
