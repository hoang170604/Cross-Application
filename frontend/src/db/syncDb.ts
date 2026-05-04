import { getDatabase } from './database';

export interface SyncItem {
  id?: number;
  action_type: 'ADD_MEAL' | 'ADD_ACTIVITY' | 'LOG_WATER' | 'LOG_WEIGHT';
  payload: string; // JSON string
  created_at: string;
  retry_count?: number;
}

/**
 * Thêm một yêu cầu đồng bộ vào hàng đợi
 */
export async function addToSyncQueue(action: SyncItem['action_type'], data: any) {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO sync_queue (action_type, payload, created_at) VALUES (?, ?, ?)',
    [action, JSON.stringify(data), new Date().toISOString()]
  );
  console.log(`[SyncQueue] Added ${action} to queue.`);
}

/**
 * Lấy toàn bộ hàng đợi để xử lý
 */
export async function getSyncQueue(): Promise<SyncItem[]> {
  const db = await getDatabase();
  return await db.getAllAsync<SyncItem>('SELECT * FROM sync_queue ORDER BY created_at ASC');
}

/**
 * Xóa một yêu cầu sau khi đã đồng bộ thành công
 */
export async function removeFromSyncQueue(id: number) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
}

/**
 * Tăng số lần thử lại nếu thất bại
 */
export async function incrementRetryCount(id: number) {
  const db = await getDatabase();
  await db.runAsync('UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?', [id]);
}
