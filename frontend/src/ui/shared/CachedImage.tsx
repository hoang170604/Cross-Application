/**
 * @file CachedImage.tsx
 * @description Wrapper mỏng quanh `expo-image` với cache mặc định (memory + disk)
 * + transition mượt khi load. Mục tiêu là chuẩn hoá cách app hiển thị ảnh từ
 * URL/local để tránh re-download mỗi lần.
 *
 * Dùng kèm `compressImage()` (src/utils/imageCompressor.ts) khi upload để
 * giảm bandwidth + tăng tốc cache hit.
 */

import React from 'react';
import { Image, ImageProps, ImageSource } from 'expo-image';
import { StyleProp, ImageStyle } from 'react-native';

export interface CachedImageProps extends Omit<ImageProps, 'source' | 'style'> {
  /** URI ảnh — string hoặc object `{ uri }`. Nhận cả `require()` cho ảnh local. */
  source: string | number | ImageSource | ImageSource[] | null | undefined;
  style?: StyleProp<ImageStyle>;
  /**
   * Chính sách cache — mặc định `memory-disk` (giữ ảnh ngay cả khi đóng app).
   * Truyền `none` để bypass cache (debug, screenshot test).
   */
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
}

const DEFAULT_CACHE_POLICY = 'memory-disk' as const;
const DEFAULT_TRANSITION_MS = 200;

/**
 * `<CachedImage source={uri} style={...} />`
 *
 * - Memory + disk cache mặc định (file `expo-image` lo việc dọn dẹp).
 * - Fade-in 200ms khi đổi source.
 * - Tự suy ra `{ uri }` từ string.
 */
export const CachedImage: React.FC<CachedImageProps> = ({
  source,
  style,
  cachePolicy = DEFAULT_CACHE_POLICY,
  transition = DEFAULT_TRANSITION_MS,
  contentFit = 'cover',
  ...rest
}) => {
  const normalizedSource: any =
    typeof source === 'string' ? { uri: source } : source;

  return (
    <Image
      source={normalizedSource}
      style={style as any}
      cachePolicy={cachePolicy}
      transition={transition}
      contentFit={contentFit}
      {...rest}
    />
  );
};

export default CachedImage;
