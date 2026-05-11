/**
 * @file useFasting.ts
 * @description Custom hook encapsulating ALL business logic for the
 * Intermittent Fasting feature — fully connected to Spring Boot backend.
 *
 * API Mapping:
 *  - Start  → POST /api/fasting/start  { userId, startTime, fastingGoalHours }
 *  - Stop   → POST /api/fasting/stop   { userId, endTime }
 *  - Resume → GET  /api/fasting/sessions/{userId}/open  (on mount)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '@/src/store/useAppStore';
import {
  saveFastingState,
  getFastingState,
  clearFastingState,
} from '@/src/db/fastingDb';
import * as fastingApi from '@/src/api/fastingService';
import {
  DEFAULT_GOAL_HOURS,
  FASTING_PHASES,
  FastingPhase,
} from '@/src/core/fastingConstants';

const useWebFallback = Platform.OS === 'web';

// ─── Pure helper functions ─────────────────────────────────────────────────────

/** Returns the phase the user is currently in (highest startHour ≤ elapsedHours). */
export const getCurrentPhase = (elapsedHours: number): FastingPhase =>
  [...FASTING_PHASES].reverse().find((p) => elapsedHours >= p.startHour) ??
  FASTING_PHASES[0];

/** Returns the next upcoming phase, or null if already at the last phase. */
export const getNextPhase = (elapsedHours: number): FastingPhase | null =>
  FASTING_PHASES.find((p) => p.startHour > elapsedHours) ?? null;

/** Format total seconds as HH:MM:SS. */
export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Format an ISO date string for Vietnamese display (24-h clock + relative day label). */
export const formatDateDisplay = (iso: string): string => {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const suffix =
    d.toDateString() === today.toDateString()
      ? 'Hôm nay'
      : d.toDateString() === tomorrow.toDateString()
      ? 'Ngày mai'
      : d.toLocaleDateString('vi-VN');
  return `${time} · ${suffix}`;
};

/**
 * Chuyển Date object → chuỗi ISO-8601 cục bộ (không có "Z")
 * để khớp định dạng LocalDateTime của Spring Boot.
 * Ví dụ: "2026-05-11T23:15:00"
 */
const toLocalISOString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
};

// ─── Hook return type ──────────────────────────────────────────────────────────

