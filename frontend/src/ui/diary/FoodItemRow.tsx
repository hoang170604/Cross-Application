/**
 * @file FoodItemRow.tsx
 * @description Phân tử (Molecule) hiển thị một dòng món ăn trong danh sách.
 * Sử dụng React.memo để tối ưu hóa hiệu năng cuộn của FlatList.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FoodItem } from '@/src/types';

interface FoodItemRowProps {
  /** Đối tượng món ăn */
  item: FoodItem;
}

/**
 * Hiển thị Tên món ăn và lượng Calo tương ứng.
 */
const FoodItemRowComponent: React.FC<FoodItemRowProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        • {item.name}
      </Text>
      <Text style={styles.calories}>
        {item.calories} <Text style={styles.unit}>kcal</Text>
      </Text>
    </View>
  );
};

export const FoodItemRow = React.memo(FoodItemRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 4,
  },
  name: {
    fontSize: 14, 
    color: '#374151', // gray-700
    flex: 1,
    marginRight: 10,
  },
  calories: {
    fontSize: 14, 
    color: '#4B5563', // gray-600
    fontWeight: '600',
  },
  unit: {
    fontSize: 12,
    color: '#9CA3AF', // gray-400
    fontWeight: '400',
  },
});
