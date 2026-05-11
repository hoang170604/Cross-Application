/**
 * @file imagePicker.ts
 * @description Bao bọc `expo-image-picker` + auto nén/convert WebP qua
 * `imageCompressor.ts`. Trả về URI đã sẵn sàng upload/cache.
 */

import { Platform } from 'react-native';
import { compressAvatar, compressImage, CompressOptions, CompressResult } from './imageCompressor';

function getLib(): any | null {
  if (Platform.OS === 'web') {
    // expo-image-picker hỗ trợ web nhưng giới hạn — vẫn require thử.
  }
  try {
    return require('expo-image-picker');
  } catch (e: any) {
    console.warn('[ImagePicker] expo-image-picker not installed:', e?.message);
    return null;
  }
}

export interface PickOptions {
  /** Cho phép crop trước khi trả về. Mặc định true. */
  allowsEditing?: boolean;
  /** Tỉ lệ crop [width, height], chỉ Android dùng. */
  aspect?: [number, number];
  /** Tùy chọn nén sau khi pick. Bỏ qua nếu muốn giữ nguyên gốc. */
  compress?: CompressOptions | false;
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  const ImagePicker = getLib();
  if (!ImagePicker) return false;
  try {
    const cur = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (cur.granted) return true;
    const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return !!req.granted;
  } catch (e: any) {
    console.warn('[ImagePicker] permission failed:', e?.message);
    return false;
  }
}

/**
 * Mở thư viện ảnh, cho người dùng chọn 1 ảnh, sau đó nén/convert WebP.
 * Trả null nếu user hủy hoặc không có quyền.
 */
export async function pickImage(opts: PickOptions = {}): Promise<CompressResult | null> {
  const ImagePicker = getLib();
  if (!ImagePicker) return null;
  const ok = await requestMediaLibraryPermission();
  if (!ok) return null;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? 'Images',
      allowsEditing: opts.allowsEditing ?? true,
      aspect: opts.aspect,
      quality: 1, // giữ gốc; nén ở bước sau bằng image-manipulator (WebP)
    });

    if (result.canceled) return null;
    const asset = result.assets?.[0];
    if (!asset?.uri) return null;

    if (opts.compress === false) {
      return { uri: asset.uri, width: asset.width ?? 0, height: asset.height ?? 0, compressed: false };
    }
    return compressImage(asset.uri, opts.compress);
  } catch (e: any) {
    console.warn('[ImagePicker] pickImage failed:', e?.message);
    return null;
  }
}

/**
 * Convenience: pick + crop vuông + nén thành WebP 512px (dùng cho avatar).
 */
export async function pickAvatar(): Promise<CompressResult | null> {
  const ImagePicker = getLib();
  if (!ImagePicker) return null;
  const ok = await requestMediaLibraryPermission();
  if (!ok) return null;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? 'Images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (result.canceled) return null;
    const asset = result.assets?.[0];
    if (!asset?.uri) return null;
    return compressAvatar(asset.uri);
  } catch (e: any) {
    console.warn('[ImagePicker] pickAvatar failed:', e?.message);
    return null;
  }
}
