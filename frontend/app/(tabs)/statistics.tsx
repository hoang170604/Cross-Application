import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

// ─── Import Atomic Hooks & Components ─────────────────────────────────────────
import { useNutrition, useFasting } from '@/src/hooks';
import { PhysiologyStatsCard } from '@/src/components/organisms/PhysiologyStatsCard';
import { NutritionSummaryCard } from '@/src/components/organisms/NutritionSummaryCard';
import WeightHistoryChart from '@/src/components/organisms/WeightHistoryChart';
import { FastingHistoryChart } from '@/src/components/organisms/FastingHistoryChart';

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

  // Kết nối Hook Nhịn ăn
  const { /* fasting related actions if any */ } = useFasting();

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
      // Tìm record trong lịch sử
      const record = history.find(s => s.id === dateStr);
      return {
        day: dayLabels[idx],
        hours: record ? Math.min(Math.round(record.durationHours * 10) / 10, 24) : 0
      };
    });
  }, [userProfile.fastingHistory]);

  // Giả lập lịch sử Calo
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Organism: Chỉ số sinh lý */}
        <PhysiologyStatsCard tdee={tdee} bmr={bmr} bmi={bmi} />

        {/* Organism: Tóm tắt dinh dưỡng ngày */}
        <NutritionSummaryCard consumed={totalEatenCalories} target={tdee} />

        {/* 📊 Organism: Biểu đồ lịch sử nhịn ăn (Dynamic Scaling) */}
        <FastingHistoryChart 
          data={fastingDisplayData} 
          goal={userProfile.fastingGoal || 16} 
        />

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
                if (index !== 6) return null;
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

        {/* 📉 Organism: Biểu đồ xu hướng cân nặng */}
        <WeightHistoryChart 
            history={userProfile.weightHistory}
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
});
