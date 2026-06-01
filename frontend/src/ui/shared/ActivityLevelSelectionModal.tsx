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
import { updateProfileAndCalculateGoal } from '@/src/api/userService';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';
import { calculateNutritionalGoals } from '@/src/core/calculateNutrition';

interface ActivityLevelSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const ACTIVITY_OPTIONS = [
  { id: 1.2, title: 'Ngồi nhiều', icon: '💻', desc: 'Làm việc văn phòng, ít hoặc không tập thể dục' },
  { id: 1.375, title: 'Vận động nhẹ', icon: '🚶', desc: 'Đi bộ, làm việc nhà, tập thể dục nhẹ 1-3 ngày/tuần' },
  { id: 1.55, title: 'Vận động vừa', icon: '🏃', desc: 'Tập thể dục/thể thao vừa phải 3-5 ngày/tuần' },
  { id: 1.725, title: 'Năng động', icon: '🔥', desc: 'Tập thể dục/thể thao cường độ cao 6-7 ngày/tuần' },
  { id: 1.9, title: 'Cường độ cao', icon: '🏋️', desc: 'Vận động viên hoặc công việc lao động rất nặng' },
] as const;

export const ActivityLevelSelectionModal: React.FC<ActivityLevelSelectionModalProps> = ({ visible, onClose }) => {
  const { userProfile, userId, updateUserProfile } = useAppStore();
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const [selectedActivity, setSelectedActivity] = useState<number>(userProfile.activityLevel || 1.375);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedActivity(userProfile.activityLevel || 1.375);
      setIsLoading(false);
    }
  }, [visible, userProfile.activityLevel]);

  const handleConfirm = async () => {
    if (selectedActivity === userProfile.activityLevel) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const w = userProfile.currentWeight || userProfile.weight || 70;
      const h = userProfile.height || 170;
      const a = userProfile.age || 25;
      const g = userProfile.gender || 'Nam';
      const act = selectedActivity;

      // 1. TÍNH TOÁN NỘI BỘ (FALLBACK / OPTIMISTIC UPDATE)
      const goals = calculateNutritionalGoals({
        weight: w,
        height: h,
        age: a,
        gender: g,
        goal: userProfile.goal || 'maintain_weight',
        activityLevel: act
      });

      updateUserProfile({
         activityLevel: act,
         ...goals
      });

      // 2. ĐỒNG BỘ VỚI SERVER
      if (userId) {
        const responseData = await updateProfileAndCalculateGoal(userId, {
          age: a,
          gender: g,
          height: h,
          weight: w,
          activityLevel: act,
          goal: userProfile.goal || 'maintain_weight',
          name: userProfile.name
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
      console.log('Lỗi API đồng bộ hệ số vận động (sử dụng fallback local):', error);
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
          <Text style={styles.title}>Hệ số vận động</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isLoading}>
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {ACTIVITY_OPTIONS.map((item) => {
            const isSelected = selectedActivity === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelectedActivity(item.id)}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <View style={styles.iconBox}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, isSelected && { color: colors.primary }]}>
                    {item.title}
                  </Text>
                  <Text style={styles.optionDesc}>{item.desc}</Text>
                </View>
                <View style={[styles.radioCircle, isSelected && { borderColor: colors.primary }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
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
    padding: 12,
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
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  radioCircle: {
    width: 22, height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioInner: {
    width: 10, height: 10,
    borderRadius: 5,
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
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
