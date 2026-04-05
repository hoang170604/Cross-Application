import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useUserProfile } from '@/context/UserProfileContext';

export default function StatisticsScreen() {
  const { userProfile, totalEatenCalories, tdee, bmr, bmi } = useUserProfile();

  const startWeight = userProfile.weight || 70;
  const currentWeight = userProfile.currentWeight !== undefined ? userProfile.currentWeight : startWeight;
  const targetWeight = userProfile.targetWeight || 65;

  let progressComponent = 0;
  if (startWeight !== targetWeight) {
    if (userProfile.goal === 'lose_weight' || userProfile.goal === 'lose') {
        progressComponent = Math.max(0, Math.min(100, ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100));
    } else if (userProfile.goal === 'gain_muscle' || userProfile.goal === 'gain') {
        progressComponent = Math.max(0, Math.min(100, ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100));
    } else {
        progressComponent = 100;
    }
  } else {
    progressComponent = 100;
  }

  // ═══════════════════════════════════════════════════
  // DỮ LIỆU NHỊN ĂN THỰC TẾ TỪ CONTEXT
  // ═══════════════════════════════════════════════════
  const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  /**
   * Logic nhóm dữ liệu (Aggregation) cho Biểu đồ Nhịn ăn.
   * Chức năng: Truy xuất vào chuỗi `userProfile.fastingHistory`.
   * 1. Lọc và xác định khung thời gian 7 ngày (Thứ 2 đến Chủ nhật) lấy mốc từ Local CPU Time tương đối.
   * 2. Quét (Scan) và matching các Session kết thúc có cùng cấu trúc ID định dạng (YYYY-MM-DD).
   * 3. Xử lý làm tròn số (Math.round 1 thập phân) ra định dạng { day, hours } thân thiện để vẽ UI Bar Chart.
   */
  const fastingDisplayData = useMemo(() => {
    const history = userProfile.fastingHistory || [];
    
    // Tìm các ngày của tuần hiện tại (Thứ 2 đến Chủ nhật)
    const dates = [];
    const curr = new Date();
    const day = curr.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(curr.setDate(diffToMonday));
    for (let i = 0; i < 7; i++) {
       const d = new Date(monday);
       d.setDate(monday.getDate() + i);
       // YYYY-MM-DD local timezone
       const localDateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
       dates.push(localDateStr);
    }

    return dates.map((dateStr, idx) => {
      const record = history.find(s => s.id === dateStr);
      // GIỚI HẠN CHART CAPPING: Đảm bảo một ngày không bao giờ vượt 24 tiếng trên UI
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

  // ═══════════════════════════════════════════════════
  // DỮ LIỆU CALO THỰC TẾ TỪ CONTEXT
  // ═══════════════════════════════════════════════════

  /**
   * Chuẩn hóa và tổng hợp lịch sử nạp Calo 7 ngày dưới dạng chuỗi liên tục (Array).
   * Tại bản Client Context, dữ liệu áp dụng Placeholder (Mảng mồi 0) và nối kết cục bộ với `totalEatenCalories` cho phần tử thứ [6].
   * Lưu đồ dữ liệu này sẽ sẵn sàng tích hợp thẳng vào Backend/Thống kê API khi có mảng Daily Log đầy đủ.
   */
  const calorieHistory = useMemo(() => {
    // Placeholder cho 6 ngày trước + ngày hôm nay lấy dữ liệu thực
    return [0, 0, 0, 0, 0, 0, totalEatenCalories || 0];
  }, [totalEatenCalories]);

  const avgCalories = useMemo(() => {
    const valid = calorieHistory.filter(c => c > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  }, [calorieHistory]);

  const { width } = Dimensions.get('window');
  const chartWidth = width - 96;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2, marginBottom: 24 }}>THỐNG KÊ</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={{
            paddingHorizontal: 32, paddingVertical: 10, backgroundColor: '#00C48C', borderRadius: 999,
            shadowColor: '#86EFAC', shadowOpacity: 0.3, shadowRadius: 4, elevation: 2,
          }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Tuần</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            paddingHorizontal: 32, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 999,
            borderWidth: 1, borderColor: '#E5E7EB',
          }}>
            <Text style={{ color: '#4B5563', fontWeight: '600' }}>Tháng</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Chỉ số sinh lý tự động (TDEE / BMR / BMI) */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontWeight: '700', marginBottom: 16, fontSize: 18 }}>Chỉ số Sinh lý</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#10B981' }}>{tdee}</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>TDEE (kcal)</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#F59E0B' }}>{bmr}</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>BMR (kcal)</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#3B82F6' }}>{bmi}</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>BMI</Text>
            </View>
          </View>
        </View>

        {/* Trung bình Calo */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 8 }}>Calo hôm nay</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 32, fontWeight: '900' }}>{totalEatenCalories.toLocaleString()}</Text>
            <Text style={{ color: '#6B7280', fontWeight: '600', fontSize: 16 }}>/ {tdee} kcal</Text>
          </View>
          <View style={{ height: 10, backgroundColor: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
            <View style={{ height: '100%', backgroundColor: totalEatenCalories > tdee ? '#EF4444' : '#00C48C', borderRadius: 999, width: `${Math.min(100, (totalEatenCalories / (tdee || 1)) * 100)}%` }} />
          </View>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', marginTop: 8 }}>
            {totalEatenCalories > tdee ? 'Đã vượt mức TDEE!' : `Còn ${tdee - totalEatenCalories} kcal`}
          </Text>
        </View>

        {/* Lịch sử nhịn ăn — BIỂU ĐỒ TÙY CHỈNH */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontWeight: '700', marginBottom: 8, fontSize: 18 }}>Lịch sử nhịn ăn</Text>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 12 }}>
            Tổng kết 7 ngày gần nhất
          </Text>

          {/* Chú thích biểu đồ (Legend) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
               <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F59E0B' }} />
               <Text style={{ fontSize: 13, color: '#4B5563', fontWeight: '500' }}>Đã nhịn</Text>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
               <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' }} />
               <Text style={{ fontSize: 13, color: '#4B5563', fontWeight: '500' }}>Mục tiêu (16h)</Text>
             </View>
          </View>

          <View>
            {/* Biểu đồ */}
            <View style={{ flexDirection: 'row', height: 190, marginTop: 12, marginBottom: 24 }}>
              {/* Trục Y */}
              <View style={{ width: 28, justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20 }}>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>16h</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>12h</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>8h</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>4h</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>0h</Text>
              </View>

              {/* Vùng vẽ Cột */}
              <View style={{ flex: 1, position: 'relative', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 20 }}>
                {/* Lưới ngang (Grid lines) */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                  <View key={index} style={{
                    position: 'absolute', left: 0, right: 0, bottom: 20 + ratio * 160,
                    borderTopWidth: 1, borderTopColor: '#F3F4F6', borderStyle: 'dashed'
                  }} />
                ))}

                {/* Các cột (Columns) */}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginLeft: 8 }}>
                  {fastingDisplayData.map((record, idx) => {
                    const actualHeight = Math.min((record.hours / 16) * 160, 200); // Tỉ lệ 10px = 1h. Cho phép vượt giới hạn chút ít.
                    
                    return (
                      <View key={idx} style={{ alignItems: 'center', width: 32 }}>
                        {/* Vùng chứa Cột */}
                        <View style={{ width: 14, height: 160, justifyContent: 'flex-end', position: 'relative' }}>
                           {/* Cột Mục tiêu (Nền xám) */}
                           <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 160, backgroundColor: '#F3F4F6', borderRadius: 999 }} />
                           {/* Cột Thực tế (Màu hổ phách) - Đè lên */}
                           <View style={{ position: 'absolute', bottom: 0, width: '100%', height: actualHeight, backgroundColor: '#F59E0B', borderRadius: 999 }} />
                        </View>
                        {/* Nhãn Trục X (Ngày) */}
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginTop: 8 }}>{record.day}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Thông số dưới biểu đồ */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: '#FFFBEB', borderRadius: 20, padding: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: '#B45309', fontWeight: '600', marginBottom: 4 }}>Tổng cộng</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#B45309' }}>
                  {fastingDisplayData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} <Text style={{ fontSize: 14, fontWeight: '600' }}>giờ</Text>
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FFFBEB', borderRadius: 20, padding: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: '#B45309', fontWeight: '600', marginBottom: 4 }}>Trung bình ngày</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#B45309' }}>
                  {avgFastingHours} <Text style={{ fontSize: 14, fontWeight: '600' }}>giờ</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Biểu đồ Calo */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontWeight: '700', marginBottom: 24, fontSize: 18 }}>Lịch sử nạp Calo</Text>
          <View style={{ marginLeft: -12 }}>
            <LineChart
              data={{
                labels: dayLabels,
                datasets: [
                  {
                    data: calorieHistory.map(c => c || 0.1), // Tránh lỗi nếu toàn bộ = 0
                    color: () => '#00C48C',
                    strokeWidth: 2,
                  },
                  {
                    data: [3000],
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
                labelColor: () => '#9CA3AF',
                propsForBackgroundLines: {
                  strokeDasharray: "4",
                  stroke: "#E5E7EB",
                },
              }}
              bezier={false}
              style={{ borderRadius: 16 }}
              getDotProps={(value, index) => {
                if (value === 3000 || value <= 0.1) return { r: "0" };
                return {
                  r: index === 6 ? "6" : "4",
                  stroke: "#00C48C",
                  strokeWidth: index === 6 ? "2" : "0",
                  fill: index === 6 ? "#fff" : "#00C48C"
                };
              }}
              renderDotContent={({ x, y, index, indexData }) => {
                if (indexData === 3000 || indexData <= 0.1) return null;
                const isToday = index === 6;
                const topPos = y - (isToday ? 32 : 24);
                const leftPos = index === 0 ? x : x - 15;
                return (
                  <Text
                    key={index}
                    style={{
                      position: 'absolute',
                      top: topPos,
                      left: leftPos,
                      width: 30,
                      textAlign: 'center',
                      fontSize: 10,
                      color: isToday ? '#00C48C' : '#6B7280',
                      fontWeight: isToday ? 'bold' : '500',
                    }}
                  >
                    {Math.round(indexData as number)}
                  </Text>
                );
              }}
            />
          </View>
        </View>

        {/* Tiến độ cân nặng */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 16,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontWeight: '700', marginBottom: 16, fontSize: 18 }}>Tiến độ Cân nặng</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: '900' }}>{currentWeight} <Text style={{ fontSize: 20, fontWeight: '700' }}>kg</Text></Text>
            <Text style={{ color: '#00C48C', fontWeight: '700' }}>{userProfile.goal === 'gain_muscle' || userProfile.goal === 'gain' ? '+' : '-'}{Math.abs(currentWeight - startWeight).toFixed(1)} kg</Text>
          </View>
          <View style={{ height: 10, backgroundColor: '#F3F4F6', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
            <View style={{ height: '100%', backgroundColor: '#00C48C', borderRadius: 999, width: `${progressComponent}%` }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Bắt đầu: {startWeight.toFixed(1)} kg</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Mục tiêu: {targetWeight.toFixed(1)} kg</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
