/**
 * @file AddActivityModal.tsx
 * @description Modal BottomSheet 2 bước:
 *   Bước 1 — Chọn bài tập từ danh sách
 *   Bước 2 — Điều chỉnh thời gian tập (phút) bằng stepper +/-
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Platform,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  bgColor: string;
  /** kcal/phút (ước tính) */
  caloriesPerMin: number;
}

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
  /** Trả về activity + số phút đã chọn */
  onSelectActivity: (activity: Activity, minutes: number) => void;
}

interface DurationStepProps {
  activity: Activity;
  initialMinutes: number;
  onConfirm: (minutes: number) => void;
  onBack: () => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ACTIVITIES: Activity[] = [
  { id: 'swimming',       name: 'Bơi lội',   icon: 'swim',         iconColor: '#3B82F6', bgColor: '#EFF6FF', caloriesPerMin: 8  },
  { id: 'jump_rope',      name: 'Nhảy dây',  icon: 'jump-rope',    iconColor: '#F59E0B', bgColor: '#FEF3C7', caloriesPerMin: 11 },
  { id: 'yoga',           name: 'Yoga',      icon: 'yoga',         iconColor: '#8B5CF6', bgColor: '#EDE9FE', caloriesPerMin: 4  },
  { id: 'running',        name: 'Chạy bộ',   icon: 'run-fast',     iconColor: '#EF4444', bgColor: '#FEE2E2', caloriesPerMin: 10 },
  { id: 'cycling',        name: 'Đạp xe',    icon: 'bike',         iconColor: '#10B981', bgColor: '#D1FAE5', caloriesPerMin: 7  },
  { id: 'weight_training',name: 'Tập tạ',    icon: 'dumbbell',     iconColor: '#64748B', bgColor: '#F1F5F9', caloriesPerMin: 6  },
];

const DEFAULT_MINUTES = 30;
const MIN_MINUTES = 5;
const MAX_MINUTES = 300;
const STEP = 5;

// ─── Component: Dòng bài tập (Row) ──────────────────────────────────────────

const ActivityRow: React.FC<{ item: Activity; onPress: (a: Activity) => void }> = ({ item, onPress }) => {
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
        <MaterialCommunityIcons name={item.icon} size={24} color={item.iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowName}>{item.name}</Text>
        <Text style={styles.rowSub}>Đốt cháy: {item.caloriesPerMin} kcal/phút</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

// ─── Duration Stepper (Bước 2) ───────────────────────────────────────────────

const DurationStep: React.FC<DurationStepProps> = ({
  activity,
  initialMinutes,
  onConfirm,
  onBack,
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [inputText, setInputText] = useState(String(initialMinutes));
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const handleDecrease = () => {
    const val = Math.max(MIN_MINUTES, minutes - STEP);
    setMinutes(val);
    setInputText(String(val));
  };

  const handleIncrease = () => {
    const val = Math.min(MAX_MINUTES, minutes + STEP);
    setMinutes(val);
    setInputText(String(val));
  };

  const handleInputChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setInputText(cleaned);
  };

  const handleBlur = () => {
    let parsed = parseInt(inputText, 10);
    if (isNaN(parsed) || parsed < MIN_MINUTES) {
      parsed = MIN_MINUTES;
    } else if (parsed > MAX_MINUTES) {
      parsed = MAX_MINUTES;
    }
    setMinutes(parsed);
    setInputText(String(parsed));
  };

  const currentInputVal = parseInt(inputText, 10) || 0;
  const estimatedCals = Math.round(activity.caloriesPerMin * currentInputVal);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.stepContainer}>
        <View style={styles.selectedActivity}>
          <View style={[styles.iconCircle, { backgroundColor: activity.bgColor }]}>
            <MaterialCommunityIcons name={activity.icon} size={24} color={activity.iconColor} />
          </View>
          <View>
            <Text style={styles.selectedName}>{activity.name}</Text>
            <Text style={styles.selectedSub}>{activity.caloriesPerMin} kcal / phút</Text>
          </View>
        </View>

        <Text style={styles.durationLabel}>Thời gian tập</Text>

        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.stepBtn, minutes <= MIN_MINUTES && styles.stepBtnDisabled]}
            onPress={handleDecrease}
            activeOpacity={0.7}
            disabled={minutes <= MIN_MINUTES}
          >
            <MaterialCommunityIcons
              name="minus"
              size={22}
              color={minutes <= MIN_MINUTES ? colors.textSecondary : colors.text}
            />
          </TouchableOpacity>

          <View style={styles.minutesDisplay}>
            <TextInput
              style={styles.minutesInput}
              value={inputText}
              onChangeText={handleInputChange}
              onBlur={handleBlur}
              keyboardType="number-pad"
              maxLength={3}
              returnKeyType="done"
            />
            <Text style={styles.minutesUnit}>phút</Text>
          </View>

          <TouchableOpacity
            style={[styles.stepBtn, minutes >= MAX_MINUTES && styles.stepBtnDisabled]}
            onPress={handleIncrease}
            activeOpacity={0.7}
            disabled={minutes >= MAX_MINUTES}
          >
            <MaterialCommunityIcons
              name="plus"
              size={22}
              color={minutes >= MAX_MINUTES ? colors.textSecondary : colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.calPreview}>
          <MaterialCommunityIcons name="fire" size={16} color={colors.danger} />
          <Text style={styles.calPreviewText}>
            Ước tính đốt cháy: <Text style={{ fontWeight: '700' }}>{estimatedCals} kcal</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8} onPress={() => { handleBlur(); onConfirm(minutes); }}>
          <Text style={styles.confirmText}>Xác nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.6}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textSecondary} />
          <Text style={styles.backText}>Chọn môn khác</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  visible,
  onClose,
  onSelectActivity,
}) => {
  const [step, setStep] = useState<'select' | 'duration'>('select');
  const [selected, setSelected] = useState<Activity | null>(null);

  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const handleClose = useCallback(() => {
    setStep('select');
    setSelected(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!visible) {
      setStep('select');
      setSelected(null);
    }
  }, [visible]);

  const handlePickActivity = useCallback((activity: Activity) => {
    setSelected(activity);
    setStep('duration');
  }, []);

  const handleConfirm = useCallback((finalMinutes: number) => {
    if (!selected) return;
    onSelectActivity(selected, finalMinutes);
    handleClose();
  }, [selected, onSelectActivity, handleClose]);

  const isStep2 = step === 'duration' && selected !== null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>
            {isStep2 ? 'Thời gian tập' : 'Chọn bài tập'}
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeBtn}
            activeOpacity={0.6}
          >
            <MaterialCommunityIcons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isStep2 ? (
          <DurationStep
            activity={selected!}
            initialMinutes={DEFAULT_MINUTES}
            onConfirm={handleConfirm}
            onBack={() => setStep('select')}
          />
        ) : (
          <FlatList
            data={ACTIVITIES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ActivityRow item={item} onPress={handlePickActivity} />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bước 1 ──────────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.surface,
    marginLeft: 68,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowSub:  { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },

  // ── Bước 2 ──────────────────────────────────────────────────────────────────
  stepContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  selectedActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  selectedName: { fontSize: 16, fontWeight: '700', color: colors.text },
  selectedSub:  { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  durationLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: colors.surface,
  },
  minutesDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  minutesInput: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 56,
    textAlign: 'center',
    minWidth: 100,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  minutesUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: -4,
  },

  // Preview calo
  calPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.danger + '10',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  calPreviewText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '500',
  },

  // Nút xác nhận
  confirmBtn: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },

  // Quay lại
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
