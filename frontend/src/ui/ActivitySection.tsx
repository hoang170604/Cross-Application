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
import { AddActivityModal, Activity, ACTIVITIES } from './AddActivityModal';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

// ─── Local Activity format ──────────────────────────────────────────────────
interface LocalActivity {
  uid: string;
  id: string;        // activityType (ví dụ: 'running')
  minutes: number;
  caloriesBurned: number;
}

// ─── Activity Item (Vertical Row) ─────────────────────────────────────────────
const ActivityItem: React.FC<{ 
  item: any; 
  onPress: () => void;
}> = ({ item, onPress }) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  
  // Ánh xạ từ activityType sang icon/màu sắc UI
  const uiInfo = ACTIVITIES.find(a => a.id === item.id) || ACTIVITIES[0];

  return (
    <TouchableOpacity 
      style={styles.row} 
      activeOpacity={0.6}
      onPress={onPress}
    >
      {/* Icon Circle (matching MealCard style) */}
      <View style={styles.iconContainer}>
        <View style={[styles.emojiCircle, { backgroundColor: uiInfo.bgColor + '40' }]}>
          <MaterialCommunityIcons name={uiInfo.icon as any} size={20} color={uiInfo.iconColor} />
        </View>
      </View>

      {/* Details (Title & Params) */}
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.activityName}>{uiInfo.name}</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
        </View>
        <Text style={styles.activityStats}>
          {item.minutes} phút · {item.caloriesBurned} kcal
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ActivitySectionComponent: React.FC = () => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  // ── State: bật/tắt Modal & Chỉnh sửa ─────────────────────────────────────────
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // ── Store ────────────────────────────────────────────────────────────
  const { 
    loggedActivities: activities, 
    addLoggedActivity, 
    updateLoggedActivity,
    removeLoggedActivity, 
    fetchActivities,
    fetchActivityTypes
  } = useAppStore();

  useEffect(() => {
    fetchActivities();
    fetchActivityTypes();
  }, [fetchActivities, fetchActivityTypes]);

  // ── Handler: nhận bài tập từ Modal ───────────────────────────────────
  const handleSelectActivity = useCallback((activity: Activity, minutes: number) => {
    const cals = Math.round(activity.caloriesPerMin * minutes);
    
    if (editingItem) {
      // Gọi API update thay vì xóa/thêm mới
      updateLoggedActivity(editingItem.uid, {
        id: activity.id,
        minutes,
        caloriesBurned: cals
      });
    } else {
      addLoggedActivity({ id: activity.id, minutes, caloriesBurned: cals });
    }
    
    setEditingItem(null);
  }, [addLoggedActivity, updateLoggedActivity, editingItem]);


  // ── Handler: bắt đầu chỉnh sửa ────────────────────────────────────────
  const handleEditActivity = useCallback((item: any) => {
    console.log('[ActivitySection] Chỉnh sửa hoạt động:', item.id);
    setEditingItem(item);
    setModalVisible(true);
  }, []);

  // ── Handler: đóng modal ─────────────────────────────────────────────
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setEditingItem(null);
  }, []);

  // ── Tổng calo đốt cháy ────────────────────────────────────────────────────
  const totalBurned = activities.reduce((sum: any, a: any) => sum + (a.caloriesBurned || 0), 0);

  return (
    <View style={styles.container}>
      {/* Header outside the card like MealCard */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hoạt động</Text>
          {/* {totalBurned > 0 && (
            <Text style={styles.headerSubtitle}>Đốt cháy {totalBurned} kcal</Text>
          )} */}
        </View>
        <TouchableOpacity
          style={styles.headerAddButton}
          activeOpacity={0.75}
          onPress={() => {
            setEditingItem(null);
            setModalVisible(true);
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {activities.length === 0 ? (
          <TouchableOpacity 
            style={styles.emptyState} 
            activeOpacity={0.6}
            onPress={() => {
              setEditingItem(null);
              setModalVisible(true);
            }}
          >
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons name="run" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.emptyTextContainer}>
              <Text style={styles.emptyTitle}>Chưa có hoạt động</Text>
              <Text style={styles.emptySubtitle}>Bắt đầu luyện tập ngay hôm nay</Text>
            </View>
            <MaterialCommunityIcons name="plus" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View>
            {activities.map((item: any, index: number) => (
              <React.Fragment key={item.uid || item.id}>
                <ActivityItem
                  item={item}
                  onPress={() => handleEditActivity(item)}
                />
                {index < activities.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>

      {/* ─── Modal chọn bài tập ──────────────────────────────────────── */}
      <AddActivityModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSelectActivity={handleSelectActivity}
        initialActivity={editingItem ? ACTIVITIES.find(a => a.id === editingItem.id) : null}
        initialMinutes={editingItem?.minutes || 30}
      />
    </View>
  );
};

export const ActivitySection = React.memo(ActivitySectionComponent);

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '600',
    marginTop: -2,
  },
  headerAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  activityStats: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 16,
  },
  // Empty State
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
