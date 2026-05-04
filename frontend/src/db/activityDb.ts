import { getDatabase } from './database';

export interface ActivityLog {
  id?: number;
  uid?: string; // Server ID
  activity_type: string;
  minutes: number;
  calories_burned: number;
  date: string;
  synced?: number;
}

/**
 * Thêm một bản ghi bài tập mới vào SQLite
 */
export async function insertActivity(activity: ActivityLog) {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO activities (uid, activity_type, minutes, calories_burned, date, synced) VALUES (?, ?, ?, ?, ?, ?)',
    [activity.uid || null, activity.activity_type, activity.minutes, activity.calories_burned, activity.date, activity.synced || 0]
  );
  return result.lastInsertRowId;
}

/**
 * Lấy danh sách bài tập theo ngày
 */
export async function getActivitiesByDate(date: string): Promise<ActivityLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ActivityLog>(
    'SELECT * FROM activities WHERE date = ?',
    [date]
  );
  return rows;
}

/**
 * Cập nhật một bản ghi bài tập
 */
export async function updateActivity(id: number, activity: Partial<ActivityLog>) {
  const db = await getDatabase();
  // Đảm bảo các giá trị không bị undefined khi đưa vào SQL
  await db.runAsync(
    'UPDATE activities SET minutes = ?, calories_burned = ?, synced = ? WHERE id = ?',
    [
      activity.minutes ?? 0, 
      activity.calories_burned ?? 0, 
      activity.synced ?? 0, 
      id
    ]
  );
}

/**
 * Xóa một bản ghi bài tập
 */
export async function deleteActivity(id: number) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM activities WHERE id = ?', [id]);
}

/**
 * Lấy các bản ghi chưa đồng bộ để chuẩn bị đẩy lên Server
 */
export async function getUnsyncedActivities(): Promise<ActivityLog[]> {
  const db = await getDatabase();
  return await db.getAllAsync<ActivityLog>('SELECT * FROM activities WHERE synced = 0');
}
