/**
 * @file IconButton.tsx
 * @description Nguyên tử (Atom) nút bấm chỉ chứa Icon.
 * Hỗ trợ các trạng thái nhấn, nhấn giữ và hiệu ứng Haptics.
 */

import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  StyleProp 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface IconButtonProps {
  /** Tên Icon từ bộ Ionicons */
  iconName: keyof typeof Ionicons.glyphMap;
  /** Sự kiện khi nhấn */
  onPress: () => void;
  /** Sự kiện khi nhấn giữ (tùy chọn) */
  onLongPress?: () => void;
  /** Sự kiện khi thả ra (để dừng interval nếu có) */
  onPressOut?: () => void;
  /** Kích thước icon (mặc định 24) */
  size?: number;
  /** Màu sắc icon (mặc định #1E293B) */
  color?: string;
  /** Màu nền (mặc định #F1F5F9) */
  backgroundColor?: string;
  /** Vô hiệu hóa nút */
  disabled?: boolean;
  /** Style bổ sung */
  style?: StyleProp<ViewStyle>;
  /** Kích hoạt Haptics khi nhấn (mặc định true) */
  enableHaptics?: boolean;
}

const IconButtonComponent: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  onLongPress,
  onPressOut,
  size = 24,
  color = '#1E293B',
  backgroundColor = '#F1F5F9',
  disabled = false,
  style,
  enableHaptics = true
}) => {
  const handlePress = () => {
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        { backgroundColor },
        disabled && styles.disabled,
        style
      ]}
    >
      <Ionicons name={iconName} size={size} color={disabled ? '#CBD5E1' : color} />
    </TouchableOpacity>
  );
};

/**
 * Thành phần IconButton - Tối ưu cho các tương tác nhanh và Stepper.
 */
export const IconButton = React.memo(IconButtonComponent);

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#F8FAFC',
  },
});
