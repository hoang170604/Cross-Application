import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '@/src/components/molecules/SharedHeader';

// ─── Import Atomic Hooks ─────────────────────────────────────────────────────
import { useUserProfile } from '@/src/context/UserProfileContext';

/**
 * Màn hình Authwall (Hoàn thiện hồ sơ).
 * Bước cuối cùng của Onboarding để nhập tên và mục tiêu nhịn ăn khởi đầu.
 */
export default function AuthwallScreen() {
  const router = useRouter();
  const { updateUserProfile } = useUserProfile();
  const [name, setName] = useState('');

  const handleStart = () => {
    if (!name.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên của bạn để tiếp tục!');
      return;
    }
    // Cập nhật State chung thông qua Context Orchestrator
    updateUserProfile({ name: name.trim() });
    // Tự động chuyển qua Dashboard chính
    router.replace('/(tabs)/diary');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SharedHeader showBack />
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>NUTRITRACK</Text>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 32 }}>Hoàn thiện hồ sơ 🚀</Text>

        {/* Thẻ nhập liệu Tên */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Tên của bạn</Text>
          <View style={{
            backgroundColor: '#fff', borderRadius: 24, padding: 8,
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}>
            <TextInput
              placeholder="Ví dụ: Anh Tú"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={{
                width: '100%', paddingHorizontal: 16, paddingVertical: 14,
                backgroundColor: '#F9FAFB', borderRadius: 16,
                fontSize: 16, color: '#111827',
              }}
            />
          </View>
        </View>



        {/* Nút bắt đầu */}
        <TouchableOpacity
          onPress={handleStart}
          style={{
            width: '100%', paddingVertical: 16, backgroundColor: '#00C48C', borderRadius: 999,
            alignItems: 'center', marginBottom: 24,
            shadowColor: '#86EFAC', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Bắt đầu hành trình</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}
