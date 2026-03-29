import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SharedHeader from '@/components/SharedHeader';

export default function AuthwallScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SharedHeader showBack />
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>NUTRITRACK</Text>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 32 }}>Lưu lộ trình của bạn 🔒</Text>

        {/* Thẻ nhập liệu */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <TextInput
            placeholder="Email của bạn"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: '100%', paddingHorizontal: 16, paddingVertical: 14,
              backgroundColor: '#F9FAFB', borderRadius: 16, marginBottom: 16,
              fontSize: 16, color: '#111827',
            }}
          />
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            style={{
              width: '100%', paddingHorizontal: 16, paddingVertical: 14,
              backgroundColor: '#F9FAFB', borderRadius: 16,
              fontSize: 16, color: '#111827',
            }}
          />
        </View>

        {/* Nút bắt đầu */}
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/diary')}
          style={{
            width: '100%', paddingVertical: 16, backgroundColor: '#00C48C', borderRadius: 999,
            alignItems: 'center', marginBottom: 24,
            shadowColor: '#86EFAC', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Bắt đầu hành trình</Text>
        </TouchableOpacity>

        {/* Đường phân cách */}
        <View style={{ position: 'relative', marginBottom: 24, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '100%', height: 1, backgroundColor: '#E5E7EB' }} />
          <View style={{ position: 'absolute', backgroundColor: '#fff', paddingHorizontal: 16 }}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Hoặc đăng nhập với</Text>
          </View>
        </View>

        {/* Nút Google */}
        <TouchableOpacity
          style={{
            width: '100%', paddingVertical: 16, backgroundColor: '#fff', borderRadius: 999,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12,
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}
        >
          <Ionicons name="logo-google" size={20} color="#4285F4" />
          <Text style={{ fontWeight: '600', fontSize: 16 }}>Google</Text>
        </TouchableOpacity>

        {/* Nút Apple */}
        <TouchableOpacity
          style={{
            width: '100%', paddingVertical: 16, backgroundColor: '#000', borderRadius: 999,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}
        >
          <Ionicons name="logo-apple" size={20} color="#fff" />
          <Text style={{ fontWeight: '600', fontSize: 16, color: '#fff' }}>Apple</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
