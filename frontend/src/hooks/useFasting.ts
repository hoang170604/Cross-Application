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
  if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Format an ISO date string for Vietnamese display (24-h clock + relative day label). */
export const formatDateDisplay = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const time = `${hour}:${minute}`;
  
  let suffix = '';
  if (d.toDateString() === today.toDateString()) {
    suffix = 'Hôm nay';
  } else if (d.toDateString() === tomorrow.toDateString()) {
    suffix = 'Ngày mai';
  } else {
    suffix = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
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
  fastingMode: 'idle' | 'fasting' | 'eating';
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
  handleStopCycle: () => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useFasting = (): UseFastingReturn => {
  const userId = useAppStore((s) => s.userId);

  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [goalHours, setGoalHours] = useState<number>(DEFAULT_GOAL_HOURS);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fastingMode, setFastingMode] = useState<'idle' | 'fasting' | 'eating'>('idle');

  const intervalRef = useRef<any>(null);
  const isActive = fastingMode !== 'idle';

  // ── Derived values ──────────────────────────────────────────────────────────
  const activeGoalHours = fastingMode === 'eating' ? (24 - goalHours) : goalHours;
  const goalSeconds = activeGoalHours * 3600;
  const remainingSeconds = Math.max(0, goalSeconds - elapsedSeconds);
  const progress = isActive ? Math.min(1, elapsedSeconds / goalSeconds) : 0;
  const elapsedHours = elapsedSeconds / 3600;
  
  // Phase logic is only meaningful during fasting. For eating, we can just show empty or a single phase.
  const currentPhase = fastingMode === 'fasting' ? getCurrentPhase(elapsedHours) : FASTING_PHASES[0];
  const nextPhase = fastingMode === 'fasting' ? getNextPhase(elapsedHours) : null;

  const phaseProgress = nextPhase
    ? Math.min(1, (elapsedHours - currentPhase.startHour) /
        (nextPhase.startHour - currentPhase.startHour))
    : 1;

  const targetEndISO = startTimestamp
    ? new Date(startTimestamp + activeGoalHours * 3600 * 1000).toISOString()
    : null;

  const getWebKeys = useCallback(() => ({
    START_TIME: `@fasting/${userId}/startTime`,
    TARGET_HOURS: `@fasting/${userId}/targetHours`,
    MODE: `@fasting/${userId}/mode`,
  }), [userId]);

  // ── Lưu vào local storage ───────────────
  const saveLocal = useCallback(async (timestamp: number, hours: number, mode: 'fasting' | 'eating') => {
    const keys = getWebKeys();
    await AsyncStorage.setItem(keys.MODE, mode);
    
    if (useWebFallback) {
      await Promise.all([
        AsyncStorage.setItem(keys.START_TIME, String(timestamp)),
        AsyncStorage.setItem(keys.TARGET_HOURS, String(hours)),
      ]);
    } else {
      if (userId) await saveFastingState(userId, timestamp, hours);
    }
  }, [userId, getWebKeys]);

  const clearLocal = useCallback(async () => {
    const keys = getWebKeys();
    await AsyncStorage.removeItem(keys.MODE);
    if (useWebFallback) {
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
      setFastingMode('idle');
      setIsInitializing(false);
      return;
    }

    try {
      const keys = getWebKeys();
      const storedMode = await AsyncStorage.getItem(keys.MODE) as 'fasting' | 'eating' | null;
      
      // 1. Nếu đang fasting, check backend
      if (storedMode === 'fasting' || !storedMode) {
        try {
          const res = await fastingApi.getOpenFastingSession(userId);
          if (res?.data) {
            const session = res.data;
            const startMs = new Date(session.startTime).getTime();
            if (Number.isFinite(startMs)) {
              const elapsed = Math.floor((Date.now() - startMs) / 1000);
              
              // Đọc target hours từ local DB để biết là plan mấy
              let currentTarget = DEFAULT_GOAL_HOURS;
              if (!useWebFallback) {
                const row = await getFastingState(userId);
                if (row) currentTarget = row.target_hours;
              } else {
                const h = await AsyncStorage.getItem(keys.TARGET_HOURS);
                if (h) currentTarget = parseInt(h, 10);
              }

              // Check auto-switch
              if (elapsed >= currentTarget * 3600) {
                // Đã quá giờ nhịn, chuyển sang ăn
                await handleTransitionToEating(currentTarget, startMs);
                return;
              }

              setStartTimestamp(startMs);
              setElapsedSeconds(Math.max(0, elapsed));
              setGoalHours(currentTarget);
              setFastingMode('fasting');
              await saveLocal(startMs, currentTarget, 'fasting');
              setIsInitializing(false);
              return;
            }
          }
        } catch (beErr: any) {
          if (beErr?.response?.status !== 404) {
            console.warn('[Fasting] Resume from BE failed:', beErr.message);
          }
        }
      }

      // 2. Fallback check local
      let storedStart: number | null = null;
      let storedHours: number | null = null;

      if (useWebFallback) {
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

      if (storedMode && storedStart && Number.isFinite(storedStart)) {
        let hours = storedHours && Number.isFinite(storedHours) ? storedHours : DEFAULT_GOAL_HOURS;
        
        // Auto-heal old format where eating mode stored eating hours (e.g. 8) instead of fasting goal (e.g. 16)
        if (storedMode === 'eating' && hours < 12) {
          hours = 24 - hours;
        }

        const elapsed = Math.floor((Date.now() - storedStart) / 1000);
        
        const activeHours = storedMode === 'eating' ? (24 - hours) : hours;
        
        if (elapsed >= activeHours * 3600) {
          if (storedMode === 'fasting') {
            await handleTransitionToEating(hours, storedStart);
            return; // transition handles initialization
          } else {
            // Eating phase finished -> idle
            await clearLocal();
            setFastingMode('idle');
            setStartTimestamp(null);
            setElapsedSeconds(0);
            setGoalHours(DEFAULT_GOAL_HOURS);
          }
        } else {
          setStartTimestamp(storedStart);
          setGoalHours(hours);
          setElapsedSeconds(Math.max(0, elapsed));
          setFastingMode(storedMode);
        }
      } else {
        setStartTimestamp(null);
        setElapsedSeconds(0);
        setGoalHours(DEFAULT_GOAL_HOURS);
        setFastingMode('idle');
      }
    } catch (e) {
      console.warn('[Fasting] Failed to read storage:', e);
    } finally {
      setIsInitializing(false);
    }
  }, [userId, getWebKeys, saveLocal]);

  // Hoisting the transition logic inside resume or hooks
  const handleTransitionToEating = useCallback(async (pastFastingHours: number, pastStart: number) => {
    setIsUploading(true);
    try {
      const actualEnd = new Date(pastStart + pastFastingHours * 3600 * 1000);
      if (userId) {
        try {
          await fastingApi.stopFasting({ userId, endTime: toLocalISOString(actualEnd) });
        } catch (e) {
          console.warn('[Fasting] Transition stop API failed', e);
        }
      }
      
      const eatingHours = 24 - pastFastingHours;
      const eatingStart = actualEnd.getTime();
      const elapsedEating = Math.floor((Date.now() - eatingStart) / 1000);
      
      if (elapsedEating >= eatingHours * 3600) {
        // Eating also finished
        await clearLocal();
        setFastingMode('idle');
        setStartTimestamp(null);
      } else {
        await saveLocal(eatingStart, pastFastingHours, 'eating');
        setFastingMode('eating');
        setGoalHours(pastFastingHours);
        setStartTimestamp(eatingStart);
        setElapsedSeconds(elapsedEating);
      }
    } finally {
      setIsUploading(false);
      setIsInitializing(false);
    }
  }, [userId, clearLocal, saveLocal]);

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
        
        const activeHours = fastingMode === 'eating' ? (24 - goalHours) : goalHours;
        
        // Auto transition
        if (elapsed >= activeHours * 3600) {
          if (fastingMode === 'fasting') {
            handleTransitionToEating(goalHours, startTimestamp);
          } else if (fastingMode === 'eating') {
            // End of cycle
            clearLocal();
            setFastingMode('idle');
            setStartTimestamp(null);
            setElapsedSeconds(0);
          }
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, startTimestamp, fastingMode, goalHours, handleTransitionToEating, clearLocal]);

  // ── Start Fast ──────────────────────────────────────────────────────────────
  const handleStartFast = useCallback(async () => {
    if (!userId) return;
    const now = Date.now();
    const startDate = new Date(now);

    try {
      await fastingApi.startFasting({
        userId,
        startTime: toLocalISOString(startDate),
        fastingGoalHours: goalHours,
      });
    } catch (err: any) {
      if (err?.response?.data?.message?.includes('already exists')) {
        Alert.alert('Lỗi', 'Bạn đang có một phiên nhịn ăn chưa kết thúc. Vui lòng kết thúc phiên đó trước.');
        return;
      }
      console.warn('[Fasting] Start API failed, running offline:', err.message);
    }

    try {
      await saveLocal(now, goalHours, 'fasting');
    } catch (e) {
      console.error('[Fasting] Failed to save local state:', e);
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu nhịn ăn. Vui lòng thử lại.');
      return;
    }

    setStartTimestamp(now);
    setElapsedSeconds(0);
    setFastingMode('fasting');
  }, [goalHours, userId, saveLocal]);

  // ── End Fast (Transition to Eating) ─────────────────────────────────────────
  const handleEndFast = useCallback(async () => {
    if (!startTimestamp || !userId || fastingMode !== 'fasting') return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const endDate = new Date();
    setIsUploading(true);

    try {
      await fastingApi.stopFasting({
        userId,
        endTime: toLocalISOString(endDate),
      });
    } catch (err: any) {
      console.error('[Fasting] Stop API failed:', err.message);
    } 

    // Transition to eating
    const eatingStart = endDate.getTime();
    
    await saveLocal(eatingStart, goalHours, 'eating');
    setFastingMode('eating');
    setStartTimestamp(eatingStart);
    setElapsedSeconds(0);
    setIsUploading(false);
    
  }, [startTimestamp, userId, goalHours, saveLocal, fastingMode]);

  // ── Stop Cycle Entirely ──────────────────────────────────────────────────
  const handleStopCycle = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // If we were fasting and just cancel cycle, we should still stop backend session
    if (fastingMode === 'fasting' && userId) {
      try {
        await fastingApi.stopFasting({ userId, endTime: toLocalISOString(new Date()) });
      } catch (e) {}
    }

    await clearLocal();
    setFastingMode('idle');
    setStartTimestamp(null);
    setElapsedSeconds(0);
    setGoalHours(DEFAULT_GOAL_HOURS);
  }, [clearLocal, fastingMode, userId]);

  return {
    startTimestamp,
    goalHours,
    elapsedSeconds,
    isInitializing,
    isUploading,
    isActive,
    fastingMode,
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
    handleStopCycle,
  };
};
