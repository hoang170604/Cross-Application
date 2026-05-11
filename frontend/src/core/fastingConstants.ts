/**
 * @file fastingData.ts
 * @description Static data constants and shared TypeScript interfaces
 * for the Intermittent Fasting feature.
 */

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  START_TIME:   '@fasting/startTime',
  TARGET_HOURS: '@fasting/targetHours',
} as const;

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

/** Payload sent to the backend on fast completion. */
export interface FastingRecord {
  userId: number;
  startTime: string;            // ISO-8601
  endTime: string;              // ISO-8601
  totalDurationMinutes: number;
  targetDurationHours: number;
}

/** Record returned by the history endpoint. */
export interface FastingHistoryRecord {
  id: string;
  date: string;                 // e.g. "2026-05-09"
  startTime: string;            // ISO-8601
  endTime: string;              // ISO-8601
  totalDurationHours: number;   // computed from totalDurationMinutes / 60
  planName: string;             // e.g. "16:8"
}

export interface FastingPhase {
  id: string;
  title: string;
  emoji: string;
  icon: string;
  description: string;
  color: string;
  startHour: number;            // hours of fasting required to enter this phase
}

export interface FastingPlan {
  id: string;
  name: string;                 // display name e.g. "16:8"
  duration: number;             // fasting hours
  eating: number;               // eating window hours
  tagline: string;              // one-liner shown in the selector card
}

// ─── Fasting Plans ────────────────────────────────────────────────────────────

export const FASTING_PLANS: FastingPlan[] = [
  { id: '14-10', name: '14:10', duration: 14, eating: 10, tagline: 'Phù hợp cho người mới bắt đầu' },
  { id: '16-8',  name: '16:8',  duration: 16, eating:  8, tagline: 'Chế độ phổ biến nhất' },
  { id: '18-6',  name: '18:6',  duration: 18, eating:  6, tagline: 'Đốt mỡ nhanh hơn' },
  { id: '20-4',  name: '20:4',  duration: 20, eating:  4, tagline: 'Chế độ nâng cao' },
  { id: 'omad',  name: 'OMAD',  duration: 23, eating:  1, tagline: 'Một bữa ăn mỗi ngày' },
];

export const DEFAULT_PLAN = FASTING_PLANS[1]; // 16:8
export const DEFAULT_GOAL_HOURS = DEFAULT_PLAN.duration;

// ─── Biological Fasting Phases ────────────────────────────────────────────────
// Order MUST be ascending by startHour — getCurrentPhase() depends on this.

export const FASTING_PHASES: FastingPhase[] = [
  {
    id: 'fed',
    title: 'Trạng thái no',
    emoji: '🍽️',
    icon: 'silverware-fork-knife',
    description: 'Cơ thể đang tiêu hóa và hấp thụ dinh dưỡng.',
    color: '#0ea5e9',
    startHour: 0,
  },
  {
    id: 'early',
    title: 'Đường huyết giảm',
    emoji: '📉',
    icon: 'water-outline',
    description: 'Lượng đường trong máu bắt đầu giảm xuống, cơ thể dùng glycogen dự trữ.',
    color: '#0ea5e9',
    startHour: 2,
  },
  {
    id: 'fat_burning',
    title: 'Đốt mỡ',
    emoji: '🔥',
    icon: 'fire',
    description: 'Cơ thể bắt đầu chuyển sang đốt cháy mỡ thừa để tạo năng lượng.',
    color: '#F59E0B',
    startHour: 12,
  },
  {
    id: 'ketosis',
    title: 'Ketosis nhẹ',
    emoji: '⚡',
    icon: 'lightning-bolt',
    description: 'Quá trình đốt mỡ tăng tốc, gan sản sinh ketones.',
    color: '#8B5CF6',
    startHour: 16,
  },
  {
    id: 'deep_ketosis',
    title: 'Ketosis sâu',
    emoji: '🌙',
    icon: 'lightning-bolt',
    description: 'Trạng thái đốt mỡ tối đa, kích thích hồi phục cơ thể.',
    color: '#6366F1',
    startHour: 18,
  },
  {
    id: 'autophagy',
    title: 'Tự thực bào',
    emoji: '🌿',
    icon: 'dna',
    description: 'Tế bào bắt đầu dọn dẹp và tái tạo, loại bỏ protein hư hỏng.',
    color: '#10B981',
    startHour: 24,
  },
];
