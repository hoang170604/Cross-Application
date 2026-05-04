import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppStore } from '@/src/store/useAppStore';

/**
 * Hook đóng gói logic liên quan đến Hoạt động thể chất (Activity Business Logic).
 * Tuân thủ chuẩn "Custom Hook Pattern".
 */
export function useActivity() {
  const { 
    loggedActivities, 
    addLoggedActivity, 
    updateLoggedActivity,
    removeLoggedActivity, 
    fetchActivities,
    fetchActivityTypes
  } = useAppStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchActivities();
    fetchActivityTypes();
  }, [fetchActivities, fetchActivityTypes]);

  const totalBurned = useMemo(() => 
    loggedActivities.reduce((sum: number, a: any) => sum + (a.caloriesBurned || 0), 0),
  [loggedActivities]);

  const handleSelectActivity = useCallback((activity: any, minutes: number) => {
    const cals = Math.round(activity.caloriesPerMin * minutes);
    
    if (editingItem) {
      updateLoggedActivity(editingItem.uid, {
        id: activity.id,
        minutes,
        caloriesBurned: cals
      });
    } else {
      addLoggedActivity({ id: activity.id, minutes, caloriesBurned: cals });
    }
    
    setEditingItem(null);
    setModalVisible(false);
  }, [addLoggedActivity, updateLoggedActivity, editingItem]);

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

  return {
    activities: loggedActivities,
    totalBurned,
    modalVisible,
    editingItem,
    handleSelectActivity,
    handleEditActivity,
    openAddModal,
    closeModal,
    removeLoggedActivity
  };
}
