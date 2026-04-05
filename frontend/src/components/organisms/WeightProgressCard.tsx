/**
 * @file WeightProgressCard.tsx
 * @description Sinh vật (Organism) thẻ tiến độ cân nặng.
 * Chuyển đổi từ TextInput sang Stepper (+/-) để tối ưu UX và tránh lỗi bàn phím.
 * Hỗ trợ nhấn giữ (Long Press) để thay đổi nhanh và rung phản hồi (Haptics).
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform 
} from 'react-native';
import { ProgressBar } from '../atoms/ProgressBar';
import { IconButton } from '../atoms/IconButton';
import * as Haptics from 'expo-haptics';

interface WeightProgressCardProps {
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  goal: string;
  onUpdateWeight?: (weight: number) => void;
}

const WeightProgressCardComponent: React.FC<WeightProgressCardProps> = ({
  currentWeight,
  startWeight,
  targetWeight,
  goal,
  onUpdateWeight
}) => {
  const [displayWeight, setDisplayWeight] = useState(currentWeight);
  const timerRef = useRef<any>(null);

  // Đồng bộ hóa khi giá trị từ props thay đổi (ví dụ: từ màn hình khác)
  useEffect(() => {
    setDisplayWeight(currentWeight);
  }, [currentWeight]);

  const isLose = goal === 'lose_weight' || goal === 'lose';
  const isGain = goal === 'gain_muscle' || goal === 'gain';
  
  // Tính toán tiến độ
  const progress = useMemo(() => {
    if (startWeight === targetWeight) return 100;
    if (isLose) {
      return Math.max(0, Math.min(100, ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100));
    } else if (isGain) {
      return Math.max(0, Math.min(100, ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100));
    }
    return 100;
  }, [startWeight, targetWeight, currentWeight, isLose, isGain]);

  const diff = currentWeight - startWeight;
  const diffPrefix = diff > 0 ? '+' : '';
  const displayDiff = diff.toFixed(1);

  // ── Logic Stepper ─────────────────────────────────────────────────────────

  const updateWeight = useCallback((delta: number) => {
    setDisplayWeight(prev => {
      const next = parseFloat((prev + delta).toFixed(1));
      if (next <= 20 || next >= 300) return prev; // Giới hạn an toàn
      
      // Haptics nhẹ khi thay đổi nhanh
      if (delta !== 0) {
        Haptics.selectionAsync();
      }
      
      // Gọi callback cập nhật dữ liệu global
      onUpdateWeight?.(next);
      return next;
    });
  }, [onUpdateWeight]);

  const startContinuousUpdate = (delta: number) => {
    if (timerRef.current) return;
    updateWeight(delta);
    timerRef.current = setInterval(() => {
      updateWeight(delta);
    }, 100);
  };

  const stopContinuousUpdate = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopContinuousUpdate();
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tiến độ Cân nặng</Text>
      
      <View style={styles.stepperContainer}>
        <View style={styles.stepperRow}>
          {/* Nút Giảm */}
          <IconButton 
            iconName="remove" 
            onPress={() => updateWeight(-0.1)}
            onLongPress={() => startContinuousUpdate(-0.1)}
            onPressOut={stopContinuousUpdate}
            backgroundColor="#F3F4F6"
          />

          {/* Hiển thị số cân nặng trung tâm */}
          <View style={styles.weightDisplay}>
            <Text style={styles.weightValue}>{displayWeight.toFixed(1)}</Text>
            <Text style={styles.weightUnit}>kg</Text>
          </View>

          {/* Nút Tăng */}
          <IconButton 
            iconName="add" 
            onPress={() => updateWeight(0.1)}
            onLongPress={() => startContinuousUpdate(0.1)}
            onPressOut={stopContinuousUpdate}
            backgroundColor="#00C48C"
            color="#FFFFFF"
          />
        </View>

        <Text style={[
          styles.diffText, 
          { color: diff <= 0 && isLose ? '#00C48C' : diff >= 0 && isGain ? '#00C48C' : '#64748B' }
        ]}>
          {diffPrefix}{displayDiff} kg kể từ khi bắt đầu
        </Text>
      </View>

      <View style={styles.progressSection}>
        <ProgressBar progress={progress / 100} fillColor="#00C48C" height={10} />
        <View style={styles.labelRow}>
          <Text style={styles.label}>Bắt đầu: {startWeight.toFixed(1)} kg</Text>
          <Text style={styles.label}>Mục tiêu: {targetWeight.toFixed(1)} kg</Text>
        </View>
      </View>
    </View>
  );
};

export const WeightProgressCard = React.memo(WeightProgressCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontWeight: '800',
    marginBottom: 20,
    fontSize: 13,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepperContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 8,
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 120,
    justifyContent: 'center',
  },
  weightValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1E293B',
  },
  weightUnit: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 4,
  },
  diffText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
