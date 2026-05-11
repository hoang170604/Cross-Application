
/**
 * @file CalorieCircle.tsx
 * @description Sinh vật (Organism) biểu đồ vòng tròn Calo trung tâm.
 * Hiển thị các chỉ số Đã nạp, Vượt mức/Còn lại, và Đốt cháy.
 * Căn chỉnh chính xác ra giữa màn hình và tối ưu hiệu ứng hình ảnh.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

interface CalorieCircleProps {
  /** Lượng Calo đã nạp (kcal) */
  consumed: number;
  /** Lượng Calo đã đốt cháy (kcal) */
  burned: number;
  /** Lượng Calo còn lại hoặc vượt mức (kcal) */
  remaining: number;
  /** Trạng thái có đang vượt mức Calo không */
  isOver: boolean;
  /** Tỷ lệ tiến trình (0 đến 1) */
  progress: number;
}

export const CalorieCircle: React.FC<CalorieCircleProps> = ({
  consumed,
  burned,
  remaining,
  isOver,
  progress
}) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const safeProgress = isNaN(progress) ? 0 : Math.min(1, Math.max(0, progress));
  const strokeDashoffset = circumference * (1 - safeProgress);

  return (
    <View style={styles.container}>
      {/* Cột trái: Đã nạp */}
      <View style={styles.statsColumn}>
        <Text style={styles.statsValue}>{(consumed || 0).toLocaleString()}</Text>
        <Text style={styles.statsLabel}>Đã nạp</Text>
      </View>

      {/* Trung tâm: Vòng tròn SVG */}
      <View style={styles.circleContainer}>
        <View style={[styles.circleWrapper, { width: size, height: size }]}>
          {/* Subtle Glow/Shadow Layer (Rounded) */}
          <View style={[styles.shadowRing, { width: size - 8, height: size - 8, borderRadius: (size - 8) / 2 }]} />
          
          <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={isOver ? '#F43F5E' : '#10B981'} stopOpacity="1" />
                <Stop offset="100%" stopColor={isOver ? '#FB7185' : '#34D399'} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            
            {/* Vòng nền (Track) */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.isDark ? '#262626' : '#F0F0F0'}
              strokeWidth={strokeWidth - 2}
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Vòng tiến trình (Progress) */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#grad)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${strokeDashoffset}`}
              strokeLinecap="round"
            />
          </Svg>

          {/* Chữ trung tâm */}
          <View style={styles.centerTextOverlay}>
            <Text style={[styles.remainingValue, { color: isOver ? colors.danger : colors.text }]}>
              {Math.abs(remaining).toLocaleString()}
            </Text>
            <Text style={styles.remainingLabel}>
              {isOver ? 'Vượt mức' : 'Còn lại'}
            </Text>
          </View>
        </View>
      </View>

      {/* Cột phải: Đốt cháy */}
      <View style={styles.statsColumn}>
        <Text style={styles.statsValue}>{(burned || 0).toLocaleString()}</Text>
        <Text style={styles.statsLabel}>Đốt cháy</Text>
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  statsColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    flex: 1.5, // Tỉ lệ chiều rộng lớn hơn cho khối giữa để đảm bảo căn giữa chính xác
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowRing: {
    position: 'absolute',
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    // borderRadius được set inline dựa trên size
  },
  statsValue: {
    fontSize: 20, 
    fontWeight: '800', 
    color: colors.text,
  },
  statsLabel: {
    fontSize: 12, 
    color: colors.textSecondary, 
    marginTop: 4, 
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  centerTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingValue: {
    fontSize: 28, 
    fontWeight: '900',
    letterSpacing: -1,
  },
  remainingLabel: {
    fontSize: 12, 
    color: colors.textSecondary, 
    marginTop: 2, 
    fontWeight: '700',
  },
});
