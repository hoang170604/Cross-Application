/**
 * @file WeightHistoryChart.tsx
 * @description Biểu đồ đồ thị hiển thị xu hướng cân nặng của người dùng.
 *
 * Chức năng:
 * - Trực quan hóa dữ liệu bản ghi thay đổi cân nặng qua lại các khoảng thời gian.
 * - Khắc phục các tình trạng dữ liệu mảng thiếu để đảm bảo trải nghiệm hiển thị liền mạch.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface WeightHistoryChartProps {
  /** Lịch sử cân nặng lấy từ userProfile */
  history?: { date: string, weight: number }[];
}

const WeightHistoryChartComponent: React.FC<WeightHistoryChartProps> = ({
  history = []
}) => {
  const screenWidth = Dimensions.get('window').width - 48; // Giảm padding 24 (lề tab Statistics)

  // 1. Xử lý dữ liệu biểu đồ
  // Xử lý đồ thị với tối đa 7 điểm dữ liệu mới nhất được nạp vào
  const chartDataPoints = history.slice(-7);

  // Fallback nếu không đủ dữ liệu
  if (chartDataPoints.length < 2) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.title}>Xu hướng cân nặng (kg)</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có đủ dữ liệu lịch sử để lập biểu đồ.</Text>
          <Text style={styles.emptySubText}>Hãy ghi nhận cân nặng hôm nay để bắt đầu theo dõi!</Text>
        </View>
      </View>
    );
  }

  // Chuyển đổi sang định dạng của LineChart
  const data = {
    labels: chartDataPoints.map(h => {
      // Chuyển YYYY-MM-DD -> DD/MM
      const parts = h.date.split('-');
      return `${parts[2]}/${parts[1]}`;
    }),
    datasets: [{
      data: chartDataPoints.map(h => h.weight),
      color: (opacity = 1) => `rgba(0, 196, 140, ${opacity})`, // Xanh Mint (Primary)
      strokeWidth: 3
    }]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1, // Số chữ số thập phân
    color: (opacity = 1) => `rgba(0, 196, 140, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffffff'
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Bỏ gạch đứt đoạn
      stroke: '#F3F4F6',
    },
    variant: 'bezier',
    fillShadowGradientFrom: '#00C48C',
    fillShadowGradientTo: '#ffffff',
    fillShadowGradientOpacity: 0.2, // Đổ bóng nhẹ phía dưới
    useShadowColorFromDataset: false,
    horizontalLines: true,
    verticalLines: false, // Ẩn đường lưới dọc cho thanh thoát
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Xu hướng cân nặng (kg)</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chartStyle}
        withVerticalLines={false}
        withHorizontalLines={true}
        fromZero={false} // Tự động scale quanh khoảng cân nặng
      />
    </View>
  );
};

const WeightHistoryChart = React.memo(WeightHistoryChartComponent);
export default WeightHistoryChart;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    minHeight: 200,
  },
  title: {
    fontWeight: '800',
    marginBottom: 16,
    fontSize: 13,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    alignSelf: 'flex-start',
    paddingLeft: 12,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});
