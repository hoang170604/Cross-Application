import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Import Atomic Hooks ─────────────────────────────────────────────────────
import { useNutrition } from '@/src/hooks';

/**
 * Màn hình Hồ sơ người dùng (Profile Tab).
 * Đồng bộ hóa với kiến trúc Modular và Global State.
 * Tập trung hiển thị thông tin tinh gọn.
 */
export default function ProfileScreen() {
  const router = useRouter();
  
  // Truy cập dữ liệu toàn cục qua Consumer Hook chuyên biệt
  const { 
    userProfile 
  } = useNutrition();

  const height = userProfile.height || 170;
  const currentWeight = userProfile.currentWeight !== undefined ? userProfile.currentWeight : (userProfile.weight || 70);
  const gender = userProfile.gender || 'Nam';
  const age = userProfile.age || 25;
  const name = userProfile.name || 'Người dùng mới';

  // Danh sách các tùy chọn cài đặt
  const settingsItems = [
    { 
      icon: '🎯', 
      title: 'Mục tiêu của tôi', 
      subtitle: userProfile.goal === 'lose_weight' ? 'Giảm cân' : userProfile.goal === 'gain_muscle' ? 'Tăng cơ' : 'Giữ dáng' 
    },
    { 
      icon: '🥑', 
      title: 'Chế độ ăn', 
      subtitle: userProfile.dietMode ? 'Đã thiết lập' : 'Chưa chọn' 
    },
    { 
      icon: '💧', 
      title: 'Nhắc uống nước', 
      subtitle: `Mục tiêu ${userProfile.waterTarget || 2000} ml/ngày` 
    },
    { 
      icon: '👤', 
      title: 'Chỉ số sinh lý', 
      // CẬP NHẬT: Định dạng hiển thị mới bao gồm Cân nặng hiện tại (Reactive)
      subtitle: `${gender}, ${age} tuổi, ${height}cm, ${currentWeight}kg` 
    },
    { 
      icon: '🔔', 
      title: 'Thông báo', 
      subtitle: 'Đã bật' 
    },
    { 
      icon: '🌙', 
      title: 'Giao diện', 
      subtitle: 'Chế độ sáng' 
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HỒ SƠ</Text>

        {/* Thẻ định danh người dùng */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>user@nutritrack.com</Text>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="settings-outline" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Danh sách cài đặt mở rộng */}
        <View style={styles.settingsList}>
          {settingsItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.settingItem}>
              <View style={styles.iconBox}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Nút đăng xuất */}
        <TouchableOpacity
          onPress={() => router.replace('/Authwall')}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          NUTRITRACK v1.2.0 • KIẾN TRÚC MODULAR
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 2, marginBottom: 24, color: '#1E293B' },
  userCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#00C48C',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#86EFAC', shadowOpacity: 0.4, shadowRadius: 6, elevation: 3,
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  userName: { fontWeight: '800', fontSize: 18, color: '#1E293B' },
  userEmail: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  editIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 32 },
  settingsList: { gap: 12, marginBottom: 32, marginTop: 16 },
  settingItem: {
    width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontWeight: '700', fontSize: 15, color: '#1E293B' },
  settingSubtitle: { fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 1 },
  logoutButton: {
    width: '100%', paddingVertical: 18, backgroundColor: '#FEF2F2', borderRadius: 999,
    alignItems: 'center',
  },
  logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 15 },
  versionText: { textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#CBD5E1', marginTop: 32 },
});
