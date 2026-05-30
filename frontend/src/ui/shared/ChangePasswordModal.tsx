import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store/useAppStore';
import { changePassword } from '@/src/api/userService';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const { userId } = useAppStore();
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Clear inputs when modal visible state changes
  useEffect(() => {
    if (visible) {
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setIsLoading(false);
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (!newPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      if (!userId) {
        throw new Error('Không tìm thấy ID người dùng');
      }
      await changePassword(userId, newPassword);
      
      if (Platform.OS === 'web') {
        alert('Đổi mật khẩu thành công!');
      } else {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
      }
      onClose();
    } catch (err: any) {
      const serverData = err.response?.data;
      const msg = typeof serverData === 'string'
        ? serverData
        : (serverData?.message || serverData?.error || err.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} disabled={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Đổi mật khẩu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isLoading}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Mật khẩu mới */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <TextInput
                style={styles.input}
                placeholder="Ít nhất 8 ký tự"
                placeholderTextColor={colors.textSecondary + '70'}
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errorMsg) setErrorMsg('');
                }}
                editable={!isLoading}
              />
            </View>

            {/* Xác nhận mật khẩu mới */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor={colors.textSecondary + '70'}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMsg) setErrorMsg('');
                }}
                editable={!isLoading}
              />
            </View>

            {errorMsg ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.confirmBtn, isLoading && styles.confirmBtnDisabled]} 
              onPress={handleConfirm}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmText}>Cập nhật mật khẩu</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  keyboardAvoid: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 36,
  },
  handle: {
    alignSelf: 'center',
    width: 40, height: 4,
    backgroundColor: colors.cardBorder,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  confirmBtn: {
    backgroundColor: colors.primary || '#00C48C',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
