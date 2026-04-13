/**
 * @file ProgressBar.tsx
 * @description Nguyên tử (Atom) thanh tiến trình đơn giản.
 * Phản ánh % tiến trình thực hiện của một chỉ số bất kỳ.
 */

import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';

interface ProgressBarProps {
  /** Giá trị tiến trình từ 0 đến 1 */
  progress: number;
  /** Màu sắc vạch tiến trình (mặc định: xanh lá NutriTrack) */
  fillColor?: string;
  /** Độ cao của thanh (mặc định: 8) */
  height?: number;
  /** Độ bo góc (mặc định: 999 - hình trụ) */
  borderRadius?: number;
  /** Màu nền thanh (mặc định: xám nhạt) */
  backgroundColor?: string;
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({
  progress,
  fillColor = '#00C48C',
  height = 8,
  borderRadius = 999,
  backgroundColor = '#F1F5F9'
}) => {
  // Đảm bảo progress luôn nằm trong khoảng [0, 1]
  const validatedProgress = Math.max(0, Math.min(1, progress));
  const widthPercent = `${(validatedProgress * 100).toFixed(1)}%` as DimensionValue;

  return (
    <View style={[styles.container, { backgroundColor, height, borderRadius }]}>
      <View 
        style={[
          styles.fill, 
          { 
            width: widthPercent, 
            backgroundColor: fillColor,
            borderRadius 
          }
        ]} 
      />
    </View>
  );
};

/**
 * Thành phần Thanh tiến trình (ProgressBar) - Luôn được Memoize để tối ưu hiệu năng.
 */
export const ProgressBar = React.memo(ProgressBarComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
