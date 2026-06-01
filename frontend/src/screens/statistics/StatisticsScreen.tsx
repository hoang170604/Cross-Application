import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, InteractionManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-gifted-charts';

// ─── Import Atomic Hooks & Components ─────────────────────────────────────────
import { useNutrition } from '@/src/hooks';
import { getWeightHistory, getNutritionReport, getWaterLogsBetween } from '@/src/api/progressService';
import { getFastingSessions } from '@/src/api/fastingService';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';
import { PhysiologyStatsCard } from '@/src/ui/fasting/PhysiologyStatsCard';
import { NutritionSummaryCard } from '@/src/ui/diary/NutritionSummaryCard';
import { useAppStore } from '@/src/store/useAppStore';
import { getLocalToday } from '@/src/core/dateFormatter';

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
/**
 * Chuyển đổi đối tượng Date thành chuỗi định dạng local YYYY-MM-DD không bị lệch múi giờ.
 */
const formatDateStr = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

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

  const { userId } = useAppStore();

  const [remoteWeightHistory, setRemoteWeightHistory] = useState<any[]>(userProfile.weightHistory || []);
  const [remoteCalorieHistory, setRemoteCalorieHistory] = useState<any[]>([]);
  const [remoteWaterHistory, setRemoteWaterHistory] = useState<any[]>([]);
  const [remoteFastingHistory, setRemoteFastingHistory] = useState<any[]>([]);

  // ─── STATE QUẢN LÝ BỘ LỌC THỜI GIAN & TÙY CHỌN UI ─────────────────────────────
  const [timeFilter, setTimeFilter] = useState<'week' | 'month'>('week');
  const [showOverview, setShowOverview] = useState(false); // Collapsible cho phần chỉ số sinh lý cũ

  // Trì hoãn gọi API thực tế để đảm bảo mượt mà và cập nhật thời gian thực khi vào lại màn hình
  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        if (!userId) return;
        try {
          const endDate = getLocalToday();
          const startD = new Date();
          startD.setDate(startD.getDate() - (timeFilter === 'week' ? 6 : 29));
          const startDate = formatDateStr(startD);

          const [nutritionRes, weightRes, waterRes, fastingRes] = await Promise.allSettled([
            getNutritionReport(userId, startDate, endDate),
            getWeightHistory(userId, startDate, endDate),
            getWaterLogsBetween(userId, startDate, endDate),
            getFastingSessions(userId)
          ]);

          if (nutritionRes.status === 'fulfilled' && nutritionRes.value.data) {
            setRemoteCalorieHistory(nutritionRes.value.data);
          }
          if (weightRes.status === 'fulfilled' && weightRes.value.data) {
            setRemoteWeightHistory(weightRes.value.data);
          }
          if (waterRes.status === 'fulfilled' && waterRes.value.data) {
            setRemoteWaterHistory(waterRes.value.data);
          }
          if (fastingRes.status === 'fulfilled' && fastingRes.value.data) {
            const sessions = fastingRes.value.data.filter((s: any) => s.startTime && s.startTime.substring(0, 10) >= startDate);
            setRemoteFastingHistory(sessions);
          }
        } catch (error: any) {
          console.warn('API fetch statistics error', error.message);
        }
      };

      const task = InteractionManager.runAfterInteractions(() => {
        fetchStats();
      });

      return () => {
        task.cancel();
      };
    }, [timeFilter, userId])
  );

  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = screenWidth - 48; // paddingHorizontal: 24 ở ScrollView
  const chartWidth = cardWidth - 32;  // paddingHorizontal: 16 ở Thẻ Card

  // ─── HELPER TẠO NGÀY ──────────────────────────────────────────────────────────
  const dateList = useMemo(() => {
    const dates = [];
    const today = new Date();
    if (timeFilter === 'week') {
      // Luôn bắt đầu từ Thứ Hai (T2) đến Chủ Nhật (CN) của tuần hiện tại
      const dayOfWeek = today.getDay(); // 0=CN, 1=T2, 2=T3, ...
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push(formatDateStr(d));
      }
    } else {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(formatDateStr(d));
      }
    }
    return dates;
  }, [timeFilter]);

  const getWeekLabel = (dateStr: string) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[new Date(dateStr).getDay()];
  };

  // ─── 1. THỐNG KÊ NƯỚC UỐNG (WATER TRACKING) ──────────────────────────────────
  const { waterTarget: storeWaterTarget } = useAppStore();
  const waterTarget = storeWaterTarget || 2000;

  const activeWaterData = useMemo(() => {
    if (timeFilter === 'week') {
      return dateList.map((dateStr, index) => {
        const logs = remoteWaterHistory.filter(h => {
          const dStr = h.logDate || h.createdAt || h.timestamp;
          return dStr && dStr.substring(0, 10) === dateStr;
        });
        const value = logs.reduce((sum, log) => sum + (log.amountMl || 0), 0);
        return {
          value,
          label: WEEK_LABELS[index],
          frontColor: value >= waterTarget ? '#2ecc71' : '#3498db'
        };
      });
    } else {
      // Nhóm thành 4 tuần
      const weeksData = [];
      for (let i = 0; i < 4; i++) {
        const weekDates = dateList.slice(i * 7, (i + 1) * 7); // xấp xỉ 28 ngày
        let weekValue = 0;
        weekDates.forEach(dateStr => {
          const logs = remoteWaterHistory.filter(h => {
            const dStr = h.logDate || h.createdAt || h.timestamp;
            return dStr && dStr.substring(0, 10) === dateStr;
          });
          weekValue += logs.reduce((sum, log) => sum + (log.amountMl || 0), 0);
        });
        weeksData.push({
          value: weekValue,
          label: `T${i + 1}`,
          frontColor: weekValue >= waterTarget * 7 ? '#2ecc71' : '#3498db'
        });
      }
      return weeksData;
    }
  }, [dateList, remoteWaterHistory, timeFilter, waterTarget]);

  const avgWater = Math.round(activeWaterData.reduce((acc, curr) => acc + curr.value, 0) / Math.max(1, activeWaterData.length));
  const displayWaterTarget = timeFilter === 'week' ? waterTarget : waterTarget * 7;

  // ─── 2. THỐNG KÊ NHỊN ĂN (FASTING TRACKER) ────────────────────────────────────
  const userFastingGoal = userProfile.fastingGoal || 16;

  const activeFastingData = useMemo(() => {
    const rawFastingData: any[] = [];
    if (timeFilter === 'week') {
      dateList.forEach((dateStr, index) => {
        const logs = remoteFastingHistory.filter(h => h.startTime && h.startTime.substring(0, 10) === dateStr);
        const duration = logs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0) / 60;
        rawFastingData.push({ value: parseFloat(duration.toFixed(1)), label: WEEK_LABELS[index] });
      });
    } else {
      for (let i = 0; i < 4; i++) {
        const weekDates = dateList.slice(i * 7, (i + 1) * 7);
        let weekDuration = 0;
        let daysWithLog = 0;
        weekDates.forEach(dateStr => {
          const logs = remoteFastingHistory.filter(h => h.startTime && h.startTime.substring(0, 10) === dateStr);
          if (logs.length > 0) {
            weekDuration += logs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0) / 60;
            daysWithLog++;
          }
        });
        const avgDuration = daysWithLog > 0 ? (weekDuration / daysWithLog) : 0;
        rawFastingData.push({ value: parseFloat(avgDuration.toFixed(1)), label: `T${i + 1}` });
      }
    }

    const chartData: any[] = [];
    rawFastingData.forEach((item) => {
      chartData.push({
        value: item.value,
        frontColor: colors.isDark ? '#ffffff' : '#8b5cf6',
        label: item.label,
        spacing: 2,
        labelTextStyle: { 
          color: colors.textSecondary, 
          fontSize: 10, 
          fontWeight: '700',
          width: 36,
          marginLeft: -13,
          textAlign: 'center'
        }
      });
      chartData.push({
        value: userFastingGoal,
        frontColor: colors.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(139, 92, 246, 0.2)',
        spacing: timeFilter === 'week' ? 14 : 36,
      });
    });
    return chartData;
  }, [dateList, remoteFastingHistory, timeFilter, colors.textSecondary, colors.isDark, userFastingGoal]);

  const rawFastingValues = activeFastingData.filter((_, i) => i % 2 === 0).map(d => d.value);
  const totalFasting = rawFastingValues.reduce((acc, curr) => acc + curr, 0);
  const avgFasting = (totalFasting / Math.max(1, rawFastingValues.length)).toFixed(1);

  // ─── 3. THỐNG KÊ CALO NẠP VÀO (CALORIES INTAKE) ───────────────────────────────
  const calorieTarget = userProfile.targetCalories || 2000;

  const activeCalorieData = useMemo(() => {
    return dateList.map((dateStr, index) => {
      const log = remoteCalorieHistory.find(h => h.date && h.date.substring(0, 10) === dateStr);
      let label = '';
      if (timeFilter === 'week') {
        label = WEEK_LABELS[index];
      } else {
        const day = index + 1;
        label = (day % 5 === 0 || day === 1 || day === 30) ? `N${day}` : '';
      }
      return {
        value: log ? log.totalCalories : 0,
        label
      };
    });
  }, [dateList, remoteCalorieHistory, timeFilter]);

  const totalCalorie = activeCalorieData.reduce((acc, curr) => acc + curr.value, 0);
  const daysWithCalorie = activeCalorieData.filter(d => d.value > 0).length;
  const avgCalorie = Math.round(totalCalorie / Math.max(1, daysWithCalorie));

  // ─── 4. THỐNG KÊ TIẾN ĐỘ CÂN NẶNG (WEIGHT PROGRESS) ────────────────────────────
  const activeWeightData = useMemo(() => {
    // Để LineChart đẹp, nếu ngày không có dữ liệu, lấy dữ liệu gần nhất phía trước
    const initialWeight = userProfile.weight || userProfile.currentWeight || 70;
    let lastKnownWeight = initialWeight;

    // Khởi tạo lastKnownWeight dựa trên history cũ hơn nếu có
    if (remoteWeightHistory.length > 0) {
      const pastLogs = [...remoteWeightHistory]
        .filter(h => h.date)
        .sort((a, b) => a.date.substring(0, 10).localeCompare(b.date.substring(0, 10)));
      const beforeStart = pastLogs.filter(h => h.date.substring(0, 10) < dateList[0]);
      if (beforeStart.length > 0) {
        lastKnownWeight = beforeStart[beforeStart.length - 1].weight;
      } else {
        lastKnownWeight = userProfile.weight || pastLogs[0].weight || 70;
      }
    }

    return dateList.map((dateStr, index) => {
      const log = remoteWeightHistory.find(h => h.date && h.date.substring(0, 10) === dateStr);
      if (log && log.weight) {
        lastKnownWeight = log.weight;
      }
      let label = '';
      if (timeFilter === 'week') {
        label = WEEK_LABELS[index];
      } else {
        const day = index + 1;
        label = (day % 5 === 0 || day === 1 || day === 30) ? `N${day}` : '';
      }
      return {
        value: lastKnownWeight,
        label
      };
    });
  }, [dateList, remoteWeightHistory, timeFilter, userProfile.currentWeight, userProfile.weight]);

  const weightValues = activeWeightData.map(d => d.value);
  const minWeight = Math.min(...weightValues);
  const maxWeight = Math.max(...weightValues);

  const weightYOffset = Math.max(0, Math.floor(minWeight) - 1);
  const weightYMax = Math.ceil(maxWeight) + 1;
  const relativeMax = weightYMax - weightYOffset;
  const weightStepValue = Math.max(0.5, parseFloat((relativeMax / 4).toFixed(1)));
  const currentWeightDisp = activeWeightData[activeWeightData.length - 1]?.value || 0;
  const weightLoss = parseFloat((activeWeightData[0]?.value - currentWeightDisp).toFixed(1));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ─── HEADER & BỘ LỌC THỜI GIAN KHÔNG GIAN ─── */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Thống kê</Text>
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
              <Text style={styles.badgeTextBlue}>Mục tiêu: {displayWaterTarget}ml</Text>
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
              referenceLine1Position={displayWaterTarget}
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
              <Text style={styles.badgeTextPurple}>Mục tiêu: {userFastingGoal}h</Text>
            </View>
          </View>

          {/* Legend mô phỏng giống mẫu */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.isDark ? '#ffffff' : '#8b5cf6', marginRight: 6 }} />
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '600' }}>Giờ nhịn</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(139, 92, 246, 0.2)', marginRight: 6 }} />
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
              labelWidth={30}

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
              Cột nền mờ biểu thị mục tiêu nhịn ăn, cột màu nổi bật biểu thị giờ nhịn thực tế đạt được.
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
              spacing={timeFilter === 'week' ? (chartWidth - 60 - 12) / 6 : (chartWidth - 60 - 12) / 29}
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
              <Text style={styles.cardSubtitle}>Hiện tại: {currentWeightDisp} kg</Text>
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
              spacing={timeFilter === 'week' ? (chartWidth - 60 - 12) / 6 : (chartWidth - 60 - 12) / 29}
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