export interface UseFastingReturn {
  startTimestamp: number | null;
  goalHours: number;
  elapsedSeconds: number;
  isInitializing: boolean;
  isUploading: boolean;
  isActive: boolean;
  goalSeconds: number;
  remainingSeconds: number;
  progress: number;
  elapsedHours: number;
  currentPhase: FastingPhase;
  nextPhase: FastingPhase | null;
  phaseProgress: number;
  targetEndISO: string | null;
  setGoalHours: (hours: number) => void;
  handleStartFast: () => Promise<void>;
  handleEndFast: () => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useFasting = (): UseFastingReturn => {
  const userId = useAppStore((s) => s.userId);

  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [goalHours, setGoalHours] = useState<number>(DEFAULT_GOAL_HOURS);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const intervalRef = useRef<any>(null);
  const isActive = startTimestamp !== null;

  // ── Derived values ──────────────────────────────────────────────────────────
  const goalSeconds = goalHours * 3600;
  const remainingSeconds = Math.max(0, goalSeconds - elapsedSeconds);
  const progress = isActive ? Math.min(1, elapsedSeconds / goalSeconds) : 0;
  const elapsedHours = elapsedSeconds / 3600;
  const currentPhase = getCurrentPhase(elapsedHours);
  const nextPhase = getNextPhase(elapsedHours);

  const phaseProgress = nextPhase
    ? Math.min(1, (elapsedHours - currentPhase.startHour) /
        (nextPhase.startHour - currentPhase.startHour))
    : 1;

  const targetEndISO = startTimestamp
    ? new Date(startTimestamp + goalHours * 3600 * 1000).toISOString()
    : null;

  const getWebKeys = useCallback(() => ({
    START_TIME: `@fasting/${userId}/startTime`,
    TARGET_HOURS: `@fasting/${userId}/targetHours`,
  }), [userId]);

  // ── Lưu vào local storage (SQLite native / AsyncStorage web) ───────────────
  const saveLocal = useCallback(async (timestamp: number, hours: number) => {
    if (useWebFallback) {
      const keys = getWebKeys();
      await Promise.all([
        AsyncStorage.setItem(keys.START_TIME, String(timestamp)),
        AsyncStorage.setItem(keys.TARGET_HOURS, String(hours)),
      ]);
    } else {
      if (userId) await saveFastingState(userId, timestamp, hours);
    }
  }, [userId, getWebKeys]);

  const clearLocal = useCallback(async () => {
    if (useWebFallback) {
      const keys = getWebKeys();
      await Promise.all([
        AsyncStorage.removeItem(keys.START_TIME),
        AsyncStorage.removeItem(keys.TARGET_HOURS),
      ]);
    } else {
      if (userId) await clearFastingState(userId);
    }
  }, [userId, getWebKeys]);

  // ── Resume: Ưu tiên kiểm tra BE → fallback về local storage ───────────────
  const resumeFromStorage = useCallback(async () => {
    if (!userId) {
      setStartTimestamp(null);
      setElapsedSeconds(0);
      setIsInitializing(false);
      return;
    }

    try {
      // 1. Kiểm tra phiên đang mở trên BE (source of truth)
      try {
        const res = await fastingApi.getOpenFastingSession(userId);
        if (res?.data) {
          const session = res.data;
          const startMs = new Date(session.startTime).getTime();
          if (Number.isFinite(startMs)) {
            const elapsed = Math.floor((Date.now() - startMs) / 1000);
            setStartTimestamp(startMs);
            setElapsedSeconds(Math.max(0, elapsed));
            // Đồng bộ lại local để offline cũng hoạt động
            await saveLocal(startMs, DEFAULT_GOAL_HOURS);
            setIsInitializing(false);
            return;
          }
        }
      } catch (beErr: any) {
        // 404 = không có phiên mở → tiếp tục check local
        if (beErr?.response?.status !== 404) {
          console.warn('[Fasting] Resume from BE failed:', beErr.message);
        }
      }

      // 2. Fallback: đọc từ local storage
      let storedStart: number | null = null;
      let storedHours: number | null = null;

      if (useWebFallback) {
        const keys = getWebKeys();
        const [s, h] = await Promise.all([
          AsyncStorage.getItem(keys.START_TIME),
          AsyncStorage.getItem(keys.TARGET_HOURS),
        ]);
        if (s) storedStart = parseInt(s, 10);
        if (h) storedHours = parseInt(h, 10);
      } else {
        const row = await getFastingState(userId);
        if (row) {
          storedStart = row.start_time;
          storedHours = row.target_hours;
        }
      }

      if (storedStart && Number.isFinite(storedStart)) {
        const hours = storedHours && Number.isFinite(storedHours) ? storedHours : DEFAULT_GOAL_HOURS;
        const elapsed = Math.floor((Date.now() - storedStart) / 1000);
        setStartTimestamp(storedStart);
        setGoalHours(hours);
        setElapsedSeconds(Math.max(0, elapsed));
      } else {
        setStartTimestamp(null);
        setElapsedSeconds(0);
        setGoalHours(DEFAULT_GOAL_HOURS);
      }
    } catch (e) {
      console.warn('[Fasting] Failed to read storage:', e);
    } finally {
      setIsInitializing(false);
    }
  }, [userId, getWebKeys, saveLocal]);

  useEffect(() => {
    resumeFromStorage();
  }, [resumeFromStorage]);

  // ── Live interval timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isActive && startTimestamp) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        setElapsedSeconds(Math.max(0, elapsed));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, startTimestamp]);

  // ── Start Fast ──────────────────────────────────────────────────────────────
  const handleStartFast = useCallback(async () => {
    if (!userId) return;
    const now = Date.now();
    const startDate = new Date(now);

    try {
      // 1. Gọi API BE để ghi nhận phiên mới
      await fastingApi.startFasting({
        userId,
        startTime: toLocalISOString(startDate),
        fastingGoalHours: goalHours,
      });
    } catch (err: any) {
      // Nếu đã có phiên mở → thông báo lỗi rõ ràng
      if (err?.response?.data?.message?.includes('already exists')) {
        Alert.alert('Lỗi', 'Bạn đang có một phiên nhịn ăn chưa kết thúc. Vui lòng kết thúc phiên đó trước.');
        return;
      }
      // Các lỗi mạng khác → offline mode, tiếp tục
      console.warn('[Fasting] Start API failed, running offline:', err.message);
    }

    // 2. Lưu cục bộ (offline-first)
    try {
      await saveLocal(now, goalHours);
    } catch (e) {
      console.error('[Fasting] Failed to save local state:', e);
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu nhịn ăn. Vui lòng thử lại.');
      return;
    }

    setStartTimestamp(now);
    setElapsedSeconds(0);
  }, [goalHours, userId, saveLocal]);

  // ── End Fast ─────────────────────────────────────────────────────────────────
  const handleEndFast = useCallback(async () => {
    if (!startTimestamp || !userId) return;

    // Dừng đồng hồ
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const endDate = new Date();
    const totalDurationMinutes = Math.floor((endDate.getTime() - startTimestamp) / 60000);
    const hours = Math.floor(totalDurationMinutes / 60);
    const mins = totalDurationMinutes % 60;

    setIsUploading(true);
    let apiSuccess = false;

    try {
      // Gọi API BE để đóng phiên
      await fastingApi.stopFasting({
        userId,
        endTime: toLocalISOString(endDate),
      });
      apiSuccess = true;
    } catch (err: any) {
      console.error('[Fasting] Stop API failed:', err.message);
    } finally {
      // LUÔN xóa local và reset UI
      try {
        await clearLocal();
      } catch (storageErr) {
        console.warn('[Fasting] Failed to clear local storage:', storageErr);
      }

      setStartTimestamp(null);
      setElapsedSeconds(0);
      setGoalHours(DEFAULT_GOAL_HOURS);
      setIsUploading(false);

      if (apiSuccess) {
        Alert.alert(
          'Hoàn thành! 🎉',
          `Bạn đã nhịn ăn được ${hours} giờ ${mins} phút. Tuyệt vời!`
        );
      } else {
        Alert.alert(
          'Đã kết thúc',
          `Phiên nhịn ăn ${hours} giờ ${mins} phút đã dừng nhưng chưa đồng bộ lên máy chủ. Sẽ tự đồng bộ khi có mạng.`
        );
      }
    }
  }, [startTimestamp, userId, goalHours, clearLocal]);

  return {
    startTimestamp,
    goalHours,
    elapsedSeconds,
    isInitializing,
    isUploading,
    isActive,
    goalSeconds,
    remainingSeconds,
    progress,
    elapsedHours,
    currentPhase,
    nextPhase,
    phaseProgress,
    targetEndISO,
    setGoalHours,
    handleStartFast,
    handleEndFast,
  };
};
