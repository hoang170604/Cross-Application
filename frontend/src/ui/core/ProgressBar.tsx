/**
 * @file ProgressBar.tsx
 * @description Nguyên tử (Atom) thanh tiến trình đơn giản.
 * Phản ánh % tiến trình thực hiện của một chỉ số bất kỳ.
 * 
 * ĐÃ SỬA: Thêm Animated.timing để thanh tiến trình chuyển động
 * mượt mà thay vì nhảy cạch giữa các giá trị.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';

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
  /** Thời gian animation mili-giây (mặc định: 400) */
  animationDuration?: number;
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({
  progress,
  fillColor = '#00C48C',
  height = 8,
  borderRadius = 999,
  backgroundColor = '#F1F5F9',
  animationDuration = 400,
}) => {
  // Đảm bảo progress luôn nằm trong khoảng [0, 1]
  const validatedProgress = Math.max(0, Math.min(1, progress));

  // Sử dụng Animated.Value để nội suy mượt mà
  const animatedWidth = useRef(new Animated.Value(validatedProgress)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: validatedProgress,
      duration: animationDuration,
      useNativeDriver: false, // width không hỗ trợ native driver
    }).start();
  }, [validatedProgress, animationDuration]);

  // Chuyển đổi giá trị 0-1 sang phần trăm cho interpolate
  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor, height, borderRadius }]}>
      <Animated.View 
        style={[
          styles.fill, 
          { 
            width: widthInterpolated, 
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
