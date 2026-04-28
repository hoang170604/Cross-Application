/**
 * @file fasting.types.ts
 * @description Hợp đồng dữ liệu cho module Nhịn ăn gián đoạn (Fasting).
 * Khớp với entities FastingSession.java và FastingStateDTO.java ở Backend.
 */

/** Phiên nhịn ăn (khớp với entity FastingSession.java) */
export type FastingSession = {
  id: number;
  user?: { id: number };
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  isCompleted: boolean;
};

/** Payload để bắt đầu / dừng nhịn ăn (khớp với FastingStateDTO.java) */
export type FastingStatePayload = {
  userId: number;
  startTime?: string;
  endTime?: string;
  fastingGoalHours?: number;
};
