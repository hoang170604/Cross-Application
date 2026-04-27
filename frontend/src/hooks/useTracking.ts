import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '@/src/store/useAppStore';
import { getLocalToday } from '@/src/core/dateFormatter';

/**
 * Hook đóng gói logic liên quan đến Tracking (Nước, Cân nặng, Hoạt động...)
 * Thay vì để UI Component tự gọi API, hook này sẽ tự động fetch data khi màn hình focus.
 */
export function useTracking() {
  const { 
    waterIntake, 
    waterTarget,
    latestWeight, 
    activityCalories,
    isWaterLoading,
    isWeightLoading,
    fetchDiaryFromServer, 
    logWater,
    logWeight
  } = useAppStore();

  // Tự động fetch toàn bộ dữ liệu nhật ký của ngày hôm nay mỗi khi màn hình hiển thị
  useFocusEffect(
    useCallback(() => {
      fetchDiaryFromServer(getLocalToday());
    }, [fetchDiaryFromServer])
  );

  return {
    waterIntake,
    waterTarget,
    latestWeight,
    activityCalories,
    isWaterLoading,
    isWeightLoading,
    logWater,
    logWeight
  };
}
