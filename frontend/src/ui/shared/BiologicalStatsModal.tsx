import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store/useAppStore';
import { updateProfileAndCalculateGoal } from '@/src/api/userService';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';
import { calculateNutritionalGoals } from '@/src/core/calculateNutrition';

interface BiologicalStatsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const BiologicalStatsModal: React.FC<BiologicalStatsModalProps> = ({ visible, onClose }) => {
  const { userProfile, userId, updateUserProfile } = useAppStore();
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const [gender, setGender] = useState<string>(userProfile.gender || 'male');
  const [age, setAge] = useState<number>(userProfile.age || 25);
  const [height, setHeight] = useState<number>(userProfile.height || 170);
  const [weight, setWeight] = useState<number>(userProfile.weight || 70);
  const [activityLevel, setActivityLevel] = useState<number>(userProfile.activityLevel || 1.375);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when modal is opened
  useEffect(() => {
    if (visible) {
      setGender(userProfile.gender || 'male');
      setAge(userProfile.age || 25);
      setHeight(userProfile.height || 170);
      setWeight(userProfile.weight || 70);
      setActivityLevel(userProfile.activityLevel || 1.375);
      setIsLoading(false);
    }
  }, [visible, userProfile]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const g = gender;
      const a = age;
      const h = height;
      const w = weight;
      const act = activityLevel;

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
        gender: g,
        age: a,
        height: h,
        weight: w,
        currentWeight: w,
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
      console.log('Lỗi API đồng bộ chỉ số sinh lý (sử dụng fallback local):', error);
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
          <Text style={styles.title}>Chỉ số sinh lý</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isLoading}>
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {/* Giới tính */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.genderContainer}>
                {([
                  { label: 'Nam', value: 'male', icon: 'male' },
                  { label: 'Nữ', value: 'female', icon: 'female' }
                ] as const).map((g) => {
                  const isSelected = gender === g.value || (g.value === 'male' && gender === 'Nam') || (g.value === 'female' && gender === 'Nữ');
                  return (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => setGender(g.value)}
                      style={[styles.genderBtn, isSelected && styles.genderBtnSelected]}
                      disabled={isLoading}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={g.icon as any} 
                        size={20} 
                        color={isSelected ? colors.background : colors.textSecondary} 
                        style={{ marginRight: 6 }} 
                      />
                      <Text style={[styles.genderBtnText, isSelected && styles.genderBtnTextSelected]}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Tuổi */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tuổi</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() => setAge(Math.max(1, age - 1))}
                  style={styles.counterBtn}
                  disabled={isLoading}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{age}</Text>
                <TouchableOpacity
                  onPress={() => setAge(Math.min(120, age + 1))}
                  style={styles.counterBtn}
                  disabled={isLoading}
                >
                  <Ionicons name="add" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chiều cao */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Chiều cao (cm)</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() => setHeight(Math.max(100, height - 1))}
                  style={styles.counterBtn}
                  disabled={isLoading}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{height}</Text>
                <TouchableOpacity
                  onPress={() => setHeight(Math.min(250, height + 1))}
                  style={styles.counterBtn}
                  disabled={isLoading}
                >
                  <Ionicons name="add" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cân nặng */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cân nặng (kg)</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() => setWeight(Math.max(30, weight - 1))}
                  style={styles.counterBtn}
                  disabled={isLoading}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{weight}</Text>
                <TouchableOpacity
                  onPress={() => setWeight(Math.min(250, weight + 1))}
                  style={styles.counterBtn}
                  disabled={isLoading}
                >
                  <Ionicons name="add" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Hệ số vận động */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hệ số vận động</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                {([
                  { id: 1.2, title: 'Ngồi nhiều', icon: '💻', desc: 'Văn phòng' },
                  { id: 1.375, title: 'Nhẹ', icon: '🚶', desc: 'Đi bộ' },
                  { id: 1.55, title: 'Vừa', icon: '🏃', desc: '3-5 buổi' },
                  { id: 1.725, title: 'Nặng', icon: '🔥', desc: '6-7 buổi' },
                  { id: 1.9, title: 'Rất nặng', icon: '🏋️', desc: 'VĐV' }
                ] as const).map((act) => {
                  const isSelected = activityLevel === act.id;
                  return (
                    <TouchableOpacity
                      key={act.id}
                      onPress={() => setActivityLevel(act.id)}
                      style={[styles.activityBtn, isSelected && styles.activityBtnSelected]}
                      disabled={isLoading}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 18, marginBottom: 2 }}>{act.icon}</Text>
                      <Text style={[styles.activityBtnText, isSelected && styles.activityBtnTextSelected]}>
                        {act.title}
                      </Text>
                      <Text style={[styles.activityBtnDesc, isSelected && styles.activityBtnDescSelected]}>
                        {act.desc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>
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
              <Text style={styles.confirmText}>Lưu & Cập nhật chỉ số</Text>
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
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  genderBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  genderBtnTextSelected: {
    color: colors.background,
  },
  activityBtn: {
    width: 100,
    padding: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  activityBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activityBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  activityBtnTextSelected: {
    color: colors.background,
  },
  activityBtnDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  activityBtnDescSelected: {
    color: colors.background,
    opacity: 0.8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
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
