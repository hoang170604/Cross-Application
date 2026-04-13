/**
 * @file FastingHistoryChart.tsx
 * @description Sinh vật (Organism) biểu đồ cột hiển thị lịch sử nhịn ăn.
 * Hỗ trợ Scaling trục Y động (Dynamic Max Value) và bao bọc chống tràn (Overflow Hidden).
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FastingHistoryChartProps {
  /** Dữ liệu hiển thị (7 ngày gần nhất) */
  data: { day: string; hours: number }[];
  /** Mục tiêu nhịn ăn (mặc định 16h) */
  goal?: number;
}

const CHART_HEIGHT = 160;

export const FastingHistoryChart: React.FC<FastingHistoryChartProps> = ({ 
  data, 
  goal = 16 
}) => {
  // 1. XỬ LÝ SCALING (TRỤC Y ĐỘNG)
  const { maxValue, segments } = useMemo(() => {
    const maxHours = Math.max(...data.map(d => d.hours), 0);
    
    // Thuật toán: Nếu max > goal, lấy max + 2. Nếu < goal, lấy goal + 4 (VD: 20h)
    let max = maxHours > goal ? maxHours + 2 : goal + 4;
    max = Math.ceil(max / 4) * 4; // Làm tròn lên để chia hết cho 4 segment

    return {
      maxValue: max,
      segments: [max, (max * 3) / 4, max / 2, max / 4, 0]
    };
  }, [data, goal]);

  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);
  const avgHours = data.length > 0 ? (totalHours / data.filter(d => d.hours > 0).length || 1) : 0;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Lịch sử nhịn ăn (giờ)</Text>
      <Text style={styles.chartSubTitle}>Tổng kết 7 ngày gần nhất</Text>

      {/* Legend & Title Spacing Fix */}
      <View style={styles.legendRow}>
         <View style={styles.legendItem}>
           <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
           <Text style={styles.legendText}>Đã nhịn</Text>
         </View>
         <View style={styles.legendItem}>
           <View style={[styles.dot, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' }]} />
           <Text style={styles.legendText}>Mục tiêu ({goal}h)</Text>
         </View>
      </View>

      {/* RÀNG BUỘC BỐ CỤC: Bọc khung biểu đồ để chống tràn (Overflow Hidden) */}
      <View style={styles.chartWrapper}>
        <View style={styles.barChartRow}>
          <View style={styles.yAxis}>
            {segments.map(val => (
              <Text key={val} style={styles.yAxisText}>{val}h</Text>
            ))}
          </View>
          
          <View style={styles.barArea}>
            <View style={styles.barGrid}>
              {segments.map((_, idx) => (
                <View 
                  key={idx} 
                  style={[styles.gridLine, { bottom: (idx * (CHART_HEIGHT / 4)) }]} 
                />
              ))}
            </View>
            
            <View style={styles.barsContainer}>
              {data.map((record, idx) => {
                // Tính toán chiều cao linh hoạt dựa trên maxValue
                const actualHeight = Math.min((record.hours / maxValue) * CHART_HEIGHT, CHART_HEIGHT);
                const goalHeight = (goal / maxValue) * CHART_HEIGHT;

                return (
                  <View key={idx} style={styles.barColumn}>
                    <View style={styles.barTrack}>
                       {/* Background bar hiển thị mục tiêu */}
                       <View style={[styles.barBackground, { height: goalHeight }]} />
                       {/* Bar thực tế chồng lên */}
                       <View style={[styles.barFill, { height: actualHeight, backgroundColor: '#F59E0B' }]} />
                    </View>
                    <Text style={styles.xAxisLabel}>{record.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* Thống kê tóm tắt */}
      <View style={styles.statsSummarySection}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Tổng cộng</Text>
          <Text style={styles.summaryValue}>
            {totalHours.toFixed(1)} <Text style={styles.summaryUnit}>h</Text>
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Trung bình</Text>
          <Text style={styles.summaryValue}>
            {avgHours.toFixed(1)} <Text style={styles.summaryUnit}>h</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: '#F3F4F6', 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 4, 
    elevation: 1 
  },
  chartTitle: { 
    fontWeight: '800', 
    fontSize: 16, 
    color: '#1E293B', 
    marginBottom: 4, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  chartSubTitle: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#94A3B8', 
    marginBottom: 16 
  },
  legendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    marginBottom: 24 
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5 
  },
  legendText: { 
    fontSize: 12, 
    color: '#64748B', 
    fontWeight: '700' 
  },
  chartWrapper: {
    height: 220,
    overflow: 'hidden', // QUAN TRỌNG: Bao bọc chống tràn
    borderRadius: 16,
    marginBottom: 16,
  },
  barChartRow: { 
    flexDirection: 'row', 
    height: CHART_HEIGHT + 30, // Thêm chỗ cho xAxis labels
    marginTop: 10
  },
  yAxis: { 
    width: 35, 
    height: CHART_HEIGHT,
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
  },
  yAxisText: { 
    fontSize: 11, 
    color: '#94A3B8', 
    fontWeight: '800' 
  },
  barArea: { 
    flex: 1, 
    position: 'relative', 
    height: CHART_HEIGHT,
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9',
  },
  barGrid: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    top: 0, 
    bottom: 0 
  },
  gridLine: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    borderStyle: 'dotted' 
  },
  barsContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'flex-end',
    zIndex: 1,
  },
  barColumn: { 
    alignItems: 'center', 
    width: 32 
  },
  barTrack: { 
    width: 14, 
    height: CHART_HEIGHT, 
    justifyContent: 'flex-end', 
    position: 'relative' 
  },
  barBackground: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    backgroundColor: '#F1F5F9', 
    borderRadius: 999 
  },
  barFill: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    borderRadius: 999 
  },
  xAxisLabel: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: '#64748B', 
    marginTop: 8,
    position: 'absolute',
    top: CHART_HEIGHT,
  },
  statsSummarySection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12 
  },
  summaryBox: { 
    flex: 1, 
    backgroundColor: '#FFFBEB', 
    borderRadius: 20, 
    padding: 16, 
    alignItems: 'center' 
  },
  summaryLabel: { 
    fontSize: 11, 
    color: '#B45309', 
    fontWeight: '800', 
    marginBottom: 4, 
    textTransform: 'uppercase' 
  },
  summaryValue: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#B45309' 
  },
  summaryUnit: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
});
