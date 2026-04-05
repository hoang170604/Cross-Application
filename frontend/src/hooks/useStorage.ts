/**
 * @file useStorage.ts
 * @description Hook quản lý việc lưu trữ và nạp dữ liệu bền vững (Persistence Layer).
 * Sử dụng AsyncStorage để đồng bộ hóa trạng thái UserProfile giữa các phiên sử dụng.
 */

import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DEFAULT_PROFILE } from '@/src/types';
import { getLocalToday } from '@/src/utils/dateFormatter';

const STORAGE_KEY = '@nutritrack_state';

/**
 * Hook tùy chỉnh để quản lý state UserProfile và lưu trữ vào bộ nhớ.
 * Bao gồm: nạp dữ liệu, tự động lưu (debounce), và theo dõi streak.
 * 
 * @returns { userProfile, setUserProfile, isLoaded }
 */
export function useStorage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Nạp dữ liệu khi khởi động ───────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as UserProfile;
          
          // Logic reset nước hàng ngày
          const todayStr = getLocalToday();
          if (parsed.lastWaterDate !== todayStr) {
            parsed.waterIntake = 0;
            parsed.lastWaterDate = todayStr;
          }

          setUserProfile(parsed);
        }
      } catch (e) {
        console.warn('[NutriTrack] Lỗi khi đọc AsyncStorage:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProfile();
  }, []);

  // ─── Tự động lưu vào bộ nhớ (Debounce 1s) ─────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
      } catch (e) {
        console.warn('[NutriTrack] Lỗi khi ghi AsyncStorage:', e);
      }
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [userProfile, isLoaded]);

  // ─── Theo dõi Streak (Số ngày sử dụng liên tục) ──────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    const todayStr = getLocalToday();
    const today = new Date(todayStr);

    setUserProfile((prev) => {
      const lastStr = prev.lastActiveDate;
      if (!lastStr) return { ...prev, lastActiveDate: todayStr, streakCount: 1 };
      if (todayStr === lastStr) return prev;

      const lastDate = new Date(lastStr);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return { ...prev, lastActiveDate: todayStr, streakCount: (prev.streakCount || 1) + 1 };
      }
      return { ...prev, lastActiveDate: todayStr, streakCount: 1 };
    });
  }, [isLoaded]);

  return { 
    userProfile, 
    setUserProfile, 
    isLoaded 
  };
}
