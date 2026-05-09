import { useCallback, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '@/src/store/useAppStore';
import { getLocalToday } from '@/src/core/dateFormatter';
import { logWater as logToSqlite, logWeight as logWeightToSqlite } from '@/src/db/trackingDb';

/**
 * Hook đóng gói logic liên quan đến Tracking (Nước, Cân nặng, Hoạt động...)
 * Tuân thủ chuẩn "Custom Hook Pattern" tích hợp SQLite.
 */
export function useTracking() {
  const { 
    waterIntake, 
    waterTarget,
    latestWeight, 
    activityCalories,
    userProfile,
    isWaterLoading,
    isWeightLoading,
    fetchDiaryFromServer, 
    logWater,
    logWeight
  } = useAppStore();

  // Tự động fetch toàn bộ dữ liệu nhật ký của ngày hôm nay mỗi khi màn hình hiển thị
  useFocusEffect(
    useCallback(() => {
      // Trì hoãn việc gọi API (nặng) cho đến khi animation chuyển tab hoàn thành
      const task = InteractionManager.runAfterInteractions(() => {
        fetchDiaryFromServer(getLocalToday());
      });
      return () => task.cancel();
    }, [fetchDiaryFromServer])
  );

  // ─── Water Business Logic ───────────────────────────────────────────
  const waterStats = useMemo(() => {
    const goalGlasses = Math.ceil(waterTarget / 250);
    const filledGlasses = Math.round(waterIntake / 250);
    const totalGlassesToShow = Math.max(goalGlasses, filledGlasses + 1, 8);
    const waterLiters = (waterIntake / 1000).toFixed(2).replace('.', ',');
    const goalLiters = (waterTarget / 1000).toFixed(2).replace('.', ',');
    
    return {
      goalGlasses,
      filledGlasses,
      totalGlassesToShow,
      waterLiters,
      goalLiters,
      isGoalReached: filledGlasses >= goalGlasses && goalGlasses > 0,
      isOverGoal: filledGlasses > goalGlasses,
    };
  }, [waterIntake, waterTarget]);

  const handleWaterPress = useCallback((index: number) => {
    const targetGlasses = index + 1;
    let amountToAdd = 0;

    if (targetGlasses === waterStats.filledGlasses) {
      amountToAdd = -250;
    } else {
      amountToAdd = (targetGlasses - waterStats.filledGlasses) * 250;
    }

    // Chỉ gọi action của Store, Store sẽ lo việc update UI (optimistic) và lưu DB/Sync
    logWater(amountToAdd);
  }, [waterStats.filledGlasses, logWater]);

  const handleAddWater = useCallback(() => {
    logWater(250);
  }, [logWater]);

  // ─── Weight Business Logic ──────────────────────────────────────────
  const weightStats = useMemo(() => {
    // Ưu tiên: Cân nặng vừa log > Cân nặng hiện tại trong profile > Cân nặng khởi tạo > 0
    const displayValue = latestWeight && latestWeight > 0 
      ? latestWeight 
      : (userProfile.currentWeight || userProfile.weight || 0);

    const displayString = displayValue > 0 
      ? displayValue.toFixed(1).replace('.', ',') 
      : '--';

    return {
      displayValue,
      displayString,
    };
  }, [latestWeight, userProfile.currentWeight, userProfile.weight]);

  return {
    // Data
    waterIntake,
    waterTarget,
    activityCalories,
    userProfile,
    isWaterLoading,
    isWeightLoading,
    
    // Computed (Pre-calculated for UI)
    waterStats,
    weightStats,

    // Actions
    handleWaterPress,
    handleAddWater,
    logWeight,
  };
}
