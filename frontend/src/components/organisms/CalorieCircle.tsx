/**
 * @file CalorieCircle.tsx
 * @description Sinh vật (Organism) biểu đồ vòng tròn Calo trung tâm.
 * Hiển thị các chỉ số Đã nạp, Vượt mức/Còn lại, và Đốt cháy.
 * Thiết kế cao cấp với Hiệu ứng đổ bóng và Màu sắc hài hòa.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

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

/**
 * Hiển thị khối thông tin Calo chủ đạo với biểu đồ vòng tròn cao cấp.
 */
export const CalorieCircle: React.FC<CalorieCircleProps> = ({
  consumed,
  burned,
  remaining,
  isOver,
  progress
}) => {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      {/* Cột trái: Đã nạp */}
      <View style={styles.statsColumn}>
        <Text style={styles.statsValue}>{consumed.toLocaleString()}</Text>
        <Text style={styles.statsLabel}>Đã nạp</Text>
      </View>

      {/* Trung tâm: Vòng tròn SVG */}
      <View style={[styles.circleWrapper, { width: size, height: size }]}>
        {/* Đổ bóng ngoài (Subtle Shadow) */}
        <View style={[styles.shadowRing, { width: size - 10, height: size - 10, borderRadius: size / 2 }]} />
        
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
            stroke="#F1F5F9"
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
          <Text style={[styles.remainingValue, { color: isOver ? '#F43F5E' : '#111827' }]}>
            {isOver ? `-${remaining}` : remaining.toLocaleString()}
          </Text>
          <Text style={styles.remainingLabel}>
            {isOver ? 'Vượt mức' : 'Còn lại'}
          </Text>
        </View>
      </View>

      {/* Cột phải: Đốt cháy */}
      <View style={styles.statsColumn}>
        <Text style={styles.statsValue}>{burned.toLocaleString()}</Text>
        <Text style={styles.statsLabel}>Đốt cháy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  statsColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statsValue: {
    fontSize: 22, 
    fontWeight: '800', 
    color: '#1E293B',
  },
  statsLabel: {
    fontSize: 12, 
    color: '#64748B', 
    marginTop: 4, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowRing: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  centerTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingValue: {
    fontSize: 26, 
    fontWeight: '900',
  },
  remainingLabel: {
    fontSize: 12, 
    color: '#64748B', 
    marginTop: 2, 
    fontWeight: '700',
  },
});
