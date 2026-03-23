import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useUserProfile } from '@/context/UserProfileContext';

export default function StatisticsScreen() {
  const { userProfile } = useUserProfile();
  
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

  const fastingHistory = [
    { day: 'T2', hours: 16 },
    { day: 'T3', hours: 15.5 },
    { day: 'T4', hours: 16.5 },
    { day: 'T5', hours: 14 },
    { day: 'T6', hours: 16 },
    { day: 'T7', hours: 18 },
    { day: 'CN', hours: 15 },
  ];

  const calorieHistory = [1850, 1400, 2100, 1900, 1300, 2400, 1500]; // varied data
  const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const { width } = Dimensions.get('window');
  const chartWidth = width - 96; // 48px padding screen + 48px padding card

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
        {/* Average Calories */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 8 }}>Trung bình Calo/ngày</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 32, fontWeight: '900' }}>1,650</Text>
            <Text style={{ color: '#00C48C', fontWeight: '700', fontSize: 18 }}>-8%</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>So với tuần trước</Text>
        </View>

        {/* Fasting History */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontWeight: '700', marginBottom: 8, fontSize: 18 }}>Lịch sử nhịn ăn (Tuần)</Text>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 24 }}>
            Trung bình: <Text style={{ color: '#FF8C00', fontWeight: '700' }}>15.5 giờ/ngày</Text>
          </Text>
          {fastingHistory.map((record, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Text style={{ width: 24, fontSize: 14, fontWeight: '600', color: '#6B7280' }}>{record.day}</Text>
              <View style={{ flex: 1, height: 10, backgroundColor: '#FFF7ED', borderRadius: 999, overflow: 'hidden' }}>
                <View style={{
                  height: '100%', backgroundColor: '#FF8C00', borderRadius: 999,
                  width: `${(record.hours / 24) * 100}%`,
                }} />
              </View>
              <Text style={{ width: 40, textAlign: 'right', fontSize: 14, fontWeight: '700', color: '#374151' }}>{record.hours}h</Text>
            </View>
          ))}
        </View>

        {/* Calorie Chart */}
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
                    data: calorieHistory,
                    color: () => '#00C48C',
                    strokeWidth: 2,
                  },
                  {
                    data: [3000], // force scale to 3000 max
                    color: () => 'transparent',
                    strokeWidth: 0,
                    withDots: false
                  }
                ],
              }}
              width={chartWidth + 12} // Adjust to fill perfectly
              height={220}
              fromZero
              segments={3} // 0, 1000, 2000, 3000
              yLabelsOffset={16} // Đẩy lề trái lùi xa khỏi Chart Area một chút
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
              bezier={false} // Khấp khúc rõ ràng
              style={{
                borderRadius: 16,
              }}
              getDotProps={(value, index) => {
                if (value === 3000) return { r: "0" };
                return {
                  r: index === 3 ? "6" : "4",
                  stroke: "#00C48C",
                  strokeWidth: index === 3 ? "2" : "0",
                  fill: index === 3 ? "#fff" : "#00C48C"
                };
              }}
              renderDotContent={({ x, y, index, indexData }) => {
                if (indexData === 3000) return null;
                const isToday = index === 3;
                
                // Đẩy nhãn số liệu lên cao hơn
                const topPos = y - (isToday ? 32 : 24);
                
                // Đẩy ngày T2 (index 0) sang phải để không dính trục Y
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
                    {indexData}
                  </Text>
                );
              }}
            />
          </View>
        </View>

        {/* Weight Progress */}
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
