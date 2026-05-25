import { useAppStore } from '../store/useAppStore';
import * as syncDb from './syncDb';
import * as diaryApi from '../api/diaryService';
import * as progressApi from '../api/progressService';

/**
 * Xử lý toàn bộ hàng đợi đồng bộ đang treo
 */
export async function processSyncQueue() {
  const queue = await syncDb.getSyncQueue();
  if (queue.length === 0) return;

  const { userId, token } = useAppStore.getState();
  if (!userId || !token) return;

  console.log(`[Sync] Processing ${queue.length} items in queue...`);

  for (const item of queue) {
    try {
      const payload = JSON.parse(item.payload);
      switch (item.action_type) {
        case 'ADD_MEAL':
          await diaryApi.addFoodToMeal(userId, payload.mealType, payload.date, payload);
          break;
        case 'ADD_ACTIVITY':
          await progressApi.addActivity(userId, payload);
          break;
        case 'LOG_WATER':
          await progressApi.logWater(userId, payload.amount, payload.date);
          break;
        case 'LOG_WEIGHT':
          await progressApi.logWeight(userId, payload.date, payload.weight);
          break;
      }
      // Nếu thành công -> Xóa khỏi hàng đợi
      await syncDb.removeFromSyncQueue(item.id!);
    } catch (err: any) {
      console.warn(`[Sync] Failed to process item ${item.id}:`, err.message);
      await syncDb.incrementRetryCount(item.id!);

      // Nếu lỗi do kết nối mạng hoặc server không phản hồi (timeout), 
      // ngưng đồng bộ toàn bộ hàng đợi ngay lập tức để tránh lãng phí tài nguyên
      const isNetworkOrTimeout = err.message?.includes('timeout') || err.message === 'Network Error' || !err.response;
      if (isNetworkOrTimeout) {
        console.log('[Sync] Phát hiện lỗi mạng hoặc timeout. Hủy tiến trình đồng bộ hàng đợi.');
        break;
      }
    }
  }
}
