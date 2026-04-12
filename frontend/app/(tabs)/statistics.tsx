import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

// ─── Import Atomic Hooks & Components ─────────────────────────────────────────
import { useNutrition } from '@/src/hooks';
import apiClient from '@/src/api/apiClient';
import { PhysiologyStatsCard } from '@/src/components/organisms/PhysiologyStatsCard';
import { NutritionSummaryCard } from '@/src/components/organisms/NutritionSummaryCard';
import WeightHistoryChart from '@/src/components/organisms/WeightHistoryChart';

const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/**
 * Màn hình thống kê dữ liệu cá nhân hóa dài hạn.
 * 
 * Chức năng:
 * - Trực quan hóa dữ liệu dinh dưỡng thông qua các biểu đồ đồ thị.
 * - Hiển thị tóm lược các chỉ số sinh lý như TDEE, BMR, BMI.
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

  const [remoteWeightHistory, setRemoteWeightHistory] = useState(userProfile.weightHistory || []);
  const [remoteCalorieHistory, setRemoteCalorieHistory] = useState<number[]>([]);

  // Gọi API lấy thông tin dữ liệu thống kê
  useEffect(() => {
    const fetchStats = async () => {
      try {
          // 1. Lấy tóm tắt dinh dưỡng (ví dụ: Calo tuần trải dài 7 ngày)
          const summaryRes = await apiClient.get('/api/progress/summary');
          if (summaryRes.data && Array.isArray(summaryRes.data.calorieHistory)) {
              setRemoteCalorieHistory(summaryRes.data.calorieHistory);
          }

          // 2. Lấy lịch sử cân nặng thực tế từ DB
          const weightRes = await apiClient.get('/api/progress/weight-history');
          if (weightRes.data && Array.isArray(weightRes.data)) {
              setRemoteWeightHistory(weightRes.data);
          }
      } catch (error: any) {
          if (error.response?.status === 404) {
              console.warn('API chưa sẵn sàng ở BE, dùng Local Data');
              // Xử lý báo lỗi khi không thể lấy dữ liệu 7 ngày từ hệ thống trung tâm
              setRemoteCalorieHistory([]);
          }
      }
    };
    fetchStats();
  }, []);





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



        {/* Lịch sử nạp Calo (Biểu đồ Đường) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Lịch sử nạp Calo</Text>
          <View style={{ marginLeft: -12 }}>
            {remoteCalorieHistory && remoteCalorieHistory.length === 7 ? (
              <LineChart
                data={{
                  labels: dayLabels,
                  datasets: [
                    {
                      data: remoteCalorieHistory.map(c => c || 0.1),
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
            ) : (
              <Text style={{ textAlign: 'center', marginVertical: 40, color: '#9CA3AF', paddingLeft: 12 }}>
                Chưa có dữ liệu lịch sử Calo 7 ngày.
              </Text>
            )}
          </View>
        </View>

        {/* Biểu đồ xu hướng cân nặng */}
        <WeightHistoryChart 
            history={remoteWeightHistory}
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
