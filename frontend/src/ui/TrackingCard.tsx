/**
 * @file TrackingCard.tsx
 * @description Component dùng chung (Organism) cho thẻ theo dõi trên Dashboard.
 * Thiết kế hiện đại theo chuẩn Fitness App quốc tế, hỗ trợ Dark Mode.
 * Dùng cho: Thẻ Nước (💧), Thẻ Cân nặng (⚖️), và các mục mở rộng tương lai.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from './core/ProgressBar';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

interface TrackingCardProps {
  /** Emoji icon hiển thị bên trái (ví dụ: 💧, ⚖️) */
  emoji: string;
  /** Màu nhấn chính cho icon circle và nút + */
  accentColor: string;
  /** Tiêu đề chính (chữ đậm) */
  title: string;
  /** Dòng phụ hiển thị giá trị (ví dụ: "1500 / 2000 ml") */
  subtitle: string;
  /** Trạng thái loading — hiển thị skeleton thay vì giá trị */
  isLoading?: boolean;
  /** Tỷ lệ tiến trình 0-1 (hiển thị progress bar nếu có) */
  progress?: number;
  /** Thông tin bổ sung dòng 3 (ví dụ: "↓ 0.5 kg so với ban đầu") */
  extraInfo?: string;
  /** Màu cho extraInfo */
  extraInfoColor?: string;
  /** Callback khi bấm nút + */
  onAddPress: () => void;
}

const TrackingCardComponent: React.FC<TrackingCardProps> = ({
  emoji,
  accentColor,
  title,
  subtitle,
  isLoading = false,
  progress,
  extraInfo,
  extraInfoColor,
  onAddPress,
}) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* ── Icon Circle ─────────────────────────────────────────── */}
        <View style={[styles.iconCircle, { backgroundColor: accentColor + '18' }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        {/* ── Content ─────────────────────────────────────────────── */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} style={{ marginLeft: 4 }} />
          </View>

          {isLoading ? (
            <View style={styles.skeletonContainer}>
              <View style={[styles.skeletonLine, { width: '70%' }]} />
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>{subtitle}</Text>
              {extraInfo ? (
                <Text style={[styles.extraInfo, extraInfoColor ? { color: extraInfoColor } : null]}>
                  {extraInfo}
                </Text>
              ) : null}
            </>
          )}
        </View>

        {/* ── Add Button ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: accentColor }]}
          onPress={onAddPress}
          activeOpacity={0.75}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Progress Bar (chỉ cho thẻ có progress, ví dụ: Nước) ───── */}
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          {isLoading ? (
            <View style={styles.skeletonProgress} />
          ) : (
            <ProgressBar
              progress={Math.min(progress, 1)}
              fillColor={accentColor}
              height={10}
            />
          )}
        </View>
      )}
    </View>
  );
};

export const TrackingCard = React.memo(TrackingCardComponent);

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  extraInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  progressContainer: {
    marginTop: 14,
    paddingHorizontal: 2,
  },
  // ── Skeleton Loading ──
  skeletonContainer: {
    marginTop: 2,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.surface,
  },
  skeletonProgress: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surface,
    width: '100%',
  },
});
