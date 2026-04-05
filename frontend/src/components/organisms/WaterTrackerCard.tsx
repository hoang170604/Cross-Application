/**
 * @file WaterTrackerCard.tsx
 * @description Sinh vật (Organism) thẻ theo dõi lượng nước uống.
 * Bao gồm tiêu đề, thanh tiến trình và nút thêm nhanh 200ml.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../atoms/ProgressBar';

interface WaterTrackerCardProps {
  /** Lượng nước đã uống (ml) */
  intake: number;
  /** Mục tiêu nước (ml) */
  target: number;
  /** Hàm xử lý khi thêm nước */
  onAddWater: () => void;
}

/**
 * Hiển thị thẻ theo dõi nước uống với thanh tiến trình.
 */
export const WaterTrackerCard: React.FC<WaterTrackerCardProps> = ({
  intake,
  target,
  onAddWater
}) => {
  const cups = Math.floor(intake / 200);
  const targetCups = Math.floor(target / 200);
  const progress = target > 0 ? intake / target : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="water" size={20} color="#3B82F6" />
          </View>
          <View>
            <Text style={styles.title}>Nước uống</Text>
            <Text style={styles.subTitle}>Mục tiêu: {(target / 1000).toFixed(1)} Lít</Text>
          </View>
        </View>
        <View style={styles.statsWrapper}>
          <Text style={styles.statsValue}>{cups} / {targetCups}</Text>
          <Text style={styles.statsUnit}>cốc</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} fillColor="#3B82F6" height={12} />
        </View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={onAddWater}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
    color: '#1E293B',
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  statsWrapper: {
    alignItems: 'flex-end',
  },
  statsValue: {
    fontWeight: '800',
    color: '#3B82F6',
    fontSize: 18,
  },
  statsUnit: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressContainer: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
