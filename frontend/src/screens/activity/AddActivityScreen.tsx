import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';
import { useAppStore } from '@/src/store/useAppStore';
import { ACTIVITIES, Activity } from '@/src/ui/AddActivityModal';

// --- Constants ---
const DEFAULT_MINUTES = 30;
const MIN_MINUTES = 5;
const MAX_MINUTES = 300;
const STEP = 5;

const AddActivityScreen = () => {
  const router = useRouter();
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [step, setStep] = useState<'select' | 'duration'>('select');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [inputText, setInputText] = useState(String(DEFAULT_MINUTES));

  const { addLoggedActivity } = useAppStore();

  const handlePickActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setStep('duration');
  };

  const handleBack = () => {
    if (step === 'duration') {
      setStep('select');
    } else {
      router.back();
    }
  };

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

  const handleConfirm = () => {
    if (!selectedActivity) return;
    const caloriesBurned = Math.round(selectedActivity.caloriesPerMin * minutes);
    addLoggedActivity({
      id: selectedActivity.id,
      minutes,
      caloriesBurned,
    });
    router.back();
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={styles.activityRow}
      onPress={() => handlePickActivity(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
        <MaterialCommunityIcons name={item.icon as any} size={26} color={item.iconColor} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.activityName}>{item.name}</Text>
        <Text style={styles.activitySub}>{item.caloriesPerMin} kcal/phút</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === 'select' ? 'Thêm hoạt động' : 'Thời gian tập'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {step === 'select' ? (
          <FlatList
            data={ACTIVITIES}
            keyExtractor={(item) => item.id}
            renderItem={renderActivityItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.durationContainer}>
            {selectedActivity && (
              <View style={styles.selectedActivityCard}>
                <View style={[styles.iconCircle, { backgroundColor: selectedActivity.bgColor }]}>
                  <MaterialCommunityIcons
                    name={selectedActivity.icon as any}
                    size={28}
                    color={selectedActivity.iconColor}
                  />
                </View>
                <View>
                  <Text style={styles.selectedName}>{selectedActivity.name}</Text>
                  <Text style={styles.selectedSub}>{selectedActivity.caloriesPerMin} kcal / phút</Text>
                </View>
              </View>
            )}

            <Text style={styles.label}>Bạn đã tập bao nhiêu lâu?</Text>

            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepBtn, minutes <= MIN_MINUTES && styles.disabledBtn]}
                onPress={handleDecrease}
                disabled={minutes <= MIN_MINUTES}
              >
                <MaterialCommunityIcons name="minus" size={28} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.minutesInput}
                  value={inputText}
                  onChangeText={handleInputChange}
                  onBlur={handleBlur}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                <Text style={styles.unitText}>phút</Text>
              </View>

              <TouchableOpacity
                style={[styles.stepBtn, minutes >= MAX_MINUTES && styles.disabledBtn]}
                onPress={handleIncrease}
                disabled={minutes >= MAX_MINUTES}
              >
                <MaterialCommunityIcons name="plus" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="fire" size={20} color={colors.danger} />
              <Text style={styles.summaryText}>
                Ước tính tiêu thụ: <Text style={styles.caloriesText}>
                  {Math.round((selectedActivity?.caloriesPerMin || 0) * minutes)} kcal
                </Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
              <Text style={styles.confirmBtnText}>Hoàn tất</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    listContent: {
      padding: 16,
    },
    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    iconCircle: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    rowContent: {
      flex: 1,
    },
    activityName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    activitySub: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    durationContainer: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
    },
    selectedActivityCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 20,
      width: '100%',
      marginBottom: 40,
    },
    selectedName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    selectedSub: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 24,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 40,
    },
    stepBtn: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    disabledBtn: {
      opacity: 0.3,
    },
    inputWrapper: {
      alignItems: 'center',
      marginHorizontal: 30,
    },
    minutesInput: {
      fontSize: 64,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    unitText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '600',
      marginTop: -8,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.danger + '15',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 40,
    },
    summaryText: {
      marginLeft: 8,
      fontSize: 15,
      color: colors.danger,
      fontWeight: '500',
    },
    caloriesText: {
      fontWeight: '700',
    },
    confirmBtn: {
      backgroundColor: colors.primary,
      width: '100%',
      paddingVertical: 18,
      borderRadius: 20,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    confirmBtnText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },
  });

export default AddActivityScreen;
