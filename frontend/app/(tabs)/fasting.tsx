import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useUserProfile } from '@/context/UserProfileContext';

export default function FastingTrackerScreen() {
  const { userProfile, startFasting, endFasting, stopFastingLoop, setFastingGoal, addWater } = useUserProfile();
  const [selectedGoal, setSelectedGoal] = useState<number>(16);
  const [now, setNow] = useState(Date.now());
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    setSelectedGoal(userProfile.fastingGoal || 16);
  }, [userProfile.fastingGoal]);

  const handleSelectPlan = (goal: number) => {
    setSelectedGoal(goal);
    if (setFastingGoal) setFastingGoal(goal);
    setIsPickerVisible(false);
  };

  const FASTING_PLANS = [
    { goal: 14, label: '14:10', icon: '🐱', title: '14:10 (Người mới)', desc: 'Dành cho người mới bắt đầu' },
    { goal: 16, label: '16:8', icon: '🦊', title: '16:8 (Phổ biến)', desc: 'Chế độ tiêu chuẩn, dễ duy trì' },
    { goal: 18, label: '18:6', icon: '🐯', title: '18:6 (Nâng cao)', desc: 'Tối ưu hóa đốt mỡ' },
    { goal: 20, label: '20:4', icon: '🦁', title: '20:4 (Chiến binh)', desc: 'Kích hoạt sâu Autophagy' },
  ];

  useEffect(() => {
    if (!userProfile.isFasting) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [userProfile.isFasting, userProfile.fastingState]);

  const currentState = userProfile.isFasting ? (userProfile.fastingState || 'FASTING') : 'IDLE';
  const isEating = currentState === 'EATING';
  const isFasting = currentState === 'FASTING';

  const activeGoal = userProfile.isFasting ? (userProfile.fastingGoal || 16) : selectedGoal;
  
  const fastingTargetMs = activeGoal * 60 * 60 * 1000;
  const eatingTargetMs = (24 - activeGoal) * 60 * 60 * 1000;
  const targetMs = isEating ? eatingTargetMs : fastingTargetMs;
  
  const clockStart = userProfile.isFasting && userProfile.fastingStartTime ? userProfile.fastingStartTime : Date.now();
  
  // ĐỒNG HỒ ĐẾM TIẾN (Count-up timer)
  const elapsedMs = userProfile.isFasting ? Math.max(0, now - clockStart) : 0;
  const displayMs = elapsedMs; // Hiện đúng tgian trôi qua
  
  const percentage = Math.min(100, Math.max(0, (elapsedMs / targetMs) * 100));
  const circumference = 2 * Math.PI * 112;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  // LOGIC SINH HỌC & TRẠNG THÁI HIỂN THỊ (@skill.md)
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  
  let stageTitle = "Sẵn sàng (Idle)";
  let stageDesc = "Bấm bắt đầu nhịn ăn để kích hoạt đồng hồ theo dõi sinh lý cơ thể. Hãy thử thách bản thân!";
  let stageColor = "#9CA3AF"; // slate-400
  let stageBadge = "Chưa kết nối";

  if (currentState !== 'IDLE') {
    if (isEating) {
      stageTitle = "Đang nạp năng lượng (Eating) 🍽️";
      stageDesc = "Giờ là lúc nạp lại năng lượng! Ưu tiên Protein và chất xơ để hấp thụ tốt nhất. Chia nhỏ bữa ăn sẽ rất có ích.";
      stageColor = "#10B981"; // emerald-500
      stageBadge = "Đang ăn";
    } else {
      if (elapsedHours < 4) {
        stageTitle = "Sugar Processing (0-4h)";
        stageDesc = "Cơ thể đang xử lý năng lượng từ bữa ăn cuối cùng, lượng Insulin hiện tại đang tăng để bù đắp tiêu hóa.";
        stageColor = "#F59E0B"; // amber-500
        stageBadge = "Tiêu hóa";
      } else if (elapsedHours < 12) {
        stageTitle = "Transition (4h-12h)";
        stageDesc = "Đường huyết đã giảm đáng kể, cơ thể đang bắt đầu rút ra nguồn năng lượng từ Glycogen trong vùng gan.";
        stageColor = "#F59E0B"; // amber-500
        stageBadge = "Chuyển tiếp";
      } else if (elapsedHours < 16) {
        stageTitle = "Trạng thái Đốt mỡ (Ketosis) 🔥";
        stageDesc = "Glycogen đã đạt điểm cạn, giờ đây cơ thể chuyển hẵn sang đốt các khối mỡ dư thừa tạo thành Ketones. Bạn đang giảm cân!";
        stageColor = "#EF4444"; // red-500
        stageBadge = "Đang đốt mỡ";
      } else {
        stageTitle = "Tái tạo tế bào (Autophagy) ✨";
        stageDesc = "Giai đoạn dọn dẹp tế bào cũ/lỗi (Autophagy) đã được kích hoạt. Cơ thể đang được trẻ hóa mạnh mẽ từ sâu bên trong.";
        stageColor = "#EF4444"; // red-500
        stageBadge = "Tái tạo";
      }
    }
  }

  const startDateObj = new Date(clockStart);
  const startDateStr = `${startDateObj.getHours().toString().padStart(2,'0')}:${startDateObj.getMinutes().toString().padStart(2,'0')}`;
  
  const endDateObj = new Date(clockStart + targetMs);
  const endDateStr = `${endDateObj.getHours().toString().padStart(2,'0')}:${endDateObj.getMinutes().toString().padStart(2,'0')}`;

  const handleEndFasting = useCallback(() => {
    const nowMs = Date.now();
    const startMs = userProfile.fastingStartTime || nowMs;
    const totalSeconds = Math.floor((nowMs - startMs) / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);

    const onApprove = () => {
      endFasting(); // Gọi hàm ở Context: Tắt Fasting -> Lưu Session -> Mở vòng lặp Eating -> Reset bộ đếm giờ
      setTimeout(() => {
        if (Platform.OS === 'web') {
          window.alert(`Chúc mừng! 🎉\nBạn đã hoàn thành phiên nhịn kéo dài ${h} giờ ${m} phút.\nGiờ là lúc nạp lại năng lượng! Ưu tiên Protein và chất xơ để hấp thụ tốt nhất.`);
        } else {
          Alert.alert(
            "Chúc mừng! 🎉", 
            `Bạn đã hoàn thành phiên nhịn kéo dài ${h} giờ ${m} phút.\nGiờ là lúc nạp lại năng lượng! Ưu tiên Protein và chất xơ để hấp thụ tốt nhất.`
          );
        }
      }, 600);
    };

    if (Platform.OS === 'web') {
      const isConfirmed = window.confirm("Kết thúc phiên nhịn ăn?\nDữ liệu sẽ được lưu để Thống kê. Hệ thống sẽ chuyển sang chế độ đo Giờ Ăn.");
      if (isConfirmed) onApprove();
    } else {
      Alert.alert(
        "Kết thúc phiên nhịn ăn?",
        "Dữ liệu của bạn sẽ được lưu vào lịch sử để Thống kê. Hệ thống sẽ chuyển sang chế độ đo Giờ Ăn.",
        [
          { text: "Bỏ qua", style: "cancel" },
          { text: "Đồng ý", onPress: onApprove }
        ]
      );
    }
  }, [userProfile.fastingStartTime, endFasting]);

  const onMainAction = useCallback(() => {
    if (currentState === 'IDLE' || currentState === 'EATING') {
      startFasting(currentState === 'EATING' ? activeGoal : selectedGoal);
    } else if (currentState === 'FASTING') {
      handleEndFasting();
    }
  }, [currentState, activeGoal, selectedGoal, startFasting, handleEndFasting]);

  const buttonText = currentState === 'FASTING' ? 'Kết thúc nhịn ăn' : 'Bắt đầu nhịn ăn';
  const buttonColor = currentState === 'FASTING' ? '#EF4444' : '#10B981'; // Đỏ (ngừng) - Xanh Mint (bắt đầu) theo UI-kit

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Modal Chọn Chế Độ */}
      <Modal visible={isPickerVisible} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setIsPickerVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>Chọn chế độ nhịn ăn</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              {FASTING_PLANS.map(plan => {
                 const isSelected = activeGoal === plan.goal;
                 return (
                   <TouchableOpacity 
                     key={plan.goal}
                     onPress={() => handleSelectPlan(plan.goal)}
                     style={{
                       flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16,
                       backgroundColor: isSelected ? '#F8FAFC' : '#fff',
                       borderWidth: 1, borderColor: isSelected ? '#10B981' : '#E2E8F0'
                     }}
                   >
                     <Text style={{ fontSize: 32, marginRight: 16 }}>{plan.icon}</Text>
                     <View style={{ flex: 1 }}>
                       <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 }}>{plan.title}</Text>
                       <Text style={{ fontSize: 13, color: '#6B7280' }}>{plan.desc}</Text>
                     </View>
                     {isSelected && <Ionicons name="checkmark-circle" size={24} color="#10B981" />}
                   </TouchableOpacity>
                 );
              })}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F8FAFC', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', letterSpacing: 1, color: '#111827' }}>NHỊN ĂN</Text>
        <TouchableOpacity 
          onPress={() => setIsPickerVisible(true)}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#E2E8F0' }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginRight: 4 }}>Thay đổi</Text>
          <Ionicons name="chevron-down" size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Đồng hồ đếm tiến */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 32, marginBottom: 24, alignItems: 'center',
          borderWidth: 1, borderColor: '#F1F5F9',
          shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
        }}>
          <View style={{ width: 256, height: 256, marginBottom: 8, marginTop: 16, position: 'relative' }}>
            <Svg width={256} height={256} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={128} cy={128} r={112} stroke="#F1F5F9" strokeWidth={24} fill="none" />
              <Circle
                cx={128} cy={128} r={112}
                stroke={userProfile.isFasting ? stageColor : "#10B981"} strokeWidth={24} fill="none"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - (userProfile.isFasting ? percentage / 100 : 0))}`}
                strokeLinecap="round"
              />
            </Svg>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>
                 {userProfile.fastingState === 'EATING' ? '🥗' : (() => {
                   if (activeGoal <= 14) return '🐱';
                   if (activeGoal <= 16) return '🦊';
                   if (activeGoal <= 18) return '🐯';
                   if (activeGoal <= 20) return '🦁';
                   return '🐉';
                 })()}
              </Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: '#111827', marginBottom: 8 }}>{formatTime(displayMs)}</Text>
              <View style={{
                paddingHorizontal: 16, paddingVertical: 6, 
                backgroundColor: !userProfile.isFasting ? '#F1F5F9' : stageColor, 
                borderRadius: 999, marginBottom: 8,
              }}>
                <Text style={{ color: !userProfile.isFasting ? '#6B7280' : '#fff', fontSize: 12, fontWeight: '700' }}>
                  {stageBadge}
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Mục tiêu: {isEating ? (24 - activeGoal) : activeGoal}h</Text>
            </View>
          </View>

          {/* Cột mốc sinh học */}
          <View style={{
            width: '100%', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginBottom: 24,
            borderWidth: 1, borderColor: '#F1F5F9'
          }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: stageColor, marginBottom: 4 }}>{stageTitle}</Text>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 20 }}>{stageDesc}</Text>
          </View>

          {/* Thời gian bắt đầu / kết thúc */}
          {userProfile.isFasting && (
          <View style={{
            width: '100%', flexDirection: 'row', gap: 16, marginBottom: 32,
            backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16,
            borderWidth: 1, borderColor: '#F1F5F9'
          }}>
            <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 4 }}>Bắt đầu</Text>
              <Text style={{ fontWeight: '700', fontSize: 18, color: '#111827' }}>{startDateStr}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 4 }}>Dự kiến KT</Text>
              <Text style={{ fontWeight: '700', fontSize: 18, color: '#111827' }}>{endDateStr}</Text>
            </View>
          </View>
          )}

          <TouchableOpacity
            onPress={onMainAction}
            style={{
              width: '100%', paddingVertical: 18, 
              backgroundColor: buttonColor, 
              borderRadius: 16, alignItems: 'center',
              shadowColor: buttonColor, 
              shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              {buttonText}
            </Text>
          </TouchableOpacity>
          {isEating && (
          <TouchableOpacity
            onPress={stopFastingLoop}
            style={{
              paddingVertical: 12, marginTop: 12, alignItems: 'center'
            }}
          >
            <Text style={{ color: '#6B7280', fontSize: 14, fontWeight: '600' }}>Bỏ theo dõi giờ Ăn</Text>
          </TouchableOpacity>
          )}
        </View>

        {/* Thống kê & Nước */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{
            flex: 1, backgroundColor: '#fff', borderRadius: 24, padding: 20, alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: '#F1F5F9',
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
          }}>
            <Ionicons name="flame" size={32} color="#F59E0B" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>{userProfile.streakCount || 1}</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Streak ngày</Text>
          </View>

          {/* THEO DÕI NƯỚC */}
          <View style={{
            flex: 1.5, backgroundColor: '#fff', borderRadius: 24, padding: 20, justifyContent: 'center',
            borderWidth: 1, borderColor: '#F1F5F9',
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="water" size={24} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                 <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 }}>Nước đã uống</Text>
                 <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500' }}>{userProfile.waterIntake || 0} / {userProfile.waterTarget || 2000} ml</Text>
              </View>
            </View>

            <View style={{ height: 10, backgroundColor: '#EFF6FF', borderRadius: 999, overflow: 'hidden' }}>
               <View style={{ 
                 height: '100%', backgroundColor: '#3B82F6', borderRadius: 999,
                 width: `${Math.min(100, ((userProfile.waterIntake || 0) / (userProfile.waterTarget || 2000)) * 100)}%` 
               }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
