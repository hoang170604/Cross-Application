import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Import Atomic Hooks & Components ─────────────────────────────────────────
import { useFasting, useNutrition } from '@/src/hooks';
import { FastingTimerCard } from '@/src/components/organisms/FastingTimerCard';
import { WaterTrackerCard } from '@/src/components/organisms/WaterTrackerCard';
import { AppButton } from '@/src/components/atoms/AppButton';

const FASTING_PLANS = [
  { goal: 14, label: '14:10', icon: '🐱', title: '14:10 (Người mới)', desc: 'Dành cho người mới bắt đầu' },
  { goal: 16, label: '16:8', icon: '🦊', title: '16:8 (Phổ biến)', desc: 'Chế độ tiêu chuẩn, dễ duy trì' },
  { goal: 18, label: '18:6', icon: '🐯', title: '18:6 (Nâng cao)', desc: 'Tối ưu hóa đốt mỡ' },
  { goal: 20, label: '20:4', icon: '🦁', title: '20:4 (Chiến binh)', desc: 'Kích hoạt sâu Autophagy' },
];

export default function FastingTrackerScreen() {
  // Sử dụng Hook chuyên biệt useFasting
  const { 
    userProfile, 
    startFasting, 
    endFasting, 
    stopFastingLoop, 
    setFastingGoal 
  } = useFasting();

  // useNutrition để xử lý nước uống
  const { addWater } = useNutrition();

  const [now, setNow] = useState(Date.now());
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const hasWarned48h = React.useRef(false);

  // ─── Logic Tick & Cảnh báo an toàn ───────────────────────────────────────
  useEffect(() => {
    if (!userProfile.isFasting) {
      hasWarned48h.current = false;
      return;
    }
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      
      if (userProfile.fastingState === 'FASTING' && userProfile.fastingStartTime) {
        const elapsedHours = (currentTime - userProfile.fastingStartTime) / (1000 * 60 * 60);
        if (elapsedHours >= 48 && !hasWarned48h.current) {
          hasWarned48h.current = true;
          const msg = 'Cảnh báo an toàn ⚠️\nPhiên nhịn ăn của bạn đã vượt quá 48 giờ liên tục. Hãy đảm bảo bạn có sự theo dõi của bác sĩ hoặc kết thúc ngay để bảo vệ sức khỏe.';
          Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Cảnh báo an toàn ⚠️', msg);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [userProfile.isFasting, userProfile.fastingState, userProfile.fastingStartTime]);

  // ─── Memoized Calculations ─────────────────────────────────────────────────
  const activeGoal = userProfile.fastingGoal || 16;
  const currentState = userProfile.isFasting ? (userProfile.fastingState || 'FASTING') : 'IDLE';
  const clockStart = userProfile.fastingStartTime || now;
  const elapsedMs = userProfile.isFasting ? Math.max(0, now - clockStart) : 0;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  const bioInfo = useMemo(() => {
    if (currentState === 'IDLE') return {
      title: "Sẵn sàng (Idle)",
      desc: "Bấm bắt đầu nhịn ăn để kích hoạt đồng hồ theo dõi sinh lý cơ thể. Hãy thử thách bản thân!",
      color: "#94A3B8", badge: "Chưa bắt đầu"
    };
    if (currentState === 'EATING') return {
      title: "Giờ ăn (Eating) 🍽️",
      desc: "Giờ là lúc nạp lại năng lượng! Ưu tiên Protein và chất xơ để hấp thụ tốt nhất.",
      color: "#10B981", badge: "Đang ăn"
    };
    if (elapsedHours < 4) return {
      title: "Sugar Processing (0-4h)",
      desc: "Cơ thể đang xử lý năng lượng từ bữa ăn cuối cùng, lượng Insulin hiện tại đang tăng.",
      color: "#F59E0B", badge: "Tiêu hóa"
    };
    if (elapsedHours < 12) return {
      title: "Transition (4h-12h)",
      desc: "Đường huyết đã giảm đáng kể, cơ thể đang bắt đầu rút ra năng lượng từ Glycogen vùng gan.",
      color: "#F59E0B", badge: "Chuyển tiếp"
    };
    if (elapsedHours < 16) return {
      title: "Trạng thái Đốt mỡ (Ketosis) 🔥",
      desc: "Glycogen đã cạn, cơ thể chuyển hẳn sang đốt các khối mỡ dư thừa tạo thành Ketones.",
      color: "#EF4444", badge: "Đang đốt mỡ"
    };
    return {
      title: "Tái tạo tế bào (Autophagy) ✨",
      desc: "Giai đoạn dọn dẹp tế bào cũ (Autophagy) đã được kích hoạt. Cơ thể đang được trẻ hóa.",
      color: "#EF4444", badge: "Tái tạo"
    };
  }, [currentState, elapsedHours]);

  const timeMarkers = useMemo(() => {
    if (!userProfile.isFasting) return null;
    const targetMs = (currentState === 'EATING' ? (24 - activeGoal) : activeGoal) * 60 * 60 * 1000;
    const start = new Date(clockStart);
    const end = new Date(clockStart + targetMs);
    const fmt = (d: Date) => `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    return { start: fmt(start), end: fmt(end) };
  }, [userProfile.isFasting, clockStart, activeGoal, currentState]);

  // ─── Callbacks ─────────────────────────────────────────────────────────────
  const handleEndFasting = useCallback(() => {
    const totalSec = Math.floor((Date.now() - (userProfile.fastingStartTime || Date.now())) / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);

    const onApprove = () => {
      endFasting();
      setTimeout(() => {
        const msg = `Chúc mừng! 🎉\nBạn đã hoàn thành phiên nhịn kéo dài ${h} giờ ${m} phút.`;
        Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Chúc mừng! 🎉", msg);
      }, 600);
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Kết thúc phiên nhịn ăn?\nDữ liệu sẽ được lưu để Thống kê.")) onApprove();
    } else {
      Alert.alert("Kết thúc phiên nhịn?", "Dữ liệu sẽ được lưu vào lịch sử.", [
        { text: "Bỏ qua", style: "cancel" }, { text: "Đồng ý", onPress: onApprove }
      ]);
    }
  }, [userProfile.fastingStartTime, endFasting]);

  const onMainAction = useCallback(() => {
    if (currentState === 'IDLE' || currentState === 'EATING') startFasting(activeGoal);
    else if (currentState === 'FASTING') handleEndFasting();
  }, [currentState, activeGoal, startFasting, handleEndFasting]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Modal Chọn Chế Độ */}
      <Modal visible={isPickerVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsPickerVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn chế độ nhịn ăn</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              {FASTING_PLANS.map(plan => {
                const isSelected = activeGoal === plan.goal;
                return (
                  <TouchableOpacity 
                    key={plan.goal}
                    onPress={() => { setFastingGoal(plan.goal); setIsPickerVisible(false); }}
                    style={[styles.planItem, isSelected && styles.planItemActive]}
                  >
                    <Text style={{ fontSize: 32, marginRight: 16 }}>{plan.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.planTitle}>{plan.title}</Text>
                      <Text style={styles.planDesc}>{plan.desc}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={24} color="#10B981" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NHỊN ĂN</Text>
        <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.planBadge}>
          <Text style={styles.planBadgeText}>Thay đổi {activeGoal}h</Text>
          <Ionicons name="chevron-down" size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Organism: Fasting Timer Orchestrator */}
        <FastingTimerCard 
          isFasting={userProfile.isFasting || false}
          fastingState={currentState}
          startTime={userProfile.fastingStartTime || null}
          activeGoal={activeGoal}
          stageColor={bioInfo.color}
          stageBadge={bioInfo.badge}
          stageTitle={bioInfo.title}
          stageDesc={bioInfo.desc}
          buttonText={currentState === 'FASTING' ? 'Kết thúc nhịn ăn' : 'Bắt đầu nhịn ăn'}
          buttonColor={currentState === 'FASTING' ? '#EF4444' : '#10B981'}
          onMainAction={onMainAction}
        />

        {/* Start / End Markers */}
        {userProfile.isFasting && timeMarkers && (
          <View style={styles.markersContainer}>
            <View style={styles.markerColumn}>
              <Text style={styles.markerLabel}>Bắt đầu</Text>
              <Text style={styles.markerValue}>{timeMarkers.start}</Text>
            </View>
            <View style={styles.markerDivider} />
            <View style={styles.markerColumn}>
              <Text style={styles.markerLabel}>Dự kiến KT</Text>
              <Text style={styles.markerValue}>{timeMarkers.end}</Text>
            </View>
          </View>
        )}

        <View style={styles.statsRow}>
          {/* Streak Card */}
          <View style={styles.streakCard}>
            <Ionicons name="flame" size={32} color="#F59E0B" />
            <Text style={styles.streakValue}>{userProfile.streakCount || 1}</Text>
            <Text style={styles.streakLabel}>Streak ngày</Text>
          </View>

          {/* Water Tracker Card - REUSABLE ORGANISM */}
          <View style={{ flex: 1.5 }}>
            <WaterTrackerCard 
              intake={userProfile.waterIntake || 0}
              target={userProfile.waterTarget || 2000}
              onAddWater={() => addWater(200)}
            />
          </View>
        </View>

        {currentState === 'EATING' && (
          <AppButton 
            variant="ghost" 
            title="Bỏ theo dõi giờ Ăn" 
            onPress={stopFastingLoop} 
            style={{ marginTop: 8 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  planItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9' },
  planItemActive: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
  planTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  planDesc: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: 1 },
  planBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#F1F5F9' },
  planBadgeText: { fontSize: 13, fontWeight: '700', color: '#64748B', marginRight: 4 },
  markersContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  markerColumn: { flex: 1, alignItems: 'center' },
  markerLabel: { fontSize: 13, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase' },
  markerValue: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  markerDivider: { width: 1, height: '60%', backgroundColor: '#F1F5F9', alignSelf: 'center' },
  statsRow: { flexDirection: 'row', gap: 16 },
  streakCard: { flex: 1, backgroundColor: '#fff', borderRadius: 24, padding: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  streakValue: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginVertical: 4 },
  streakLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' },
});
