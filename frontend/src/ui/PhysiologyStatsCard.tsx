/**
 * @file PhysiologyStatsCard.tsx
 * @description Sinh vật (Organism) thẻ hiển thị các chỉ số sinh lý cơ bản.
 * Bao gồm TDEE, BMR và BMI của người dùng.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PhysiologyStatsCardProps {
  tdee: number;
  bmr: number;
  bmi: number;
}

export const PhysiologyStatsCard: React.FC<PhysiologyStatsCardProps> = ({ tdee, bmr, bmi }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Chỉ số Sinh lý</Text>
      <View style={styles.row}>
        <View style={styles.statItem}>
          <Text style={[styles.value, { color: '#10B981' }]}>{tdee}</Text>
          <Text style={styles.label}>TDEE (kcal)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.value, { color: '#F59E0B' }]}>{bmr}</Text>
          <Text style={styles.label}>BMR (kcal)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.value, { color: '#3B82F6' }]}>{bmi}</Text>
          <Text style={styles.label}>BMI</Text>
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
    marginBottom: 20,
    fontSize: 16,
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#F1F5F9',
  },
});
