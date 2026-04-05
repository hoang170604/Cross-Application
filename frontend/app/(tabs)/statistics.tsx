import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

// ─── Import Atomic Hooks & Components ─────────────────────────────────────────
import { useNutrition, useFasting } from '@/src/hooks';
import { PhysiologyStatsCard } from '@/src/components/organisms/PhysiologyStatsCard';
import { NutritionSummaryCard } from '@/src/components/organisms/NutritionSummaryCard';
import { WeightProgressCard } from '@/src/components/organisms/WeightProgressCard';

const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/**
 * Màn hình Thống kê (Statistics Dashboard)
 * Sử dụng kiến trúc Atomic để hiển thị các chỉ số dài hạn.
 */
export default function StatisticsScreen() {
  // Kết nối Hook Dinh dưỡng
  const { 
    userProfile, 
    totalEatenCalories, 
    tdee, 
    bmr, 
    bmi 
  } = useNutrition();

  // Kết nối Hook Nhịn ăn (nếu cần xử lý thêm logic)
  const { /* fasting related actions if any */ } = useFasting();

  const startWeight = userProfile.weight || 70;
  const currentWeight = userProfile.currentWeight !== undefined ? userProfile.currentWeight : startWeight;
  const targetWeight = userProfile.targetWeight || 65;

  // ═══════════════════════════════════════════════════
  // Logic nhóm dữ liệu (Aggregation) cho Biểu đồ Nhịn ăn
  // ═══════════════════════════════════════════════════
  const fastingDisplayData = useMemo(() => {
    const history = userProfile.fastingHistory || [];
    const dates = [];
    const curr = new Date();
    const day = curr.getDay(); // 0(CN)-6(T7)
    
    // Tìm mốc Thứ 2 của tuần hiện tại
    const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diffToMonday));
    
    // Tạo danh sách 7 ngày trong tuần
    for (let i = 0; i < 7; i++) {
       const d = new Date(monday);
       d.setDate(monday.getDate() + i);
       // Chuẩn hóa YYYY-MM-DD
       const isoDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
       dates.push(isoDate);
    }

    return dates.map((dateStr, idx) => {
      // Tìm record trong lịch sử (đã được xử lý qua splitFastingSession trước đó khi lưu)
      const record = history.find(s => s.id === dateStr);
      return {
        day: dayLabels[idx],
        hours: record ? Math.min(Math.round(record.durationHours * 10) / 10, 24) : 0
      };
    });
  }, [userProfile.fastingHistory]);

  const avgFastingHours = useMemo(() => {
    const validSessions = fastingDisplayData.filter(d => d.hours > 0);
    if (validSessions.length === 0) return 0;
    const total = validSessions.reduce((sum, d) => sum + d.hours, 0);
    return Math.round((total / validSessions.length) * 10) / 10;
  }, [fastingDisplayData]);

  // Giả lập lịch sử Calo (Trong thực tế sẽ lấy từ history array tương tự Fasting)
  const calorieHistory = useMemo(() => {
    return [0, 0, 0, 0, 0, 0, totalEatenCalories || 0];
  }, [totalEatenCalories]);

  const { width } = Dimensions.get('window');
  const chartWidth = width - 96;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THỐNG KÊ</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Tuần</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>Tháng</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 24 }} 
        contentContainerStyle={{ paddingBottom: 24 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Organism: Chỉ số sinh lý */}
        <PhysiologyStatsCard tdee={tdee} bmr={bmr} bmi={bmi} />

        {/* Organism: Tóm tắt dinh dưỡng ngày */}
        <NutritionSummaryCard consumed={totalEatenCalories} target={tdee} />

        {/* Lịch sử nhịn ăn (Biểu đồ Cột) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Lịch sử nhịn ăn</Text>
          <Text style={styles.chartSubTitle}>Tổng kết 7 ngày gần nhất</Text>

          <View style={styles.legendRow}>
             <View style={styles.legendItem}>
               <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
               <Text style={styles.legendText}>Đã nhịn</Text>
             </View>
             <View style={styles.legendItem}>
               <View style={[styles.dot, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' }]} />
               <Text style={styles.legendText}>Mục tiêu (16h)</Text>
             </View>
          </View>

          <View style={styles.barChartRow}>
            <View style={styles.yAxis}>
              {['16h', '12h', '8h', '4h', '0h'].map(h => (
                <Text key={h} style={styles.yAxisText}>{h}</Text>
              ))}
            </View>
            <View style={styles.barArea}>
              <View style={styles.barGrid}>
                {[0, 0.25, 0.5, 0.75, 1].map(r => (
                  <View key={r} style={[styles.gridLine, { bottom: 20 + r * 160 }]} />
                ))}
              </View>
              <View style={styles.barsContainer}>
                {fastingDisplayData.map((record, idx) => {
                  const actualHeight = Math.min((record.hours / 16) * 160, 200);
                  return (
                    <View key={idx} style={styles.barColumn}>
                      <View style={styles.barTrack}>
                         <View style={styles.barBackground} />
                         <View style={[styles.barFill, { height: actualHeight, backgroundColor: '#F59E0B' }]} />
                      </View>
                      <Text style={styles.xAxisLabel}>{record.day}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.statsSummarySection}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Tổng cộng</Text>
              <Text style={styles.summaryValue}>
                {fastingDisplayData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} <Text style={styles.summaryUnit}>giờ</Text>
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Trung bình</Text>
              <Text style={styles.summaryValue}>
                {avgFastingHours} <Text style={styles.summaryUnit}>giờ</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Lịch sử nạp Calo (Biểu đồ Đường) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Lịch sử nạp Calo</Text>
          <View style={{ marginLeft: -12 }}>
            <LineChart
              data={{
                labels: dayLabels,
                datasets: [
                  {
                    data: calorieHistory.map(c => c || 0.1),
                    color: () => '#00C48C',
                    strokeWidth: 3,
                  },
                  {
                    // Trick để scale biểu đồ đúng mốc TDEE trung bình
                    data: [3500],
                    color: () => 'transparent',
                    strokeWidth: 0,
                    withDots: false
                  }
                ],
              }}
              width={chartWidth + 12}
              height={220}
              fromZero
              segments={3}
              yLabelsOffset={16}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 196, 140, ${opacity})`,
                labelColor: () => '#94A3B8',
                propsForBackgroundLines: {
                  strokeDasharray: "4",
                  stroke: "#F1F5F9",
                },
              }}
              bezier={false}
              style={{ borderRadius: 24 }}
              getDotProps={(value, index) => {
                if (value === 3500 || value <= 0.1) return { r: "0" };
                return {
                  r: index === 6 ? "7" : "5",
                  stroke: "#00C48C",
                  strokeWidth: index === 6 ? "3" : "0",
                  fill: index === 6 ? "#fff" : "#00C48C"
                };
              }}
              renderDotContent={({ x, y, index, indexData }) => {
                if (indexData === 3500 || indexData <= 0.1) return null;
                if (index !== 6) return null; // Chỉ hiện tooltip cho ngày hôm nay
                return (
                  <View 
                    key={index} 
                    style={{ 
                      position: 'absolute', 
                      top: y - 36, 
                      left: x - 20, 
                      backgroundColor: '#1E293B', 
                      paddingHorizontal: 8, 
                      paddingVertical: 4, 
                      borderRadius: 8 
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>
                      {Math.round(indexData as number)}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>

        {/* Organism: Tiến độ Cân nặng */}
        <WeightProgressCard 
            currentWeight={currentWeight}
            startWeight={startWeight}
            targetWeight={targetWeight}
            goal={userProfile.goal || 'lose'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F9FAFB' },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 2, marginBottom: 24, color: '#1E293B' },
  tabContainer: { flexDirection: 'row', gap: 12 },
  activeTab: { paddingHorizontal: 32, paddingVertical: 10, backgroundColor: '#00C48C', borderRadius: 999, shadowColor: '#00C48C', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  activeTabText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  inactiveTab: { paddingHorizontal: 32, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 999, borderWidth: 1, borderColor: '#F1F5F9' },
  inactiveTabText: { color: '#94A3B8', fontWeight: '700', fontSize: 14 },
  chartCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  chartTitle: { fontWeight: '800', fontSize: 16, color: '#1E293B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  chartSubTitle: { fontSize: 13, fontWeight: '600', color: '#94A3B8', marginBottom: 20 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  barChartRow: { flexDirection: 'row', height: 190, marginTop: 12, marginBottom: 24 },
  yAxis: { width: 28, justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20 },
  yAxisText: { fontSize: 11, color: '#94A3B8', fontWeight: '800' },
  barArea: { flex: 1, position: 'relative', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 20 },
  barGrid: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 20 },
  gridLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderTopColor: '#F1F5F9', borderStyle: 'dotted' },
  barsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginLeft: 8 },
  barColumn: { alignItems: 'center', width: 32 },
  barTrack: { width: 12, height: 160, justifyContent: 'flex-end', position: 'relative' },
  barBackground: { position: 'absolute', bottom: 0, width: '100%', height: 160, backgroundColor: '#F1F5F9', borderRadius: 999 },
  barFill: { position: 'absolute', bottom: 0, width: '100%', borderRadius: 999 },
  xAxisLabel: { fontSize: 11, fontWeight: '800', color: '#64748B', marginTop: 8 },
  statsSummarySection: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  summaryBox: { flex: 1, backgroundColor: '#FFFBEB', borderRadius: 20, padding: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: '#B45309', fontWeight: '800', marginBottom: 4, textTransform: 'uppercase' },
  summaryValue: { fontSize: 24, fontWeight: '900', color: '#B45309' },
  summaryUnit: { fontSize: 13, fontWeight: '700' },
});
