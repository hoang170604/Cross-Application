/**
 * @file imageCompressor.ts
 * @description Helper nén ảnh + convert sang WebP bằng `expo-image-manipulator`.
 *
 * Khi nào nên dùng:
 *  - Trước khi upload avatar / ảnh món ăn lên server → cắt giảm 30–50% dung
 *    lượng so với JPEG, nhanh hơn nhiều khi tải lại.
 *  - Trước khi cache ảnh xuống đĩa nếu app làm offline-first.
 *
 * Lưu ý:
 *  - WebP được hỗ trợ trên iOS 14+ và Android 4.0+. Với target Expo SDK
 *    hiện tại (54) thì gần như chắc chắn OK.
 *  - Trên web, `expo-image-manipulator` không khả dụng → fallback trả về
 *    ảnh gốc.
 */

import { Platform } from 'react-native';

export interface CompressOptions {
  /** Chiều rộng tối đa (giữ tỉ lệ). Mặc định 1080. */
  maxWidth?: number;
  /** Chất lượng 0..1. Mặc định 0.8. */
  quality?: number;
  /**
   * Định dạng đầu ra. `webp` mặc định trên native; `jpeg` là fallback.
   * Bỏ qua trên web (lib không khả dụng).
   */
  format?: 'webp' | 'jpeg' | 'png';
}

export interface CompressResult {
  uri: string;
  width: number;
  height: number;
  /** True nếu thực sự đã nén/convert; false nếu fallback trả ảnh gốc. */
  compressed: boolean;
}

/**
 * Nén & convert ảnh. Trên web hoặc khi thư viện không sẵn sàng, trả ảnh gốc
 * kèm flag `compressed: false`.
 */
export async function compressImage(
  uri: string,
  options: CompressOptions = {},
): Promise<CompressResult> {
  const { maxWidth = 1080, quality = 0.8, format = 'webp' } = options;

  if (Platform.OS === 'web') {
    return { uri, width: 0, height: 0, compressed: false };
  }

  try {
    // Lazy require để tránh crash khi lib chưa cài (commit này chỉ thêm
    // dependency vào package.json — user sẽ chạy `npm install` để cài).
    const Manipulator = require('expo-image-manipulator');

    const saveFormat =
      format === 'webp'
        ? Manipulator.SaveFormat.WEBP
        : format === 'png'
          ? Manipulator.SaveFormat.PNG
          : Manipulator.SaveFormat.JPEG;

    const result = await Manipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }],
      { compress: quality, format: saveFormat },
    );

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      compressed: true,
    };
  } catch (e: any) {
    console.warn('[ImageCompressor] failed, fallback to original:', e?.message);
    return { uri, width: 0, height: 0, compressed: false };
  }
}

/**
 * Convenience: nén ảnh avatar (vuông, nhỏ).
 */
export function compressAvatar(uri: string): Promise<CompressResult> {
  return compressImage(uri, { maxWidth: 512, quality: 0.85, format: 'webp' });
}
