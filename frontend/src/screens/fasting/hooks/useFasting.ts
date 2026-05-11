/**
 * @file useFasting.ts
 * @description Custom hook encapsulating ALL business logic for the
 * Intermittent Fasting feature.
 *
 * Responsibilities:
 *  - AsyncStorage persistence (start / resume / clear)
 *  - Live interval timer (Date.now()-based for background accuracy)
 *  - Fasting history fetch from backend
 *  - Start / End fast handlers
 *  - All derived values (progress, currentPhase, nextPhase, phaseProgress)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/src/api/apiClient';
import { useAppStore } from '@/src/store/useAppStore';
import {
  saveFastingState,
  getFastingState,
  clearFastingState,
} from '@/src/db/fastingDb';
import {
  STORAGE_KEYS,
  DEFAULT_GOAL_HOURS,
  FASTING_PHASES,
  FastingRecord,
  FastingHistoryRecord,
  FastingPhase,
} from '../constants/fastingData';

// Trên web SQLite là no-op; vẫn fallback AsyncStorage để demo chạy được.
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

// ─── Hook return type ──────────────────────────────────────────────────────────

export interface UseFastingReturn {
  // State
  startTimestamp: number | null;
  goalHours: number;
  elapsedSeconds: number;
  isInitializing: boolean;
  isUploading: boolean;
  isActive: boolean;
  // History
  history: FastingHistoryRecord[];
  isHistoryLoading: boolean;
  historyError: string | null;
  fetchHistory: () => void;
  // Derived
  goalSeconds: number;
  remainingSeconds: number;
  progress: number;
  elapsedHours: number;
  currentPhase: FastingPhase;
  nextPhase: FastingPhase | null;
  phaseProgress: number;
  targetEndISO: string | null;
  // Actions
  setGoalHours: (hours: number) => void;
  handleStartFast: () => Promise<void>;
  handleEndFast: () => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useFasting = (): UseFastingReturn => {
  const userId = useAppStore((s) => s.userId);

  // ── Core fasting state ──────────────────────────────────────────────────────
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [goalHours, setGoalHours] = useState<number>(DEFAULT_GOAL_HOURS);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // ── History state ───────────────────────────────────────────────────────────
  const [history, setHistory] = useState<FastingHistoryRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const intervalRef = useRef<any>(null);
  const isActive = startTimestamp !== null;

  // ── Derived values ──────────────────────────────────────────────────────────
  const goalSeconds = goalHours * 3600;
  const remainingSeconds = Math.max(0, goalSeconds - elapsedSeconds);
  const progress = isActive ? Math.min(1, elapsedSeconds / goalSeconds) : 0;
  const elapsedHours = elapsedSeconds / 3600;
  const currentPhase = getCurrentPhase(elapsedHours);
  const nextPhase = getNextPhase(elapsedHours);

  /**
   * Progress toward the NEXT phase (0–1).
   *   0 = just entered currentPhase
   *   1 = just reached nextPhase threshold
   */
  const phaseProgress = nextPhase
    ? Math.min(1, (elapsedHours - currentPhase.startHour) /
        (nextPhase.startHour - currentPhase.startHour))
    : 1; // last phase — show full bar

  const targetEndISO = startTimestamp
    ? new Date(startTimestamp + goalHours * 3600 * 1000).toISOString()
    : null;

  // ─── Web fallback keys — chỉ dùng khi Platform.OS === 'web' ─────────────────
  const getWebKeys = useCallback(() => ({
    START_TIME: `@fasting/${userId}/startTime`,
    TARGET_HOURS: `@fasting/${userId}/targetHours`,
  }), [userId]);

  // ── Step 1: Resume từ SQLite (native) hoặc AsyncStorage (web) ───────────────
  const resumeFromStorage = useCallback(async () => {
    if (!userId) {
      setStartTimestamp(null);
      setElapsedSeconds(0);
      setIsInitializing(false);
      return;
    }

    try {
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
  }, [userId, getWebKeys]);

  useEffect(() => {
    resumeFromStorage();
  }, [resumeFromStorage]);

  // ── Step 2: Fetch fasting history from backend ──────────────────────────────
  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setHistory([]);
      return;
    }
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await apiClient.get<FastingHistoryRecord[]>(
        `/api/fasting/users/${userId}/history?limit=5`
      );
      setHistory(res.data ?? []);
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        setHistoryError('Không thể tải lịch sử. Vui lòng thử lại.');
      } else {
        setHistory([]);
      }
    } finally {
      setIsHistoryLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ── Step 3: Live interval timer ─────────────────────────────────────────────
  // Uses Date.now() delta so accuracy is preserved even after app restarts.
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

  // ── Start Fast — lưu vào SQLite (native) hoặc AsyncStorage (web), không gọi API
  const handleStartFast = useCallback(async () => {
    if (!userId) return;
    const now = Date.now();
    try {
      if (useWebFallback) {
        const keys = getWebKeys();
        await Promise.all([
          AsyncStorage.setItem(keys.START_TIME, String(now)),
          AsyncStorage.setItem(keys.TARGET_HOURS, String(goalHours)),
        ]);
      } else {
        await saveFastingState(userId, now, goalHours);
      }
      setStartTimestamp(now);
      setElapsedSeconds(0);
    } catch (e) {
      console.error('[Fasting] Failed to save fasting state:', e);
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu nhịn ăn. Vui lòng thử lại.');
    }
  }, [goalHours, userId, getWebKeys]);

  // ── End Fast — one API call; state ALWAYS resets regardless of result ────────
  const handleEndFast = useCallback(async () => {
    console.log('[Fasting] End Fast Triggered');

    if (!startTimestamp || !userId) {
      console.warn('[Fasting] endFast aborted — missing startTimestamp or userId');
      return;
    }

    // Stop the ticker first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const endTime = new Date();
    const startTime = new Date(startTimestamp);
    const totalDurationMinutes = Math.floor(
      (endTime.getTime() - startTimestamp) / 60000
    );

    const record: FastingRecord = {
      userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalDurationMinutes,
      targetDurationHours: goalHours,
    };

    setIsUploading(true);
    let uploadSucceeded = false;

    try {
      await apiClient.post('/api/fasting/save-record', record);
      uploadSucceeded = true;
    } catch (err) {
      console.error('[Fasting] API upload failed:', err);
    } finally {
      // ALWAYS clear storage and reset UI — user must never be stuck
      try {
        if (useWebFallback) {
          const keys = getWebKeys();
          await Promise.all([
            AsyncStorage.removeItem(keys.START_TIME),
            AsyncStorage.removeItem(keys.TARGET_HOURS),
          ]);
        } else {
          await clearFastingState(userId);
        }
      } catch (storageErr) {
        console.warn('[Fasting] Failed to clear fasting storage:', storageErr);
      }

      setStartTimestamp(null);
      setElapsedSeconds(0);
      setGoalHours(DEFAULT_GOAL_HOURS);
      setIsUploading(false);

      if (uploadSucceeded) {
        Alert.alert(
          'Hoàn thành! 🎉',
          `Bạn đã nhịn ăn được ${Math.floor(totalDurationMinutes / 60)} giờ ${totalDurationMinutes % 60} phút. Tuyệt vời!`
        );
        fetchHistory();
      } else {
        Alert.alert(
          'Đã kết thúc (chưa đồng bộ)',
          'Phiên nhịn ăn đã dừng nhưng chưa tải lên được. Dữ liệu đã được xóa cục bộ.'
        );
      }
    }
  }, [startTimestamp, userId, goalHours, fetchHistory, getWebKeys]);

  return {
    startTimestamp,
    goalHours,
    elapsedSeconds,
    isInitializing,
    isUploading,
    isActive,
    history,
    isHistoryLoading,
    historyError,
    fetchHistory,
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
