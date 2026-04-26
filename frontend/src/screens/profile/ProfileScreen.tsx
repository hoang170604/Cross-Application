import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Import Atomic Hooks ─────────────────────────────────────────────────────
import { useAppStore } from '@/src/store/useAppStore';
import { resetAllStorage } from '@/scripts/resetStorage';

// ─── Import UI Components & Core ────────────────────────────────────────────
import { GoalSelectionModal } from '@/src/ui/GoalSelectionModal';
import { ThemeSelectionModal } from '@/src/ui/ThemeSelectionModal';
import { useState, useMemo } from 'react';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

/**
 * Màn hình Hồ sơ người dùng (Profile Tab).
 * Đồng bộ hóa với kiến trúc Modular và Global State.
 * Tập trung hiển thị thông tin tinh gọn.
 */
export default function ProfileScreen() {
  const router = useRouter();
  
  // Truy cập dữ liệu toàn cục qua Context — bao gồm logout
  const { 
    userProfile,
    logout,
    theme,
    setTheme
  } = useAppStore();

  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [isGoalModalVisible, setGoalModalVisible] = useState(false);
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);

  const height = userProfile.height || 170;
  const currentWeight = userProfile.currentWeight !== undefined ? userProfile.currentWeight : (userProfile.weight || 70);
  const gender = userProfile.gender || 'Nam';
  const age = userProfile.age || 25;
  const name = userProfile.name || 'Người dùng mới';

  // ─── Xử lý đăng xuất ──────────────────────────────────────────────────────
  const handleLogout = () => {
    const doLogout = async () => {
      await logout();
      // _layout.tsx sẽ tự phát hiện !hasFinishedOnboarding 
      // và redirect về màn hình Welcome (index)
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Bạn có chắc muốn đăng xuất?\nToàn bộ dữ liệu sẽ bị xóa.')) {
        doLogout();
      }
    } else {
      Alert.alert(
        'Đăng xuất',
        'Bạn có chắc muốn đăng xuất?\nToàn bộ dữ liệu cục bộ sẽ bị xóa.',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đăng xuất',
            style: 'destructive',
            onPress: doLogout,
          },
        ]
      );
    }
  };

  // ─── Xử lý reset data (Dev) ───────────────────────────────────────────────
  const handleResetData = () => {
    Alert.alert(
      '⚠️ Xác nhận Reset',
      'Xóa toàn bộ dữ liệu AsyncStorage? App sẽ quay về trạng thái ban đầu.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa hết',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // Danh sách các tùy chọn cài đặt
  const settingsItems = [
    { 
      id: 'goal',
      icon: '🎯', 
      title: 'Mục tiêu của tôi', 
      subtitle: userProfile.goal === 'lose_weight' ? 'Giảm cân' : userProfile.goal === 'gain_muscle' ? 'Tăng cơ' : 'Giữ dáng' 
    },

    { 
      id: 'stats',
      icon: '👤', 
      title: 'Chỉ số sinh lý', 
      subtitle: `${gender}, ${age} tuổi, ${height}cm, ${currentWeight}kg` 
    },
    { 
      id: 'noti',
      icon: '🔔', 
      title: 'Thông báo', 
      subtitle: 'Đã bật' 
    },
    { 
      id: 'theme',
      icon: theme === 'system' ? '⚙️' : theme === 'dark' ? '🌙' : '☀️', 
      title: 'Giao diện', 
      subtitle: theme === 'system' ? 'Theo hệ thống' : theme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng' 
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
            <Text style={styles.userEmail}>{userProfile.email || 'user@nutritrack.com'}</Text>
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
            <TouchableOpacity 
              key={idx} 
              style={styles.settingItem}
              onPress={() => {
                if (item.id === 'goal') {
                  setGoalModalVisible(true);
                } else if (item.id === 'theme') {
                  setThemeModalVisible(true);
                }
              }}
            >
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

        {/* Nút Reset Data (Dev) */}
        <TouchableOpacity
          onPress={handleResetData}
          style={[styles.logoutButton, { backgroundColor: theme === 'dark' ? '#451A1A' : '#FFF7ED', marginBottom: 12 }]}
        >
          <Text style={[styles.logoutText, { color: theme === 'dark' ? '#FCA5A5' : '#F59E0B' }]}>🗑️ Reset toàn bộ dữ liệu</Text>
        </TouchableOpacity>

        {/* Nút đăng xuất */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          NUTRITRACK v1.2.0 • KIẾN TRÚC MODULAR
        </Text>
      </ScrollView>

      <GoalSelectionModal 
        visible={isGoalModalVisible} 
        onClose={() => setGoalModalVisible(false)} 
      />
      <ThemeSelectionModal
        visible={isThemeModalVisible}
        onClose={() => setThemeModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 2, marginBottom: 24, color: colors.text },
  userCard: {
    backgroundColor: colors.card, borderRadius: 24, padding: 20, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: colors.cardBorder,
    shadowColor: colors.shadow, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#00C48C',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#86EFAC', shadowOpacity: 0.4, shadowRadius: 6, elevation: 3,
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  userName: { fontWeight: '800', fontSize: 18, color: colors.text },
  userEmail: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  editIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 32 },
  settingsList: { gap: 12, marginBottom: 32, marginTop: 16 },
  settingItem: {
    width: '100%', backgroundColor: colors.card, borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
    shadowColor: colors.shadow, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontWeight: '700', fontSize: 15, color: colors.text },
  settingSubtitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '500', marginTop: 1 },
  logoutButton: {
    width: '100%', paddingVertical: 18, backgroundColor: colors.background === '#0F172A' ? '#451A1A' : '#FEF2F2', borderRadius: 999,
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontWeight: '800', fontSize: 15 },
  versionText: { textAlign: 'center', fontSize: 12, fontWeight: '700', color: colors.iconColor, marginTop: 32 },
});
