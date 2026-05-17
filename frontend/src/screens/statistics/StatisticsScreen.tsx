import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-gifted-charts';

// ─── Import Atomic Hooks & Components ─────────────────────────────────────────
import { useNutrition } from '@/src/hooks';
import apiClient from '@/src/api/apiClient';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';
import { PhysiologyStatsCard } from '@/src/ui/fasting/PhysiologyStatsCard';
import { NutritionSummaryCard } from '@/src/ui/diary/NutritionSummaryCard';

/**
 * Màn hình Thống kê sức khỏe nâng cao (Statistics / Dashboard Screen).
 *
 * Chức năng:
 * - Trực quan hóa 4 chỉ số quan trọng: Nước uống, Nhịn ăn, Calo nạp vào, Tiến trình Cân nặng.
 * - Hỗ trợ lọc thời gian linh hoạt giữa "Tuần này" và "Tháng này".
 * - Thiết kế giao diện cao cấp (Premium UI/UX) sử dụng các thẻ bo góc, đổ bóng mềm mại, 
 *   màu sắc HSL tối ưu, gradient màu mượt mà, và các đường nét đứt mục tiêu rõ ràng.
 * - Tương tác chạm thông minh (Tooltip hiển thị cân nặng, tiêu điểm cột dữ liệu).
 * - Sử dụng Mock Data chất lượng cao phục vụ review giao diện, sẵn sàng móc nối API thực tế.
 */
