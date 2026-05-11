/**
 * @file tokenStorage.ts
 * @description Lưu trữ access token & refresh token AN TOÀN bằng SecureStore.
 *
 *  - Native (iOS/Android): dùng `expo-secure-store` (Keychain / Keystore).
 *  - Web: SecureStore không khả dụng → fallback `AsyncStorage` (cảnh báo bảo
 *    mật: chỉ nên dùng cho dev/demo; production web nên dùng cookie httpOnly
 *    do backend cấp).
 *
 *  Lưu ý: KHÔNG persist token trong Zustand store nữa (đã loại khỏi
 *  `partialize`). Toàn bộ vòng đời token được quản lý tại file này.
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth.token';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const TOKEN_EXPIRES_AT_KEY = 'auth.expiresAt';

// Legacy keys (phiên bản cũ) — dùng cho migration một lần
const LEGACY_TOKEN_KEY = 'token';
const LEGACY_REFRESH_KEY = 'refreshToken';

const isWeb = Platform.OS === 'web';

async function setSecure(key: string, value: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecure(key: string): Promise<string | null> {
  if (isWeb) {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteSecure(key: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export interface SaveTokenInput {
  token: string;
  refreshToken?: string | null;
  /** Số giây tính từ bây giờ cho tới khi token hết hạn. */
  expiresIn?: number | null;
}

/**
 * Lưu access token (và refresh token nếu có) vào SecureStore.
 * Có thể truyền chuỗi đơn giản (backward-compatible) hoặc object.
 */
export async function saveToken(
  input: string | SaveTokenInput,
  refreshToken?: string,
): Promise<void> {
  const payload: SaveTokenInput =
    typeof input === 'string' ? { token: input, refreshToken } : input;

  await setSecure(TOKEN_KEY, payload.token);

  if (payload.refreshToken) {
    await setSecure(REFRESH_TOKEN_KEY, payload.refreshToken);
  }

  if (payload.expiresIn && Number.isFinite(payload.expiresIn)) {
    const expiresAt = Date.now() + payload.expiresIn * 1000;
    await setSecure(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  }
}

export async function getToken(): Promise<string | null> {
  const current = await getSecure(TOKEN_KEY);
  if (current) return current;

  // Migration 1 lần: phiên bản cũ lưu key "token"
  const legacy = await getSecure(LEGACY_TOKEN_KEY);
  if (legacy) {
    await setSecure(TOKEN_KEY, legacy);
    await deleteSecure(LEGACY_TOKEN_KEY);
    return legacy;
  }
  return null;
}

export async function getRefreshToken(): Promise<string | null> {
  const current = await getSecure(REFRESH_TOKEN_KEY);
  if (current) return current;

  const legacy = await getSecure(LEGACY_REFRESH_KEY);
  if (legacy) {
    await setSecure(REFRESH_TOKEN_KEY, legacy);
    await deleteSecure(LEGACY_REFRESH_KEY);
    return legacy;
  }
  return null;
}

export async function getTokenExpiresAt(): Promise<number | null> {
  const raw = await getSecure(TOKEN_EXPIRES_AT_KEY);
  if (!raw) return null;
  const ms = parseInt(raw, 10);
  return Number.isFinite(ms) ? ms : null;
}

/** Token sắp hết hạn nếu còn ≤ thresholdSeconds (mặc định 60s). */
export async function isTokenNearExpiry(thresholdSeconds = 60): Promise<boolean> {
  const expiresAt = await getTokenExpiresAt();
  if (!expiresAt) return false;
  return Date.now() >= expiresAt - thresholdSeconds * 1000;
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    deleteSecure(TOKEN_KEY),
    deleteSecure(REFRESH_TOKEN_KEY),
    deleteSecure(TOKEN_EXPIRES_AT_KEY),
    deleteSecure(LEGACY_TOKEN_KEY),
    deleteSecure(LEGACY_REFRESH_KEY),
  ]);
}
