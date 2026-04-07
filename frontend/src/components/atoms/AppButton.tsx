/**
 * @file AppButton.tsx
 * @description Nguyên tử (Atom) nút bấm chuẩn của dự án NutriTrack.
 * Hỗ trợ Primary, Secondary variants và Icon (Ionicons).
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  View,
  StyleProp
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppButtonProps {
  /** Nhãn hiển thị trên nút */
  title: string;
  /** Sự kiện khi nhấn */
  onPress: () => void;
  /** Loại nút: 'primary' (mặc định) | 'secondary' | 'danger' | 'ghost' */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Tên Icon từ bộ Ionicons (tùy chọn) */
  iconName?: keyof typeof Ionicons.glyphMap;
  /** Trạng thái đang tải (hiện Spinner) */
  loading?: boolean;
  /** Vô hiệu hóa nút */
  disabled?: boolean;
  /** Style bổ sung cho container */
  style?: StyleProp<ViewStyle>;
}

const AppButtonComponent: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  iconName,
  loading = false,
  disabled = false,
  style
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const buttonStyle: StyleProp<ViewStyle> = [
    styles.base,
    isPrimary ? styles.primary : null,
    isSecondary ? styles.secondary : null,
    isDanger ? styles.danger : null,
    isGhost ? styles.ghost : null,
    disabled ? styles.disabled : null,
    style
  ];

  const textStyle: StyleProp<TextStyle> = [
    styles.textBase,
    isPrimary ? styles.textPrimary : null,
    isSecondary ? styles.textSecondary : null,
    isDanger ? styles.textDanger : null,
    isGhost ? styles.textGhost : null,
    disabled ? styles.textDisabled : null
  ];

  // Lấy màu chữ để áp dụng cho Icon
  const flattenedText = StyleSheet.flatten(textStyle);
  const iconColor = (flattenedText?.color as string) || '#4B5563';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={buttonStyle}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#4B5563'} size="small" />
      ) : (
        <View style={styles.content}>
          {iconName && (
            <Ionicons 
              name={iconName} 
              size={18} 
              color={iconColor} 
              style={styles.icon} 
            />
          )}
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * Thành phần Nút bấm (AppButton) - Memoized để tối ưu hiệu năng.
 */
export const AppButton = React.memo(AppButtonComponent);

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  primary: {
    backgroundColor: '#00C48C',
  },
  secondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  danger: {
    backgroundColor: '#E11D48',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  textBase: {
    fontSize: 15,
    fontWeight: '700',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#4B5563',
  },
  textDanger: {
    color: '#FFFFFF',
  },
  textGhost: {
    color: '#6B7280',
    fontWeight: '600',
  },
  textDisabled: {
    color: '#94A3B8',
  },
});
