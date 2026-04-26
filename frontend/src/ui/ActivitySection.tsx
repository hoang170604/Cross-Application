/**
 * @file ActivitySection.tsx
 * @description Organism hiển thị danh sách hoạt động thể chất đã chọn
 * dưới dạng cuộn ngang, kèm nút (+) để mở AddActivityModal.
 *
 * Cách tích hợp vào màn hình cha:
 *   import { ActivitySection } from '@/src/ui/ActivitySection';
 *   <ActivitySection />
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AddActivityModal, Activity } from './AddActivityModal';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoggedActivity extends Activity {
  /** ID duy nhất để xóa đúng mục */
  uid: string;
  /** Số phút tập */
  minutes: number;
  /** Calo đã đốt = caloriesPerMin × minutes */
  caloriesBurned: number;
}

// ─── Activity Chip (item trong ScrollView ngang) ──────────────────────────────

const ActivityChip: React.FC<{ item: LoggedActivity; onDelete: (uid: string, cals: number) => void }> = ({ item, onDelete }) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.chip}>
      <View style={[styles.chipIcon, { backgroundColor: item.bgColor }]}>
        <MaterialCommunityIcons name={item.icon} size={18} color={item.iconColor} />
      </View>
      <View style={styles.chipText}>
        <Text style={styles.chipName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.chipCals}>{item.minutes} ph · {item.caloriesBurned} kcal</Text>
      </View>
      {/* Nút X xóa */}
      <TouchableOpacity
        onPress={() => onDelete(item.uid, item.caloriesBurned)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.chipDelete}
        activeOpacity={0.6}
      >
        <MaterialCommunityIcons name="close-circle" size={18} color={colors.iconColor} />
      </TouchableOpacity>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ActivitySectionComponent: React.FC = () => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  // ── State: bật/tắt Modal ──────────────────────────────────────────────────────
  const [modalVisible, setModalVisible] = useState(false);

  // ── Store ────────────────────────────────────────────────────────────
  const { loggedActivities: activities, addLoggedActivity, removeLoggedActivity, resetActivityIfNewDay } = useAppStore();

  useEffect(() => {
    resetActivityIfNewDay();
    // Self-healing: Nếu mảng rỗng nhưng tổng calo vẫn còn (do cache cũ), thì reset tổng calo về 0
    const state = useAppStore.getState();
    if (state.loggedActivities.length === 0 && state.activityCalories > 0) {
      useAppStore.setState({ activityCalories: 0 });
    }
  }, [resetActivityIfNewDay]);

  // ── Handler: nhận bài tập từ Modal ───────────────────────────────────
  const handleSelectActivity = useCallback((activity: Activity, minutes: number) => {
    const cals = Math.round(activity.caloriesPerMin * minutes);
    const uid = `${activity.id}_${Date.now()}`;
    addLoggedActivity({ ...activity, uid, minutes, caloriesBurned: cals });
  }, [addLoggedActivity]);

  // ── Handler: xóa hoạt động ──────────────────────────────────────────
  const handleDelete = useCallback((uid: string, cals: number) => {
    removeLoggedActivity(uid, cals);
  }, [removeLoggedActivity]);

  // ── Tổng calo đốt cháy ────────────────────────────────────────────────────
  const totalBurned = activities.reduce((sum: any, a: any) => sum + a.caloriesBurned, 0);

  return (
    <>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.headerIconCircle}>
              <MaterialCommunityIcons name="fire" size={18} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.title}>Hoạt động</Text>
              {totalBurned > 0 && (
                <Text style={styles.subtitle}>Đốt cháy: {totalBurned} kcal</Text>
              )}
            </View>
          </View>

          {/* Nút (+) mở Modal */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.75}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Danh sách ngang hoặc placeholder */}
        {activities.length === 0 ? (
          <TouchableOpacity 
            style={styles.emptyState} 
            activeOpacity={0.6}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="run" size={28} color="#CBD5E1" />
            <Text style={styles.emptyText}>Chưa có hoạt động nào{'\n'}Nhấn vào đây để thêm</Text>
          </TouchableOpacity>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {activities.map((item) => (
              <ActivityChip
                key={item.uid}
                item={item}
                onDelete={handleDelete}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* ─── Modal chọn bài tập ──────────────────────────────────────── */}
      <AddActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectActivity={handleSelectActivity}
      />
    </>
  );
};

export const ActivitySection = React.memo(ActivitySectionComponent);

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.danger + '20', // Opacity 20%
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },

  // Nút +
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Scroll ngang
  scrollContent: {
    gap: 10,
    paddingVertical: 2,
  },

  // Chip
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    flexDirection: 'column',
  },
  chipName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  chipCals: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  chipDelete: {
    marginLeft: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
