/**
 * @file locationService.ts
 * @description Helper mỏng quanh `expo-location`. App dinh dưỡng không bắt
 * buộc dùng GPS, nhưng có hạ tầng sẵn nếu sau này muốn:
 *  - Gợi ý nhà hàng healthy gần vị trí user.
 *  - Tracking lộ trình chạy bộ / đạp xe (đo calorie).
 */

import { Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
  /** Độ chính xác (mét), càng nhỏ càng tốt. */
  accuracy?: number | null;
}

function getLib(): any | null {
  if (Platform.OS === 'web') return null;
  try {
    return require('expo-location');
  } catch (e: any) {
    console.warn('[Location] expo-location not installed:', e?.message);
    return null;
  }
}

export async function requestLocationPermission(): Promise<boolean> {
  const Location = getLib();
  if (!Location) return false;
  try {
    const cur = await Location.getForegroundPermissionsAsync();
    if (cur.granted) return true;
    const req = await Location.requestForegroundPermissionsAsync();
    return !!req.granted;
  } catch (e: any) {
    console.warn('[Location] requestLocationPermission failed:', e?.message);
    return false;
  }
}

/**
 * Lấy vị trí hiện tại 1 lần. Trả null nếu chưa cấp quyền hoặc lib không khả dụng.
 */
export async function getCurrentLocation(): Promise<Coordinates | null> {
  const Location = getLib();
  if (!Location) return null;
  try {
    const ok = await requestLocationPermission();
    if (!ok) return null;
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    };
  } catch (e: any) {
    console.warn('[Location] getCurrentLocation failed:', e?.message);
    return null;
  }
}
