import { useState, useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAppStore } from '@/src/store/useAppStore';
import { getActivitiesByDate, insertActivity, deleteActivity as deleteFromSqlite } from '@/src/db/activityDb';
import { getLocalToday } from '../core/dateFormatter';

/**
 * Hook đóng gói logic liên quan đến Hoạt động thể chất (Activity Business Logic).
 * Tuân thủ chuẩn "Custom Hook Pattern" tích hợp SQLite.
 */
export function useActivity() {
  const { 
    loggedActivities,
    activityTypes,
    addLoggedActivity, 
    removeLoggedActivity, 
    fetchActivityTypes 
  } = useAppStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Đồng bộ từ SQLite vào Store khi khởi tạo hoặc khi ngày thay đổi
  useEffect(() => {
    const loadLocalData = async () => {
      const today = getLocalToday();
      const localData = await getActivitiesByDate(today);
      // Cập nhật Store từ SQLite (để giao diện đồng bộ)
      useAppStore.setState({ loggedActivities: localData });
    };

    loadLocalData();
    fetchActivityTypes();
  }, [fetchActivityTypes]);

  const totalBurned = useMemo(() => 
    loggedActivities.reduce((sum: number, a: any) => sum + (a.caloriesBurned ?? a.calories_burned ?? 0), 0),
  [loggedActivities]);

  const handleSelectActivity = useCallback(async (activity: any, minutes: number) => {
    const cals = Math.round(activity.caloriesPerMin * minutes);
    const today = getLocalToday();
    
    // 1. Lưu vào SQLite trước (Offline-first)
    await insertActivity({
      activity_type: activity.id,
      minutes,
      calories_burned: cals,
      date: today,
      synced: 0
    });

    // 2. Cập nhật Store & Sync Server (qua action cũ)
    addLoggedActivity({ id: activity.id, minutes, caloriesBurned: cals });
    
    setEditingItem(null);
    setModalVisible(false);
  }, [addLoggedActivity]);

  const handleEditActivity = useCallback((item: any) => {
    setEditingItem(item);
    setModalVisible(true);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingItem(null);
  }, []);

  const handleDeleteActivity = useCallback((item: any) => {
    const displayName = item.activity_type || item.id || 'hoạt động';
    const cals = item.caloriesBurned ?? item.calories_burned ?? 0;
    const itemUid = item.uid || item.id;

    Alert.alert(
      'Xóa hoạt động',
      `Xóa "${displayName}" khỏi danh sách?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            // 1. Xóa khỏi SQLite (nếu có local numeric ID)
            if (item.id && typeof item.id === 'number') {
              await deleteFromSqlite(item.id);
            }
            // 2. Xóa khỏi Store + sync backend
            removeLoggedActivity(itemUid, cals);
          },
        },
      ]
    );
  }, [removeLoggedActivity]);

  return {
    activities: loggedActivities,
    activityTypes,
    totalBurned,
    modalVisible,
    editingItem,
    handleSelectActivity,
    handleEditActivity,
    handleDeleteActivity,
    openAddModal,
    closeModal,
    removeLoggedActivity
  };
}
