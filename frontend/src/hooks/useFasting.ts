/**
 * @file useFasting.ts
 * @description Hook quản lý logic nghiệp vụ về Nhịn ăn gián đoạn (Intermittent Fasting).
 * Xử lý các trạng thái bắt đầu/kết thúc nhịn ăn và chia tách dữ liệu theo ngày.
 */

import { useCallback } from 'react';
import { UserProfile } from '@/src/types';
import { splitFastingSession } from '@/src/utils/fastingLogic';

/**
 * Hook tùy chỉnh để thực hiện các hành động nhịn ăn trên State.
 * 
 * @param {UserProfile} userProfile - Trạng thái hồ sơ hiện tại.
 * @param {React.Dispatch<React.SetStateAction<UserProfile>>} setUserProfile - Hàm cập nhật state profile.
 */
export function useFasting(
  userProfile: UserProfile,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
) {
  /** Chuyển sang trạng thái nhịn ăn */
  const startFasting = useCallback((goal: number) => {
    setUserProfile(prev => ({
      ...prev,
      isFasting: true,
      fastingState: 'FASTING',
      fastingStartTime: Date.now(),
      fastingGoal: goal
    }));
  }, [setUserProfile]);

  /** Chuyển sang trạng thái ăn */
  const startEating = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      isFasting: true,
      fastingState: 'EATING',
      fastingStartTime: Date.now()
    }));
  }, [setUserProfile]);

  /** Kết thúc phiên nhịn ăn và lưu vào lịch sử (có xử lý tách ngày) */
  const endFasting = useCallback(() => {
    setUserProfile(prev => {
      const now = Date.now();
      const st = prev.fastingStartTime || now;
      const history = prev.fastingHistory || [];
      
      // Áp dụng thuật toán Bucketing từ utils
      const newHistory = splitFastingSession(st, now, history);

      return {
        ...prev,
        isFasting: true,
        fastingState: 'EATING',
        fastingStartTime: now,
        fastingHistory: newHistory
      };
    });
  }, [setUserProfile]);

  /** Dừng hoàn toàn vòng lặp fasting */
  const stopFastingLoop = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      isFasting: false,
      fastingState: 'FASTING',
      fastingStartTime: null
    }));
  }, [setUserProfile]);

  /** Thiết lập mục tiêu nhịn ăn mới */
  const setFastingGoal = useCallback((goal: number) => {
    setUserProfile(prev => ({
      ...prev,
      fastingGoal: goal
    }));
  }, [setUserProfile]);

  return {
    startFasting,
    startEating,
    endFasting,
    stopFastingLoop,
    setFastingGoal
  };
}