export default function StatisticsScreen() {
  // ─── ĐỒNG BỘ HOOKS & DỮ LIỆU CŨ ──────────────────────────────────────────────
  const { 
    userProfile, 
    calorieStats,
    bmr, 
    bmi 
  } = useNutrition();

  const [remoteWeightHistory, setRemoteWeightHistory] = useState(userProfile.weightHistory || []);
  const [remoteCalorieHistory, setRemoteCalorieHistory] = useState<number[]>([]);

  // Trì hoãn gọi API thực tế để đảm bảo mượt mà
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const summaryRes = await apiClient.get('/api/progress/summary');
        if (summaryRes.data && Array.isArray(summaryRes.data.calorieHistory)) {
          setRemoteCalorieHistory(summaryRes.data.calorieHistory);
        }

        const weightRes = await apiClient.get('/api/progress/weight-history');
        if (weightRes.data && Array.isArray(weightRes.data)) {
          setRemoteWeightHistory(weightRes.data);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn('API chưa sẵn sàng ở BE, dùng Local Mock Data');
          setRemoteCalorieHistory([]);
        }
      }
    };
    
    InteractionManager.runAfterInteractions(() => {
      fetchStats();
    });
  }, []);

  // ─── STATE QUẢN LÝ BỘ LỌC THỜI GIAN & TÙY CHỌN UI ─────────────────────────────
  const [timeFilter, setTimeFilter] = useState<'week' | 'month'>('week');
  const [showOverview, setShowOverview] = useState(false); // Collapsible cho phần chỉ số sinh lý cũ

  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = screenWidth - 48; // paddingHorizontal: 24 ở ScrollView
  const chartWidth = cardWidth - 32;  // paddingHorizontal: 16 ở Thẻ Card

  // ─── THIẾT LẬP MOCK DATA CHO CÁC BIỂU ĐỒ ──────────────────────────────────────

  // 1. Thống kê Nước uống (Water Tracking)
  const weeklyWaterData = [
    { value: 1800, label: 'T2', frontColor: '#3498db' },
    { value: 2200, label: 'T3', frontColor: '#2ecc71' }, // Highlight khi vượt mục tiêu
    { value: 1500, label: 'T4', frontColor: '#3498db' },
    { value: 2400, label: 'T5', frontColor: '#2ecc71' },
    { value: 2000, label: 'T6', frontColor: '#2ecc71' },
    { value: 1200, label: 'T7', frontColor: '#3498db' },
    { value: 2100, label: 'CN', frontColor: '#2ecc71' },
  ];

  const monthlyWaterData = [
    { value: 14200, label: 'T1', frontColor: '#3498db' }, // Tuần 1
    { value: 15800, label: 'T2', frontColor: '#2ecc71' },
    { value: 13500, label: 'T3', frontColor: '#3498db' },
    { value: 16100, label: 'T4', frontColor: '#2ecc71' },
  ];

  const activeWaterData = timeFilter === 'week' ? weeklyWaterData : monthlyWaterData;
  const waterTarget = timeFilter === 'week' ? 2000 : 14000; // 2000ml/ngày * 7 ngày
  const avgWater = Math.round(activeWaterData.reduce((acc, curr) => acc + curr.value, 0) / activeWaterData.length);

  // 2. Thống kê Nhịn ăn (Fasting Tracker) - Dùng cột dọc dạng viên thuốc giống mẫu (Pill-shaped Bar Chart)
  const weeklyFastingData = [
    { value: 16, label: 'T2' },
    { value: 14, label: 'T3' },
    { value: 18, label: 'T4' },
    { value: 16, label: 'T5' },
    { value: 12, label: 'T6' },
    { value: 15, label: 'T7' },
    { value: 16, label: 'CN' },
  ];

  const monthlyFastingData = [
    { value: 15.5, label: 'T1' },
    { value: 16.2, label: 'T2' },
    { value: 14.8, label: 'T3' },
    { value: 17.0, label: 'T4' },
  ];

  const rawFastingData = timeFilter === 'week' ? weeklyFastingData : monthlyFastingData;
  const fastingGoal = 16;
  
  // Tạo dữ liệu cột đôi (Grouped Bar Chart) sát nhau giống mẫu
  const activeFastingData: any[] = [];
  rawFastingData.forEach(item => {
    // Cột Thực tế (Trắng sáng)
    activeFastingData.push({
      value: item.value,
      frontColor: '#ffffff',
      label: item.label,
      spacing: 2, // Khoảng cách cực nhỏ để sát cột mục tiêu
      labelTextStyle: { color: colors.textSecondary, fontSize: 10, fontWeight: '700' }
    });
    // Cột Mục tiêu (Xám mờ, luôn cố định ở mức fastingGoal)
    activeFastingData.push({
      value: fastingGoal,
      frontColor: 'rgba(255, 255, 255, 0.15)',
      spacing: timeFilter === 'week' ? 14 : 36, // Khoảng cách giữa các ngày
    });
  });

  const totalFasting = rawFastingData.reduce((acc, curr) => acc + curr.value, 0);
  const avgFasting = (totalFasting / rawFastingData.length).toFixed(1);

  // 3. Thống kê Calo nạp vào (Calories Intake) - Biểu đồ đường vùng tô màu (Area Chart + Bezier)
  const weeklyCalorieData = [
    { value: 1850, label: 'T2' },
    { value: 2100, label: 'T3' },
    { value: 1950, label: 'T4' },
    { value: 2200, label: 'T5' },
    { value: 1750, label: 'T6' },
    { value: 2400, label: 'T7' },
    { value: 2000, label: 'CN' },
  ];

  // Mock dữ liệu 30 ngày cho tháng nạp calo
  const monthlyCalorieData = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const val = 1950 + Math.sin(day * 0.7) * 250 + (day % 3) * 60 + (index % 5 === 0 ? -120 : 70);
    return {
      value: Math.round(val),
      label: day % 5 === 0 || day === 1 || day === 30 ? `N${day}` : '',
    };
  });

  const activeCalorieData = timeFilter === 'week' ? weeklyCalorieData : monthlyCalorieData;
  const calorieTarget = 2000; // TDEE mục tiêu mặc định
  const avgCalorie = Math.round(activeCalorieData.reduce((acc, curr) => acc + curr.value, 0) / activeCalorieData.length);

  // 4. Thống kê Tiến độ Cân nặng (Weight Progress) - Biểu đồ đường trơn (Line Chart) + Tooltip
  const weeklyWeightData = [
    { value: 68.5, label: 'T2' },
    { value: 68.2, label: 'T3' },
    { value: 68.4, label: 'T4' },
    { value: 68.0, label: 'T5' },
    { value: 67.9, label: 'T6' },
    { value: 68.1, label: 'T7' },
    { value: 67.8, label: 'CN' },
  ];

  // Mock dữ liệu 30 ngày giảm cân đều đặn
  const monthlyWeightData = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const trend = 69.8 - (index * 0.08); // Xu hướng giảm cân
    const fluctuation = Math.sin(day * 0.9) * 0.25 + (index % 4 === 0 ? 0.15 : -0.05);
    return {
      value: parseFloat((trend + fluctuation).toFixed(1)),
      label: day % 5 === 0 || day === 1 || day === 30 ? `N${day}` : '',
    };
  });

  const activeWeightData = timeFilter === 'week' ? weeklyWeightData : monthlyWeightData;
  const weightValues = activeWeightData.map(d => d.value);
  const minWeight = Math.min(...weightValues);
  const maxWeight = Math.max(...weightValues);
  
  // Tính toán dynamic range cho trục Y cân nặng
  const weightYOffset = Math.floor(minWeight) - 1;
  const weightYMax = Math.ceil(maxWeight) + 1;
  const relativeMax = weightYMax - weightYOffset;
  const weightStepValue = parseFloat((relativeMax / 4).toFixed(1));
  const currentWeight = activeWeightData[activeWeightData.length - 1].value;
  const weightLoss = parseFloat((activeWeightData[0].value - currentWeight).toFixed(1));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ─── HEADER & BỘ LỌC THỜI GIAN KHÔNG GIAN ─── */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>DASHBOARD</Text>
          <Text style={styles.headerSubtitle}>Xu hướng & Phân tích Sức khỏe</Text>
        </View>

        {/* Tab Control chọn thời gian tinh tế */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, timeFilter === 'week' && styles.activeTabButton]}
            onPress={() => setTimeFilter('week')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, timeFilter === 'week' && styles.activeTabText]}>Tuần này</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, timeFilter === 'month' && styles.activeTabButton]}
            onPress={() => setTimeFilter('month')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, timeFilter === 'month' && styles.activeTabText]}>Tháng này</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* ─── TỔNG QUAN SINH LÝ CŨ (COLLAPSIBLE) ─── */}
        <View style={styles.overviewSection}>
          <TouchableOpacity 
            style={styles.overviewToggle}
            onPress={() => setShowOverview(!showOverview)}
            activeOpacity={0.7}
          >
            <View style={styles.overviewHeaderLeft}>
              <View style={styles.indicatorPulse} />
              <Text style={styles.overviewToggleText}>Tóm tắt chỉ số cơ bản</Text>
            </View>
            <Text style={styles.overviewToggleArrow}>{showOverview ? 'Ẩn ▴' : 'Xem thêm ▾'}</Text>
          </TouchableOpacity>

          {showOverview && (
            <View style={styles.overviewContent}>
              <PhysiologyStatsCard tdee={calorieStats.target} bmr={bmr} bmi={bmi} />
              <View style={{ height: 12 }} />
              <NutritionSummaryCard consumed={calorieStats.consumed} target={calorieStats.target} />
            </View>
          )}
        </View>

        {/* ─── THẺ 1: THỐNG KÊ NƯỚC UỐNG (WATER TRACKING) ─── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Theo dõi Nước uống</Text>
              <Text style={styles.cardSubtitle}>Trung bình ngày: {avgWater} ml</Text>
            </View>
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeTextBlue}>Mục tiêu: {waterTarget}ml</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <BarChart
              data={activeWaterData}
              width={chartWidth - 60}
              height={180}
              barWidth={timeFilter === 'week' ? 20 : 28}
              spacing={timeFilter === 'week' ? 14 : 24}
              initialSpacing={timeFilter === 'week' ? 10 : 15}
              yAxisLabelWidth={35}
              noOfSections={4}
              maxValue={timeFilter === 'week' ? 3000 : 20000}
              
              // Custom Reference Line cho mục tiêu nước uống
              showReferenceLine1
              referenceLine1Position={waterTarget}
              referenceLine1Config={{
                color: '#e74c3c',
                thickness: 1.5,
                dashWidth: 6,
                dashGap: 4,
              }}

              // Trục và lưới tinh tế
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.cardBorder}
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10, fontWeight: '600' }}
              xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}
              rulesType="dashed"
              rulesColor={colors.cardBorder}
              
              // Thiết kế cột
              barBorderRadius={6}
              isAnimated
              animationDuration={600}
            />
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.dotIndicatorBlue} />
            <Text style={styles.footerText}>
              Cột <Text style={{ color: '#2ecc71', fontWeight: 'bold' }}>xanh lá</Text> biểu thị ngày đã hoàn thành mục tiêu ≥ {timeFilter === 'week' ? '2L' : '14L'}.
            </Text>
          </View>
        </View>

        {/* ─── THẺ 2: THỐNG KÊ NHỊN ĂN (FASTING TRACKER) ─── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Thời gian Nhịn ăn</Text>
              <Text style={styles.cardSubtitle}>
                {timeFilter === 'week' ? '7 ngày qua' : '4 tuần qua'}
              </Text>
            </View>
            <View style={styles.badgePurple}>
              <Text style={styles.badgeTextPurple}>Mục tiêu: 16h</Text>
            </View>
          </View>

          {/* Legend mô phỏng giống mẫu */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff', marginRight: 6 }} />
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '600' }}>Giờ nhịn</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginRight: 6 }} />
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '600' }}>Mục tiêu</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <BarChart
              data={activeFastingData}
              width={chartWidth - 60}
              height={180}
              barWidth={timeFilter === 'week' ? 10 : 12}
              initialSpacing={timeFilter === 'week' ? 12 : 24}
              
              // Bo tròn cột dạng viên thuốc
              barBorderRadius={6}
              
              // Trục và lưới tinh tế
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.cardBorder}
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10, fontWeight: '600' }}
              xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}
              yAxisLabelSuffix="h"
              yAxisLabelWidth={32}
              noOfSections={5}
              maxValue={20}
              rulesType="dashed"
              rulesColor={colors.cardBorder}
              isAnimated
              animationDuration={700}
            />
          </View>

          {/* Hộp chỉ số tổng hợp đẹp mắt dưới biểu đồ giống mẫu */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20, paddingHorizontal: 4 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '700', marginBottom: 6 }}>Tổng cộng</Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                borderWidth: 1, 
                borderColor: colors.cardBorder, 
                borderRadius: 20, 
                paddingHorizontal: 16, 
                paddingVertical: 6,
                backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'
              }}>
                <Text style={{ fontSize: 11, marginRight: 4 }}>🕒</Text>
                <Text style={{ fontSize: 12, color: colors.text, fontWeight: '800' }}>{totalFasting}h</Text>
              </View>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '700', marginBottom: 6 }}>Trung bình ngày</Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                borderWidth: 1, 
                borderColor: colors.cardBorder, 
                borderRadius: 20, 
                paddingHorizontal: 16, 
                paddingVertical: 6,
                backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'
              }}>
                <Text style={{ fontSize: 11, marginRight: 4 }}>🕒</Text>
                <Text style={{ fontSize: 12, color: colors.text, fontWeight: '800' }}>{avgFasting}h</Text>
              </View>
            </View>
          </View>

          <View style={[styles.cardFooter, { marginTop: 16 }]}>
            <View style={styles.dotIndicatorPurple} />
            <Text style={styles.footerText}>
              Cột nền mờ biểu thị mục tiêu nhịn ăn, cột trắng sáng biểu thị giờ nhịn thực tế đạt được.
            </Text>
          </View>
        </View>

        {/* ─── THẺ 3: THỐNG KÊ CALO NẠP VÀO (CALORIES INTAKE) ─── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Calo nạp vào</Text>
              <Text style={styles.cardSubtitle}>Trung bình: {avgCalorie} Kcal</Text>
            </View>
            <View style={styles.badgeOrange}>
              <Text style={styles.badgeTextOrange}>TDEE: {calorieTarget} Kcal</Text>
            </View>
          </View>

          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <LineChart
              data={activeCalorieData}
              width={chartWidth - 60}
              height={180}
              yAxisLabelWidth={35}
              
              // Thiết lập biểu đồ vùng (Area Chart)
              areaChart
              curved
              color="#f97316" // Orange
              thickness={3}
              startFillColor="rgba(249, 115, 22, 0.4)"
              endFillColor="rgba(249, 115, 22, 0.01)"
              startOpacity={0.9}
              endOpacity={0.1}
              
              // Điểm đánh dấu
              dataPointsColor="#ea580c"
              dataPointsRadius={timeFilter === 'week' ? 5 : 2}
              
              // Trục và Lưới
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.cardBorder}
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10, fontWeight: '600' }}
              xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10, fontWeight: '700' }}
              noOfSections={4}
              maxValue={3200}
              rulesType="dashed"
              rulesColor={colors.cardBorder}
              
              // Custom Reference Line cho mục tiêu TDEE
              showReferenceLine1
              referenceLine1Position={calorieTarget}
              referenceLine1Config={{
                color: '#ef4444',
                thickness: 1.5,
                dashWidth: 5,
                dashGap: 4,
              }}

              // Khoảng cách
              spacing={timeFilter === 'week' ? (chartWidth - 60) / 6 : (chartWidth - 60) / 29}
              initialSpacing={12}
              isAnimated
              animationDuration={800}
            />
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.dotIndicatorOrange} />
            <Text style={styles.footerText}>
              Đường gạch đỏ biểu diễn giới hạn TDEE giúp kiểm soát thâm hụt/thặng dư Calo.
            </Text>
          </View>
        </View>

        {/* ─── THẺ 4: THỐNG KÊ TIẾN ĐỘ CÂN NẶNG (WEIGHT PROGRESS) ─── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Tiến trình Cân nặng</Text>
              <Text style={styles.cardSubtitle}>Hiện tại: {currentWeight} kg</Text>
            </View>
            <View style={styles.badgeTeal}>
              <Text style={styles.badgeTextTeal}>
                {weightLoss > 0 ? `Đã giảm: ${weightLoss}kg` : weightLoss < 0 ? `Đã tăng: ${Math.abs(weightLoss)}kg` : 'Ổn định'}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <LineChart
              data={activeWeightData}
              width={chartWidth - 60}
              height={190}
              yAxisLabelWidth={35}
              curved
              color="#06b6d4" // Teal/Cyan
              thickness={3.5}
              
              // dynamic Y Axis offset không bắt đầu từ 0
              yAxisOffset={weightYOffset}
              maxValue={relativeMax}
              stepValue={weightStepValue}
              noOfSections={4}
              
              // Điểm và Grid
              dataPointsColor="#0891b2"
              dataPointsRadius={timeFilter === 'week' ? 6 : 3}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.cardBorder}
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10, fontWeight: '600' }}
              xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10, fontWeight: '700' }}
              rulesType="dashed"
              rulesColor={colors.cardBorder}
              
              // Khoảng cách
              spacing={timeFilter === 'week' ? (chartWidth - 60) / 6 : (chartWidth - 60) / 29}
              initialSpacing={12}
              
              // Tương tác chạm và Tooltip động cực kỳ cao cấp
              pointerConfig={{
                pointerColor: '#06b6d4',
                radius: 6,
                pointerLabelWidth: 80,
                pointerLabelHeight: 38,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items: any) => {
                  if (!items || items.length === 0) return null;
                  return (
                    <View style={styles.tooltipContainer}>
                      <Text style={styles.tooltipText}>{items[0].value} kg</Text>
                    </View>
                  );
                },
              }}
              isAnimated
              animationDuration={800}
            />
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.dotIndicatorTeal} />
            <Text style={styles.footerText}>
              Chạm và kéo trên đồ thị để xem cân nặng chính xác của từng ngày.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── PHONG CÁCH GIAO DIỆN PREMIUM HSL (STYLE SYSTEM) ─────────────────────────
const getStyles = (colors: ThemeColors) => StyleSheet.create({
  header: { 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: 20, 
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTextContainer: {
    marginBottom: 16,
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '900', 
    letterSpacing: 1.5, 
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: colors.background,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabButton: { 
    flex: 1,
    paddingVertical: 10, 
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTabButton: { 
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { 
    color: colors.textSecondary, 
    fontWeight: '700', 
    fontSize: 13,
  },
  activeTabText: { 
    color: colors.text, 
    fontWeight: '800', 
  },
  
  // Section tổng quan sinh lý cũ
  overviewSection: {
    marginVertical: 16,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  overviewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  overviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ecc71',
    marginRight: 8,
  },
  overviewToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overviewToggleArrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  overviewContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.background,
  },

  // Redesign Thẻ Card cao cấp
  card: { 
    backgroundColor: colors.card, 
    borderRadius: 24, 
    padding: 16, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: colors.cardBorder, 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: colors.isDark ? 0.2 : 0.04, 
    shadowRadius: 16, 
    elevation: 2, 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: { 
    fontWeight: '900', 
    fontSize: 16, 
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Badges tinh tế cho góc thẻ
  badgeBlue: {
    backgroundColor: 'rgba(52, 152, 219, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeTextBlue: {
    color: '#2980b9',
    fontSize: 11,
    fontWeight: '800',
  },
  badgePurple: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeTextPurple: {
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: '800',
  },
  badgeOrange: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeTextOrange: {
    color: '#ea580c',
    fontSize: 11,
    fontWeight: '800',
  },
  badgeTeal: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeTextTeal: {
    color: '#0891b2',
    fontSize: 11,
    fontWeight: '800',
  },

  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  // Tooltip cho tương tác điểm cân nặng
  tooltipContainer: {
    backgroundColor: colors.isDark ? '#334155' : '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '800',
  },

  // Footer của Thẻ Card
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 15,
  },
  dotIndicatorBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3498db',
    marginRight: 8,
  },
  dotIndicatorPurple: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8b5cf6',
    marginRight: 8,
  },
  dotIndicatorOrange: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f97316',
    marginRight: 8,
  },
  dotIndicatorTeal: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06b6d4',
    marginRight: 8,
  },
});
