import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store/useAppStore';
import { syncOnboardingProfile } from '@/src/api/authService';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

interface GoalSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const GOAL_OPTIONS = [
  { id: 'lose_weight', title: 'Giảm cân', icon: 'trending-down', color: '#10B981', bg: '#D1FAE5', desc: 'Thâm hụt calo an toàn để giảm mỡ' },
  { id: 'maintain_weight', title: 'Giữ dáng', icon: 'body', color: '#3B82F6', bg: '#DBEAFE', desc: 'Duy trì cân nặng và thể trạng hiện tại' },
  { id: 'gain_muscle', title: 'Tăng cơ', icon: 'barbell', color: '#EF4444', bg: '#FEE2E2', desc: 'Thặng dư calo để xây dựng cơ bắp' },
] as const;

export const GoalSelectionModal: React.FC<GoalSelectionModalProps> = ({ visible, onClose }) => {
  const { userProfile, userId, updateUserProfile } = useAppStore();
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const [selectedGoal, setSelectedGoal] = useState<string>(userProfile.goal || 'maintain_weight');
  const [isLoading, setIsLoading] = useState(false);

  // Cập nhật lại lựa chọn mặc định khi mở modal
  useEffect(() => {
    if (visible) {
      setSelectedGoal(userProfile.goal || 'maintain_weight');
      setIsLoading(false);
    }
  }, [visible, userProfile.goal]);

  const handleConfirm = async () => {
    if (selectedGoal === userProfile.goal) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      // 1. TÍNH TOÁN NỘI BỘ (FALLBACK / OPTIMISTIC UPDATE)
      const w = userProfile.currentWeight || userProfile.weight || 70;
      const h = userProfile.height || 170;
      const a = userProfile.age || 25;
      const g = userProfile.gender || 'Nam';
      
      let bmr = 10 * w + 6.25 * h - 5 * a;
      bmr += (g === 'Nam' ? 5 : -161);
      
      let tdee = bmr * 1.2; // Sedentary baseline
      
      if (selectedGoal === 'lose_weight') tdee -= 500;
      else if (selectedGoal === 'gain_muscle') tdee += 500;
      
      // Update store 
      updateUserProfile({
         goal: selectedGoal as any,
         targetCalories: Math.round(tdee),
         targetProtein: Math.round((tdee * 0.3) / 4),
         targetCarb: Math.round((tdee * 0.45) / 4),
         targetFat: Math.round((tdee * 0.25) / 9)
      });

      // 2. ĐỒNG BỘ VỚI SERVER
      if (userId) {
        const responseData = await syncOnboardingProfile(userId, {
          ...userProfile,
          goal: selectedGoal,
          targetCalories: undefined,
          targetProtein: undefined,
          targetCarb: undefined,
          targetFat: undefined
        });

        // Nếu API trả về data hợp lệ, ghi đè lại bằng kết quả chính xác của server
        if (responseData && responseData.data && responseData.data.targetCalories) {
           const newData = responseData.data;
           updateUserProfile({
              targetCalories: Math.round(newData.targetCalories),
              targetProtein: Math.round(newData.targetProtein || 0),
              targetCarb: Math.round(newData.targetCarb || 0),
              targetFat: Math.round(newData.targetFat || 0)
           });
        }
      }
    } catch (error) {
      console.log('Lỗi API đồng bộ mục tiêu (sử dụng fallback local):', error);
      // Không cần làm gì thêm vì đã có Optimistic Update ở bước 1
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} disabled={isLoading} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Chọn mục tiêu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isLoading}>
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {GOAL_OPTIONS.map((item) => {
            const isSelected = selectedGoal === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelectedGoal(item.id)}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, isSelected && { color: item.color }]}>
                    {item.title}
                  </Text>
                  <Text style={styles.optionDesc}>{item.desc}</Text>
                </View>
                <View style={[styles.radioCircle, isSelected && { borderColor: item.color }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: item.color }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
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
              <Text style={styles.confirmText}>Lưu & Cập nhật lộ trình</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 36,
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
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 48, height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  radioCircle: {
    width: 24, height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioInner: {
    width: 12, height: 12,
    borderRadius: 6,
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
