import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfile } from '@/context/UserProfileContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile } = useUserProfile();
  
  const height = userProfile.height || 170;
  const weight = userProfile.weight || 70;
  const gender = userProfile.gender || 'Nam';
  const age = userProfile.age || 25;
  const name = 'Người dùng mới';

  const settingsItems = [
    { icon: '🎯', title: 'Mục tiêu của tôi', subtitle: userProfile.goal === 'lose_weight' ? 'Giảm cân' : userProfile.goal === 'gain_muscle' ? 'Tăng cơ' : 'Giữ dáng' },
    { icon: '🥑', title: 'Chế độ ăn', subtitle: userProfile.dietMode ? 'Đã thiết lập' : 'Chưa chọn' },
    { icon: '💧', title: 'Nhắc uống nước', subtitle: 'Mục tiêu 2 Lít/ngày' },
    { icon: '🔔', title: 'Thông báo', subtitle: 'Đã bật' },
    { icon: '👤', title: 'Chỉ số cơ thể', subtitle: `${gender}, ${age} tuổi, ${height}cm, ${weight}kg` },
    { icon: '🌙', title: 'Giao diện', subtitle: 'Sáng' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2, marginBottom: 24 }}>HỒ SƠ</Text>

        {/* Thẻ người dùng */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 8,
          flexDirection: 'row', alignItems: 'center', gap: 20,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <View style={{
            width: 64, height: 64, borderRadius: 32, backgroundColor: '#00C48C',
            alignItems: 'center', justifyContent: 'center',
            shadowColor: '#86EFAC', shadowOpacity: 0.4, shadowRadius: 6, elevation: 3,
          }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>N</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 4 }}>{name}</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>user@nutritrack.com</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Danh sách cài đặt */}
        <View style={{ gap: 12, marginBottom: 32 }}>
          {settingsItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={{
              width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20,
              flexDirection: 'row', alignItems: 'center', gap: 16,
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <Text style={{ fontSize: 28 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
                <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 2 }}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity
          onPress={() => router.replace('/Authwall')}
          style={{
            width: '100%', paddingVertical: 16, backgroundColor: '#FEF2F2', borderRadius: 999,
            alignItems: 'center',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}
        >
          <Text style={{ color: '#EF4444', fontWeight: '700' }}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '500', color: '#9CA3AF', marginTop: 32, marginBottom: 24 }}>
          NUTRITRACK v1.1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
