/**
 * @file InputModal.tsx
 * @description Bottom Sheet Modal dùng chung cho nhập giá trị nước uống và cân nặng.
 * Thiết kế hiện đại: backdrop mờ, card bo tròn trên cùng, nút nhanh + ô nhập tùy chỉnh.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface InputModalProps {
  /** Hiển thị/ẩn modal */
  visible: boolean;
  /** Callback đóng modal */
  onClose: () => void;
  /** Callback khi submit giá trị */
  onSubmit: (value: number) => void;
  /** Tiêu đề modal (ví dụ: "Thêm nước", "Cập nhật cân nặng") */
  title: string;
  /** Dòng phụ bên dưới tiêu đề (ví dụ: ngày tháng) */
  subtitle?: string;
  /** Đơn vị hiển thị bên phải input (ví dụ: "ml", "kg") */
  unit: string;
  /** Danh sách nút bấm nhanh (ví dụ: [100, 200, 250, 500] cho nước) */
  quickOptions?: number[];
  /** Đơn vị hiển thị trên nút nhanh (ví dụ: "ml") */
  quickOptionUnit?: string;
  /** Giá trị mặc định trong ô input */
  defaultValue?: string;
  /** Màu nhấn chính cho nút Submit và nút nhanh active */
  accentColor?: string;
  /** Trạng thái đang submit (hiển thị spinner) */
  isSubmitting?: boolean;
  /** Loại bàn phím */
  keyboardType?: 'numeric' | 'decimal-pad';
}

export const InputModal: React.FC<InputModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  subtitle,
  unit,
  quickOptions,
  quickOptionUnit,
  defaultValue = '',
  accentColor = '#3B82F6',
  isSubmitting = false,
  keyboardType = 'numeric',
}) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [selectedQuick, setSelectedQuick] = useState<number | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Reset state khi mở modal
  useEffect(() => {
    if (visible) {
      setInputValue(defaultValue);
      setSelectedQuick(null);
      // Focus input sau khi modal mở hoàn toàn
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [visible, defaultValue]);

  const handleQuickSelect = (value: number) => {
    setSelectedQuick(value);
    setInputValue(String(value));
  };

  const handleSubmit = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue <= 0) return;
    onSubmit(numValue);
  };

  const isValid = (() => {
    const num = parseFloat(inputValue);
    return !isNaN(num) && num > 0;
  })();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.sheet}>
            {/* ── Drag Indicator ──────────────────────────────── */}
            <View style={styles.dragIndicator} />

            {/* ── Header ─────────────────────────────────────── */}
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>{title}</Text>
                {subtitle ? <Text style={styles.sheetSubtitle}>{subtitle}</Text> : null}
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.6}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* ── Quick Options ───────────────────────────────── */}
            {quickOptions && quickOptions.length > 0 && (
              <View style={styles.quickRow}>
                {quickOptions.map((opt) => {
                  const isActive = selectedQuick === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.quickButton,
                        isActive && { backgroundColor: accentColor, borderColor: accentColor },
                      ]}
                      onPress={() => handleQuickSelect(opt)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickButtonText,
                          isActive && { color: '#FFFFFF', fontWeight: '700' },
                        ]}
                      >
                        +{opt}{quickOptionUnit || ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* ── Input Field ────────────────────────────────── */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputValue}
                onChangeText={(text) => {
                  setInputValue(text);
                  setSelectedQuick(null);
                }}
                keyboardType={keyboardType}
                placeholder="0"
                placeholderTextColor={colors.textSecondary + '60'}
                selectionColor={accentColor}
              />
              <Text style={styles.inputUnit}>{unit}</Text>
            </View>

            {/* ── Submit Button ───────────────────────────────── */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: accentColor },
                !isValid && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Lưu</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  keyboardAvoid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 12,
    // Shadow cho sheet
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary + '40',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  sheetSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  quickButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 16 : 4,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  input: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    paddingVertical: 0,
  },
  inputUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
