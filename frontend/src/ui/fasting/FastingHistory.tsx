import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeColors } from '@/src/core/theme';
import { useTheme } from '@/src/hooks/useTheme';
import { FastingHistoryRecord } from '@/src/core/fastingConstants';

export interface FastingHistoryProps {
  history: FastingHistoryRecord[];
  isHistoryLoading: boolean;
  historyError: string | null;
  fetchHistory: () => void;
}

export const FastingHistory: React.FC<FastingHistoryProps> = ({
  history,
  isHistoryLoading,
  historyError,
  fetchHistory,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>Lịch sử nhịn ăn</Text>
        {isHistoryLoading && (
          <ActivityIndicator size="small" color="#0ea5e9" />
        )}
      </View>

      {historyError && !isHistoryLoading && (
        <TouchableOpacity onPress={fetchHistory} activeOpacity={0.7}>
          <Text style={styles.historyError}>{historyError} Nhấn để thử lại.</Text>
        </TouchableOpacity>
      )}

      {isHistoryLoading && history.length === 0 && (
        <View style={{ gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.historySkeleton} />
          ))}
        </View>
      )}

      {!isHistoryLoading && !historyError && history.length === 0 && (
        <View style={styles.historyEmpty}>
          <Text style={styles.historyEmptyIcon}>🕐</Text>
          <Text style={styles.historyEmptyText}>Chưa có phiên nhịn ăn nào.</Text>
          <Text style={styles.historyEmptySubtext}>
            Hoàn thành phiên đầu tiên để xem lịch sử tại đây.
          </Text>
        </View>
      )}

      {history.map((item, index) => {
        const isLast = index === history.length - 1;
        const hrs = Math.floor(item.totalDurationHours);
        const mins = Math.round((item.totalDurationHours - hrs) * 60);
        const durationLabel = hrs > 0 ? `${hrs} giờ ${mins} phút` : `${mins} phút`;
        const dateLabel = (() => {
          const d = new Date(item.startTime);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          if (d.toDateString() === today.toDateString()) return 'Hôm nay';
          if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
          return d.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
        })();

        return (
          <View
            key={item.id}
            style={[styles.historyRow, !isLast && styles.historyRowDivider]}
          >
            <View style={styles.historyDateBadge}>
              <Text style={styles.historyDateText}>
                {dateLabel.split(' ')[0]}
              </Text>
              {dateLabel.includes(' ') && (
                <Text style={styles.historyDateSub}>
                  {dateLabel.split(' ')[1]}
                </Text>
              )}
            </View>

            <View style={styles.historyMeta}>
              <View style={styles.historyPlanBadge}>
                <Text style={styles.historyPlanText}>{item.planName}</Text>
              </View>
              <Text style={styles.historyTimeRange} numberOfLines={1}>
                {new Date(item.startTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit', minute: '2-digit', hour12: false,
                })}
                {' → '}
                {new Date(item.endTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit', minute: '2-digit', hour12: false,
                })}
              </Text>
            </View>

            <Text style={styles.historyDuration}>{durationLabel}</Text>
          </View>
        );
      })}
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
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  historyError: {
    fontSize: 13,
    color: '#f43f5e',
    textAlign: 'center',
    paddingVertical: 12,
  },
  historySkeleton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  historyEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  historyEmptyIcon: { fontSize: 32 },
  historyEmptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  historyEmptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    opacity: 0.7,
    textAlign: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  historyRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  historyDateBadge: {
    width: 44,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 6,
  },
  historyDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
  },
  historyDateSub: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  historyMeta: {
    flex: 1,
    gap: 4,
  },
  historyPlanBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0ea5e918',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#0ea5e930',
  },
  historyPlanText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  historyTimeRange: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  historyDuration: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    minWidth: 52,
    textAlign: 'right',
  },
});
