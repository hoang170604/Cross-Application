/**
 * Script reset toàn bộ dữ liệu AsyncStorage của NutriTrack.
 * 
 * Cách sử dụng:
 * 1. Import hàm này vào bất kỳ screen nào (VD: profile.tsx)
 * 2. Gọi resetAllStorage() khi cần reset
 * 
 * Hoặc: Mở Console trên Expo Web (F12) rồi gọi:
 *   await AsyncStorage.clear()
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@nutritrack_state';

export async function resetAllStorage() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('[NutriTrack] ✅ Đã xóa toàn bộ dữ liệu AsyncStorage.');
    console.log('[NutriTrack] Hãy reload app để áp dụng.');
    return true;
  } catch (e) {
    console.error('[NutriTrack] ❌ Lỗi khi xóa AsyncStorage:', e);
    return false;
  }
}

export async function clearAllAsyncStorage() {
  try {
    await AsyncStorage.clear();
    console.log('[NutriTrack] ✅ Đã clear toàn bộ AsyncStorage.');
    return true;
  } catch (e) {
    console.error('[NutriTrack] ❌ Lỗi khi clear AsyncStorage:', e);
    return false;
  }
}
