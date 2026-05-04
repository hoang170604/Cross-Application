/**
 * @file FastingTimerCard.tsx
 * @description Sinh vật (Organism) thẻ thông tin nhịn ăn gián đoạn.
 * Bao gồm đồng hồ đếm tiến SVG, trạng thái sinh học, và nút hành động chính.
 * Mọi logic countdown hình ảnh được cô lập để tối ưu hiệu năng.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppButton } from './core/AppButton';

interface FastingTimerCardProps {
  /** Trạng thái nhịn ăn */
  isFasting: boolean;
  /** Trạng thái chi tiết: FASTING | EATING | IDLE */
  fastingState: string;
  /** Thời gian bắt đầu (ms) */
  startTime: number | null;
  /** Mục tiêu nhịn ăn (giờ) */
  activeGoal: number;
  /** Màu sắc theo giai đoạn sinh học */
  stageColor: string;
  /** Badge giai đoạn (VD: Tiêu hóa, Đốt mỡ...) */
  stageBadge: string;
  /** Tiêu đề giai đoạn */
  stageTitle: string;
  /** Mô tả giai đoạn */
  stageDesc: string;
  /** Nhãn nút bấm */
  buttonText: string;
  /** Màu nút bấm */
  buttonColor: string;
  /** Sự kiện khi nhấn nút chính */
  onMainAction: () => void;
}

/**
 * Hiển thị thẻ Nhịn ăn với vòng tròn SVG và đồng hồ thời gian thực.
 */
export const FastingTimerCard: React.FC<FastingTimerCardProps> = ({
  isFasting,
  fastingState,
  startTime,
  activeGoal,
  stageColor,
  stageBadge,
  stageTitle,
  stageDesc,
  buttonText,
  buttonColor,
  onMainAction
}) => {
  // ─── Logic Tick thời gian thực (Isolated) ──────────────────────────
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isFasting) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isFasting]);

  const now = Date.now();
  const clockStart = startTime || now;
  const elapsedMs = isFasting ? Math.max(0, now - clockStart) : 0;
  
  const targetMs = (fastingState === 'EATING' ? (24 - activeGoal) : activeGoal) * 60 * 60 * 1000;
  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / targetMs) * 100));
  
  const size = 256;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const getMascot = () => {
    if (fastingState === 'EATING') return '🥗';
    if (activeGoal <= 14) return '🐱';
    if (activeGoal <= 16) return '🦊';
    if (activeGoal <= 18) return '🐯';
    if (activeGoal <= 20) return '🦁';
    return '🐉';
  };

  return (
    <View style={styles.card}>
      {/* Vòng tròn SVG */}
      <View style={[styles.circleWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle 
            cx={size / 2} cy={size / 2} r={radius} 
            stroke="#F1F5F9" strokeWidth={strokeWidth} fill="none" 
          />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={isFasting ? stageColor : "#10B981"} 
            strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - (isFasting && !isNaN(progressPercent) ? progressPercent / 100 : 0))}`}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.centerOverlay}>
          <Text style={styles.mascot}>{getMascot()}</Text>
          <Text style={styles.timerText}>{formatTime(elapsedMs)}</Text>
          <View style={[styles.badge, { backgroundColor: !isFasting ? '#F1F5F9' : stageColor }]}>
            <Text style={[styles.badgeText, { color: !isFasting ? '#6B7280' : '#fff' }]}>
              {stageBadge}
            </Text>
          </View>
          <Text style={styles.targetLabel}>
            Mục tiêu: {fastingState === 'EATING' ? (24 - activeGoal) : activeGoal}h
          </Text>
        </View>
      </View>

      {/* Thông tin sinh học */}
      <View style={styles.infoBox}>
        <Text style={[styles.infoTitle, { color: stageColor }]}>{stageTitle}</Text>
        <Text style={styles.infoDesc}>{stageDesc}</Text>
      </View>

      {/* Nút hành động */}
      <AppButton 
        title={buttonText} 
        onPress={onMainAction} 
        variant={fastingState === 'FASTING' ? 'danger' : 'primary'}
        style={{ width: '100%', shadowColor: buttonColor, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  circleWrapper: {
    marginBottom: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    fontSize: 36,
    marginBottom: 8,
  },
  timerText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  },
});
