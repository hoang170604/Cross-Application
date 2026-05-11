/**
 * @file fastingDb.ts
 * @description Lưu trạng thái nhịn ăn theo user trong SQLite (thay
 * AsyncStorage). Mỗi user 1 dòng, key = user_id.
 */

import { getDatabase } from './database';

export interface FastingStateRow {
  user_id: number;
  start_time: number;     // epoch ms
  target_hours: number;
  updated_at: string;
}

export async function getFastingState(userId: number): Promise<FastingStateRow | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<FastingStateRow>(
    'SELECT user_id, start_time, target_hours, updated_at FROM fasting_state WHERE user_id = ?',
    [userId],
  );
  return row ?? null;
}

export async function saveFastingState(
  userId: number,
  startTime: number,
  targetHours: number,
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO fasting_state (user_id, start_time, target_hours, updated_at)
     VALUES (?, ?, ?, ?)`,
    [userId, startTime, targetHours, now],
  );
}

export async function clearFastingState(userId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM fasting_state WHERE user_id = ?', [userId]);
}
