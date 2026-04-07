/**
 * @file WaterTrackerCard.tsx
 * @description Sinh vật (Organism) thẻ theo dõi lượng nước uống.
 * Đã sửa lỗi layout chồng lấp văn bản bằng Flexbox (flexShrink).
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../atoms/ProgressBar';

interface WaterTrackerCardProps {
  /** Lượng nước đã uống (ml) */
  intake: number;
  /** Mục tiêu nước (ml) */
  target: number;
  /** Hàm xử lý khi thêm nước */
  onAddWater: () => void;
}

/**
 * Hiển thị thẻ theo dõi nước uống với thanh tiến trình.
 * Layout được tối ưu hóa để tránh tràn chữ trên màn hình hẹp.
 */
export const WaterTrackerCard: React.FC<WaterTrackerCardProps> = ({
  intake,
  target,
  onAddWater
}) => {
  const cups = Math.floor(intake / 200);
  const targetCups = Math.floor(target / 200);
  const progress = target > 0 ? intake / target : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {/* titleRow: Sử dụng flexShrink: 1 để không lấn át phần con số */}
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="water" size={20} color="#3B82F6" />
          </View>
          <View style={styles.textContainer}>
            <Text 
              style={styles.title} 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              Nước uống
            </Text>
            <Text 
              style={styles.subTitle} 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              Mục tiêu: {(target / 1000).toFixed(1)} Lít
            </Text>
          </View>
        </View>

        {/* statsWrapper: Chứa con số đếm bên phải */}
        <View style={styles.statsWrapper}>
          <Text style={styles.statsValue}>
            {cups} / {targetCups}
          </Text>
          <Text style={styles.statsUnit}>cốc</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} fillColor="#3B82F6" height={12} />
        </View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={onAddWater}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16, // Cân đối padding theo yêu cầu
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8, // Khoảng cách nhỏ giữa tiêu đề và con số
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1, // QUAN TRỌNG: Ngăn tiêu đề lấn át statsWrapper
  },
  textContainer: {
    flexShrink: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0, // Không bao giờ bị bóp méo
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
    color: '#1E293B',
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  statsWrapper: {
    alignItems: 'flex-end',
    flexShrink: 0, // Đảm bảo con số luôn hiển thị đủ
    minWidth: 60,
  },
  statsValue: {
    fontWeight: '800',
    color: '#3B82F6',
    fontSize: 18,
  },
  statsUnit: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 12, // Khoảng cách tới nút "+"
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flexShrink: 0, // Giữ kích thước cố định
  },
});
