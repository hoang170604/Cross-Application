/**
 * @file TrackingSection.tsx
 * @description Redesigned tracking section with Water Tracker (glass icons),
 * Measurements (Weight), matching the reference dark-card fitness app design.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputModal } from './InputModal';
import { useTracking } from '@/src/hooks';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GLASS_SIZE_ML = 250; // Each glass = 250ml

// ─── Water Glass Icon ──────────────────────────────────────────────────────────
const WaterGlass: React.FC<{
  filled: boolean;
  onPress?: () => void;
  size?: number;
}> = ({ filled, onPress, size = 40 }) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ marginRight: 6, marginBottom: 6 }}>
        <View style={[glassStyles.glass, { width: size, height: size * 1.15 }]}>
          {/* Glass body */}
          <View style={[
            glassStyles.glassBody,
            { backgroundColor: filled ? '#3B9AE8' : '#5A6B80' },
          ]}>
            {/* Water level */}
            {filled && (
              <View style={glassStyles.waterHighlight} />
            )}
          </View>
          {/* Glass rim */}
          <View style={[
            glassStyles.glassRim,
            { borderColor: filled ? '#60B5F5' : '#6B7B8D' },
          ]} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ marginRight: 6, marginBottom: 6 }}>
      <View style={[glassStyles.glass, { width: size, height: size * 1.15 }]}>
        <View style={[
          glassStyles.glassBody,
          { backgroundColor: filled ? '#3B9AE8' : '#5A6B80' },
        ]}>
          {filled && <View style={glassStyles.waterHighlight} />}
        </View>
        <View style={[
          glassStyles.glassRim,
          { borderColor: filled ? '#60B5F5' : '#6B7B8D' },
        ]} />
      </View>
    </View>
  );
};

const glassStyles = StyleSheet.create({
  glass: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  glassBody: {
    width: '80%',
    height: '85%',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    overflow: 'hidden',
  },
  waterHighlight: {
    position: 'absolute',
    left: 2,
    top: '15%',
    width: 4,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
  },
  glassRim: {
    position: 'absolute',
    top: 0,
    width: '90%',
    height: 3,
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

// ─── Add Glass Button ──────────────────────────────────────────────────────────
const AddGlassButton: React.FC<{ onPress: () => void; size?: number }> = ({ onPress, size = 40 }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[addBtnStyles.container, { width: size, height: size * 1.15 }]}
  >
    <Ionicons name="add" size={20} color="#00C48C" />
  </TouchableOpacity>
);

const addBtnStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#00C48C',
    borderStyle: 'dashed',
    marginRight: 6,
    marginBottom: 6,
  },
});

// ─── Main Component ────────────────────────────────────────────────────────────

export const TrackingSection: React.FC = () => {
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const {
    waterIntake,
    waterTarget,
    latestWeight,
    isWaterLoading,
    isWeightLoading,
    logWater,
    logWeight,
  } = useTracking();

  const [weightModalVisible, setWeightModalVisible] = useState(false);

  // ── Water calculations ──
  const totalGlasses = Math.max(Math.ceil(waterTarget / GLASS_SIZE_ML), 8);
  const filledGlasses = Math.floor(waterIntake / GLASS_SIZE_ML);
  const waterLiters = (waterIntake / 1000).toFixed(2).replace('.', ',');
  const goalLiters = (waterTarget / 1000).toFixed(2).replace('.', ',');

  // ── Weight ──
  const weightDisplay = latestWeight ? latestWeight.toFixed(1).replace('.', ',') : '--';

  const handleAddGlass = async () => {
    await logWater(GLASS_SIZE_ML);
  };

  const handleWeightSubmit = async (value: number) => {
    await logWeight(value);
    setWeightModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* ━━━━━ WATER TRACKER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Text style={styles.sectionTitle}>Theo dõi Nước uống</Text>
      <View style={styles.card}>
        {/* Title & Goal */}
        <Text style={styles.cardTitle}>Nước</Text>
        <Text style={styles.cardSubtitle}>Mục tiêu: {goalLiters} L</Text>

        {/* Current intake - large display */}
        <Text style={styles.waterAmount}>{waterLiters} l</Text>

        {/* Glass grid */}
        <View style={styles.glassGrid}>
          {Array.from({ length: totalGlasses }).map((_, i) => {
            if (i === filledGlasses) {
              // Next glass to fill = Add button
              return <AddGlassButton key={`add-${i}`} onPress={handleAddGlass} />;
            }
            return (
              <WaterGlass
                key={`glass-${i}`}
                filled={i < filledGlasses}
                onPress={i < filledGlasses ? undefined : handleAddGlass}
              />
            );
          })}
        </View>
      </View>

      {/* ━━━━━ MEASUREMENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chỉ số cơ thể</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.moreLink}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cân nặng</Text>

        <View style={styles.weightRow}>
          <TouchableOpacity
            style={styles.weightBtn}
            onPress={() => {
              if (latestWeight && latestWeight > 0.5) {
                logWeight(Math.round((latestWeight - 0.1) * 10) / 10);
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="remove-circle-outline" size={36} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.weightValue}>{weightDisplay} kg</Text>

          <TouchableOpacity
            style={styles.weightBtn}
            onPress={() => setWeightModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={36} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Weight Modal ──────────────────────────────────────────────── */}
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  moreLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00C48C',
  },

  // Dark card
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },

  // Water amount
  waterAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -1,
  },

  // Glass grid
  glassGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 4,
  },

  // Weight
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 4,
  },
  weightBtn: {
    padding: 4,
  },
  weightValue: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.text,
    minWidth: 140,
    textAlign: 'center',
    letterSpacing: -1,
  },
});
