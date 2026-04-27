/**
 * @file TrackingSection.tsx
 * @description Organism gom nhóm các thẻ Theo dõi (Nước & Cân nặng).
 * Đọc dữ liệu từ Zustand store và gọi InputModal khi bấm nút +.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrackingCard } from './TrackingCard';
import { InputModal } from './InputModal';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

export const TrackingSection: React.FC = () => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  // Store data
  const {
    waterIntake,
    waterTarget,
    latestWeight,
    isWaterLoading,
    isWeightLoading,
    logWater,
    logWeight,
  } = useAppStore();

  // Local state cho modals
  const [weightModalVisible, setWeightModalVisible] = useState(false);

  // Xử lý submit

  const handleWeightSubmit = async (value: number) => {
    await logWeight(value);
    setWeightModalVisible(false);
  };

  const weightDisplay = latestWeight ? `${latestWeight.toFixed(1)} kg` : '-- kg';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Theo dõi</Text>
      </View>

      {/* ── Thẻ Nước ────────────────────────────────────────────── */}
      <TrackingCard
        emoji="💧"
        accentColor="#3B82F6"
        title="Uống nước"
        subtitle={`${waterIntake} / ${waterTarget} ml`}
        progress={waterTarget > 0 ? waterIntake / waterTarget : 0}
        isLoading={isWaterLoading}
        onAddPress={() => logWater(200)}
      />

      {/* ── Thẻ Cân nặng ────────────────────────────────────────── */}
      <TrackingCard
        emoji="⚖️"
        accentColor="#8B5CF6"
        title="Cân nặng"
        subtitle={`Hiện tại: ${weightDisplay}`}
        isLoading={isWeightLoading}
        onAddPress={() => setWeightModalVisible(true)}
      />

      {/* ── Modals ──────────────────────────────────────────────── */}

      <InputModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        onSubmit={handleWeightSubmit}
        title="Cập nhật cân nặng"
        subtitle={new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date())}
        unit="kg"
        defaultValue={latestWeight ? String(latestWeight) : ''}
        accentColor="#8B5CF6"
        isSubmitting={isWeightLoading}
        keyboardType="decimal-pad"
      />
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
});
