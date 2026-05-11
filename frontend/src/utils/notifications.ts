/**
 * @file notifications.ts
 * @description Bao bọc `expo-notifications` cho các nhắc nhở của app:
 *  - Nhắc uống nước theo chu kỳ.
 *  - Nhắc kết thúc phiên nhịn ăn khi đạt target.
 *
 * Lưu ý:
 *  - Web không hỗ trợ local notifications của Expo → các hàm trả về null/no-op.
 *  - Lib được lazy-require để app vẫn build được trước khi user chạy
 *    `npm install` lần đầu (sau khi thêm dependency).
 */

import { Platform } from 'react-native';

/** Cờ chống init nhiều lần (handler chỉ cần setup 1 lần / runtime). */
let handlerInitialized = false;

function getLib(): any | null {
  if (Platform.OS === 'web') return null;
  try {
    return require('expo-notifications');
  } catch (e: any) {
    console.warn('[Notifications] expo-notifications not installed:', e?.message);
    return null;
  }
}

/**
 * Cấu hình mặc định: hiển thị alert + phát âm ngay cả khi app foreground.
 * Gọi 1 lần lúc app khởi động (idempotent).
 */
export function setupNotificationHandler(): void {
  if (handlerInitialized) return;
  const Notifications = getLib();
  if (!Notifications) return;

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerInitialized = true;
  } catch (e: any) {
    console.warn('[Notifications] setupNotificationHandler failed:', e?.message);
  }
}

/**
 * Xin quyền hiển thị notification. Trả true nếu được cấp.
 */
export async function requestPermission(): Promise<boolean> {
  const Notifications = getLib();
  if (!Notifications) return false;
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return true;
    const req = await Notifications.requestPermissionsAsync();
    return !!req.granted;
  } catch (e: any) {
    console.warn('[Notifications] requestPermission failed:', e?.message);
    return false;
  }
}

/**
 * Lên lịch nhắc uống nước lặp lại sau `intervalSeconds`. Trả về id để hủy.
 */
export async function scheduleWaterReminder(
  intervalSeconds = 60 * 60 * 2, // mặc định 2 giờ
): Promise<string | null> {
  const Notifications = getLib();
  if (!Notifications) return null;
  try {
    const ok = await requestPermission();
    if (!ok) return null;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Đã đến giờ uống nước!',
        body: 'Nhớ uống thêm một ly nước để giữ đủ ẩm trong ngày.',
      },
      trigger: { seconds: intervalSeconds, repeats: true },
    });
    return id;
  } catch (e: any) {
    console.warn('[Notifications] scheduleWaterReminder failed:', e?.message);
    return null;
  }
}

/**
 * Lên lịch nhắc kết thúc phiên nhịn ăn vào `targetEndAtMs` (epoch ms).
 */
export async function scheduleFastingEndAlert(
  targetEndAtMs: number,
): Promise<string | null> {
  const Notifications = getLib();
  if (!Notifications) return null;
  try {
    const ok = await requestPermission();
    if (!ok) return null;
    const secondsFromNow = Math.max(1, Math.round((targetEndAtMs - Date.now()) / 1000));
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Hoàn thành mục tiêu nhịn ăn',
        body: 'Bạn đã đạt mục tiêu! Có thể kết thúc phiên nhịn ăn bây giờ.',
      },
      trigger: { seconds: secondsFromNow },
    });
    return id;
  } catch (e: any) {
    console.warn('[Notifications] scheduleFastingEndAlert failed:', e?.message);
    return null;
  }
}

export async function cancelNotification(id: string): Promise<void> {
  const Notifications = getLib();
  if (!Notifications || !id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e: any) {
    console.warn('[Notifications] cancel failed:', e?.message);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  const Notifications = getLib();
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e: any) {
    console.warn('[Notifications] cancelAll failed:', e?.message);
  }
}
