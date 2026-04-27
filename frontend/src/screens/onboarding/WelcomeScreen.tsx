import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <View
          style={{
            width: 112, height: 112,
            backgroundColor: '#ECFDF5', borderRadius: 40,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 32,
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
          }}
        >
          <Ionicons name="leaf" size={56} color="#00C48C" />
        </View>
        <Text style={{ fontSize: 36, fontWeight: '900', marginBottom: 16, letterSpacing: 2, color: '#111827' }}>
          NUTRITRACK
        </Text>
        <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 18, maxWidth: 280 }}>
          Bắt đầu hành trình sức khỏe của bạn ngay hôm nay
        </Text>
      </View>
      <View style={{ padding: 24, paddingBottom: 48 }}>
        <TouchableOpacity
          onPress={() => router.push('/PrimaryGoal')}
          style={{
            width: '100%', paddingVertical: 16,
            backgroundColor: '#000', borderRadius: 999,
            alignItems: 'center',
            shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>Bắt đầu ngay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/LoginScreen')}
          style={{
            marginTop: 20,
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: '#6B7280', fontSize: 16, fontWeight: '500' }}>
            Đã có tài khoản?{' '}
            <Text style={{ color: '#00C48C', fontWeight: '700', textDecorationLine: 'underline' }}>
              Đăng nhập
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
