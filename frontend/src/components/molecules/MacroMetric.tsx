/**
 * @file MacroMetric.tsx
 * @description Phân tử (Molecule) hiển thị một chỉ số dinh dưỡng (Carbs, Protein, Fat).
 * Bao gồm tên chỉ số, thanh tiến trình và tỷ lệ giá trị hiện tại/mục tiêu.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../atoms/ProgressBar';

interface MacroMetricProps {
  /** Tên thành phần (VD: Tinh bột, Chất đạm...) */
  label: string;
  /** Giá trị hiện tại (g) */
  value: number;
  /** Giá trị mục tiêu (g) */
  total: number;
  /** Màu sắc đặc trưng của thành phần */
  color: string;
}

const MacroMetricComponent: React.FC<MacroMetricProps> = ({
  label,
  value,
  total,
  color
}) => {
  const progress = total > 0 ? value / total : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.progressWrapper}>
        <ProgressBar 
          progress={progress} 
          fillColor={color} 
          height={4} 
        />
        {/* Điểm nhấn thiết kế: Một vòng tròn nhỏ ở điểm cuối thanh tiến trình */}
        <View 
          style={[
            styles.dot, 
            { 
              backgroundColor: color, 
              left: `${Math.min(100, progress * 100)}%`,
              shadowColor: color,
            }
          ]} 
        />
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.totalText}> / {total} g</Text>
      </View>
    </View>
  );
};

/**
 * Thành phần Chỉ số dinh dưỡng đa lượng (MacroMetric) - Memoized.
 */
export const MacroMetric = React.memo(MacroMetricComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 13, 
    color: '#4B5563', 
    fontWeight: '600', 
    marginBottom: 12,
  },
  progressWrapper: {
    width: '100%',
    height: 10,
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    transform: [{ translateX: -5 }],
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: 12, 
    fontWeight: '700', 
    color: '#111827',
  },
  totalText: {
    fontSize: 12, 
    color: '#9CA3AF', 
    fontWeight: '500',
  },
});
