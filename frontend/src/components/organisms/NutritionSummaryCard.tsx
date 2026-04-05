/**
 * @file NutritionSummaryCard.tsx
 * @description Sinh vật (Organism) thẻ tóm tắt dinh dưỡng trong ngày.
 * Hiển thị Calo hiện tại so với TDEE và thanh tiến trình màu sắc động.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../atoms/ProgressBar';

interface NutritionSummaryCardProps {
  consumed: number;
  target: number;
}

export const NutritionSummaryCard: React.FC<NutritionSummaryCardProps> = ({ consumed, target }) => {
  const isOver = consumed > target;
  const progress = target > 0 ? consumed / target : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nạp năng lượng hôm nay</Text>
      
      <View style={styles.valueRow}>
        <Text style={styles.mainValue}>{consumed.toLocaleString()}</Text>
        <Text style={styles.targetValue}>/ {target.toLocaleString()} kcal</Text>
      </View>

      <View style={styles.progressSection}>
        <ProgressBar 
          progress={progress} 
          fillColor={isOver ? '#E11D48' : '#00C48C'} 
          height={14} 
        />
        <Text style={[styles.statusText, { color: isOver ? '#E11D48' : '#64748B' }]}>
          {isOver ? 'Đã vượt mức TDEE!' : `Còn ${Math.max(0, target - consumed).toLocaleString()} kcal`}
        </Text>
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
    marginBottom: 20,
    fontSize: 16,
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  mainValue: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1E293B',
  },
  targetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 8,
  },
  progressSection: {
    width: '100%',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
});
