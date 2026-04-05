/**
 * @file WorkoutChallengeCard.tsx
 * @description Sinh vật (Organism) thẻ thách thức vận động.
 * Quản lý cả giao diện cảnh báo vượt Calo và bộ đếm ngược thời gian thực.
 * Thiết kế cao cấp với Hiệu ứng Gradient và Đổ bóng Glow.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutChallengeState } from '@/src/types';
import { ProgressBar } from '../atoms/ProgressBar';
import { AppButton } from '../atoms/AppButton';

interface WorkoutChallengeCardProps {
  /** Trạng thái thử thách hiện tại */
  challenge?: WorkoutChallengeState;
  /** Lượng Calo vượt mức (dùng khi thử thách chưa bắt đầu) */
  remainingDisplay?: number;
  /** Số phút đi bộ quy đổi */
  walkMinutes?: number;
  /** Số phút chạy bộ quy đổi */
  jogMinutes?: number;
  /** Hàm bắt đầu thử thách */
  onStart: () => void;
  /** Hàm tạm dừng/tiếp tục */
  onPauseResume: () => void;
  /** Hàm dừng hẳn/hủy */
  onCancel: () => void;
  /** Hàm khi thời gian kết thúc */
  onComplete: () => void;
}

/**
 * Hiển thị thẻ Thách thức vận động (Cảnh báo hoặc Đếm ngược).
 */
export const WorkoutChallengeCard: React.FC<WorkoutChallengeCardProps> = ({
  challenge,
  remainingDisplay = 0,
  walkMinutes = 0,
  jogMinutes = 0,
  onStart,
  onPauseResume,
  onCancel,
  onComplete
}) => {
  // ─── Logic Đếm ngược thời gian thực (Isolated Tick) ────────────────────
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!challenge?.isActive || challenge?.isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const elapsed = challenge.accumulatedMs + (Date.now() - challenge.lastResumeTime);
      if (elapsed >= challenge.targetMs) {
        clearInterval(intervalRef.current!);
        onComplete();
      } else {
        setTick(t => t + 1);
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [challenge?.isActive, challenge?.isPaused, challenge?.lastResumeTime, challenge?.accumulatedMs, challenge?.targetMs, onComplete]);

  // Nếu thử thách ĐÃ HOẠT ĐỘNG -> Chế độ Đếm ngược
  if (challenge?.isActive) {
    const elapsedNow = challenge.isPaused ? 0 : (Date.now() - challenge.lastResumeTime);
    const totalElapsed = challenge.accumulatedMs + elapsedNow;
    const remainingMs = Math.max(0, challenge.targetMs - totalElapsed);
    const progress = Math.min(1, totalElapsed / challenge.targetMs);
    const totalSec = Math.floor(remainingMs / 1000);
    const mm = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const ss = (totalSec % 60).toString().padStart(2, '0');

    return (
      <View style={[styles.card, styles.activeCard]}>
        <View style={styles.header}>
          <Text style={styles.activeTitle}>🎯 THỬ THÁCH VẬN ĐỘNG</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: challenge.isPaused ? '#F59E0B' : '#10B981' }]} />
            <Text style={styles.statusText}>{challenge.isPaused ? 'Đang tạm dừng' : 'Đang hoạt động'}</Text>
          </View>
        </View>

        <View style={styles.timerWrapper}>
          <Text style={styles.timerText}>{mm}:{ss}</Text>
          <Text style={styles.timerSubText}>Sẽ đốt cháy ~{challenge.calorieTarget} kcal</Text>
        </View>

        <View style={styles.progWrapper}>
          <ProgressBar progress={progress} fillColor="#F59E0B" height={10} />
          <Text style={styles.progText}>{Math.floor(progress * 100)}% hoàn thành</Text>
        </View>

        <View style={styles.actionRow}>
          <AppButton 
            title={challenge.isPaused ? 'Tiếp tục' : 'Tạm dừng'} 
            onPress={onPauseResume} 
            variant="primary"
            style={styles.cardActionBtn}
          />
          <AppButton 
            title="Dừng" 
            onPress={onCancel} 
            variant="secondary"
            style={styles.cardStopBtn}
          />
        </View>
      </View>
    );
  }

  // Nếu thử thách CHƯA HOẠT ĐỘNG -> Chế độ Cảnh báo
  return (
    <View style={[styles.card, styles.warningCard]}>
      <View style={styles.warningIconWrapper}>
        <Ionicons name="warning" size={24} color="#E11D48" />
      </View>
      
      <Text style={styles.warningTitle}>BẠN VƯỢT MỤC TIÊU {remainingDisplay.toLocaleString()} KCAL</Text>
      <Text style={styles.warningDesc}>
        Đừng lo lắng! Hãy đi bộ thêm khoảng <Text style={styles.highlight}>{walkMinutes} phút</Text> để cân bằng lại hôm nay.
        {walkMinutes > 120 && `\nHoặc chạy bộ cường độ cao trong ${jogMinutes} phút.`}
      </Text>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onStart}
        style={styles.startButton}
      >
        <Ionicons name="walk" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.startButtonText}>Bắt đầu đi bộ ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#1E293B',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  activeCard: {
    backgroundColor: '#1E293B', // Dark slate background
    borderColor: '#334155',
  },
  warningCard: {
    backgroundColor: '#FFF1F2', // Red-50 background
    borderColor: '#FECDD3',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  timerWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 54,
    fontWeight: '900',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  timerSubText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: -4,
    fontWeight: '600',
  },
  progWrapper: {
    width: '100%',
    marginVertical: 20,
  },
  progText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardActionBtn: {
    flex: 2,
  },
  cardStopBtn: {
    flex: 1,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: '#F43F5E',
  },
  warningIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#9F1239',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  warningDesc: {
    fontSize: 13,
    color: '#BE123C',
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  highlight: {
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#E11D48',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
