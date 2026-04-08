/**
 * @file useStorage.ts
 * @description Hook quản lý việc lưu trữ và nạp dữ liệu bền vững (Persistence Layer).
 * Sử dụng AsyncStorage để đồng bộ hóa trạng thái UserProfile giữa các phiên sử dụng.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
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

  // ─── Đăng xuất: xóa AsyncStorage + reset state ─────────────────────────────
  const logout = useCallback(async () => {
    try {
      // Hủy timer save đang chờ để tránh ghi đè lại sau khi xóa
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      // Xóa dữ liệu bền vững
      await AsyncStorage.removeItem(STORAGE_KEY);
      // Reset state trong bộ nhớ về mặc định
      setUserProfile(DEFAULT_PROFILE);
      console.log('[NutriTrack] ✅ Đã đăng xuất và xóa dữ liệu.');
    } catch (e) {
      console.error('[NutriTrack] ❌ Lỗi khi đăng xuất:', e);
    }
  }, []);

  return { 
    userProfile, 
    setUserProfile, 
    isLoaded,
    logout 
  };
}
