import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useUserProfile } from '@/context/UserProfileContext';

export default function FastingTrackerScreen() {
  const { userProfile, startFasting, endFasting } = useUserProfile();
  const [selectedGoal, setSelectedGoal] = useState<number>(16);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!userProfile.isFasting) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [userProfile.isFasting]);

  const circumference = 2 * Math.PI * 112;

  const activeGoal = userProfile.isFasting ? (userProfile.fastingGoal || 16) : selectedGoal;
  const targetMs = activeGoal * 60 * 60 * 1000;
  
  const clockStart = userProfile.isFasting && userProfile.fastingStartTime ? userProfile.fastingStartTime : Date.now();
  const elapsedMs = userProfile.isFasting ? Math.max(0, now - clockStart) : 0;
  const percentage = Math.min(100, Math.max(0, (elapsedMs / targetMs) * 100));

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const isTargetMet = elapsedMs >= targetMs;
  const statusLabel = isTargetMet ? "Đã đạt mục tiêu ✅" : "Đang đốt mỡ 🔥";

  const startDateObj = new Date(clockStart);
  const startDateStr = `${startDateObj.getHours().toString().padStart(2,'0')}:${startDateObj.getMinutes().toString().padStart(2,'0')}`;
  
  const endDateObj = new Date(clockStart + targetMs);
  const endDateStr = `${endDateObj.getHours().toString().padStart(2,'0')}:${endDateObj.getMinutes().toString().padStart(2,'0')}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2, marginBottom: 16 }}>NHỊN ĂN GIÁN ĐOẠN</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[16, 18, 20, 14].map(h => {
             const isSelected = activeGoal === h;
             return (
              <TouchableOpacity 
                key={h}
                onPress={() => !userProfile.isFasting && setSelectedGoal(h)}
                style={{
                  paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999,
                  backgroundColor: isSelected ? '#111827' : '#fff',
                  borderWidth: 1, borderColor: isSelected ? '#111827' : '#E5E7EB',
                  opacity: userProfile.isFasting && !isSelected ? 0.5 : 1
                }}
              >
                <Text style={{ fontWeight: '700', color: isSelected ? '#fff' : '#4B5563' }}>{h}:{24-h}</Text>
              </TouchableOpacity>
             )
          })}
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Fasting Clock */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 32, marginBottom: 24, alignItems: 'center',
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <View style={{ width: 256, height: 256, marginBottom: 32, marginTop: 16, position: 'relative' }}>
            <Svg width={256} height={256} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={128} cy={128} r={112} stroke="#FFE5CC" strokeWidth={24} fill="none" />
              <Circle
                cx={128} cy={128} r={112}
                stroke={isTargetMet && userProfile.isFasting ? "#00C48C" : "#FF8C00"} strokeWidth={24} fill="none"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - (userProfile.isFasting ? percentage / 100 : 0))}`}
                strokeLinecap="round"
              />
            </Svg>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: '900', marginBottom: 8 }}>{userProfile.isFasting ? formatTime(elapsedMs) : '00:00:00'}</Text>
              <View style={{
                paddingHorizontal: 16, paddingVertical: 6, 
                backgroundColor: !userProfile.isFasting ? '#9CA3AF' : (isTargetMet ? '#00C48C' : '#FF8C00'), 
                borderRadius: 999, marginBottom: 8,
                shadowColor: !userProfile.isFasting ? '#9CA3AF' : (isTargetMet ? '#00C48C' : '#FF8C00'), 
                shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
              }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{userProfile.isFasting ? statusLabel : "Chưa bắt đầu"}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Mục tiêu: {activeGoal}h</Text>
            </View>
          </View>

          {/* Start / End times */}
          <View style={{
            width: '100%', flexDirection: 'row', gap: 16, marginBottom: 32,
            backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16,
          }}>
            <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 4 }}>Bắt đầu</Text>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>{userProfile.isFasting ? startDateStr : '--:--'}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 4 }}>Kết thúc</Text>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>{userProfile.isFasting ? endDateStr : '--:--'}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => userProfile.isFasting ? endFasting() : startFasting(selectedGoal)}
            style={{
              width: '100%', paddingVertical: 16, 
              backgroundColor: userProfile.isFasting ? '#EF4444' : '#111827', 
              borderRadius: 999, alignItems: 'center',
              shadowColor: userProfile.isFasting ? '#EF4444' : '#111827', 
              shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{userProfile.isFasting ? 'Kết thúc sớm' : 'Bắt đầu nhịn'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{
            flex: 1, backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center',
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}>
            <Ionicons name="flame" size={32} color="#FF8C00" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 28, fontWeight: '900', marginBottom: 4 }}>{userProfile.streakCount || 1}</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Streak ngày</Text>
          </View>
          <View style={{
            flex: 1, backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center',
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}>
            <Ionicons name="water" size={32} color="#3B82F6" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 28, fontWeight: '900', marginBottom: 4 }}>1.2L</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Nước đã uống</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
