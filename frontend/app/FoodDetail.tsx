import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SharedHeader from '@/components/SharedHeader';

export default function FoodDetailScreen() {
  const router = useRouter();
  const [portion, setPortion] = useState(1);

  const macros = [
    { name: 'Carbs', value: 55 * portion, total: 250, color: '#FFB800', unit: 'g' },
    { name: 'Protein', value: 15 * portion, total: 80, color: '#00C48C', unit: 'g' },
    { name: 'Fat', value: 8 * portion, total: 60, color: '#FF6B6B', unit: 'g' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SharedHeader showBack />

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Food Icon & Name */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 80, marginBottom: 16 }}>🍲</Text>
          <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>Phở bò</Text>
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#6B7280' }}>350 kcal</Text>
        </View>

        {/* Portion Control */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 16, textAlign: 'center' }}>Khẩu phần</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <TouchableOpacity
              onPress={() => setPortion(Math.max(1, portion - 1))}
              style={{
                width: 48, height: 48, backgroundColor: '#F3F4F6', borderRadius: 24,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="remove" size={20} color="#374151" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center', minWidth: 80 }}>
              <Text style={{ fontSize: 32, fontWeight: '900' }}>{portion}</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 4 }}>Bát</Text>
            </View>
            <TouchableOpacity
              onPress={() => setPortion(portion + 1)}
              style={{
                width: 48, height: 48, backgroundColor: '#00C48C', borderRadius: 24,
                alignItems: 'center', justifyContent: 'center',
                shadowColor: '#86EFAC', shadowOpacity: 0.3, shadowRadius: 4, elevation: 2,
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Macros Detail */}
        {macros.map((macro) => (
          <View key={macro.name} style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16,
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontWeight: '700' }}>{macro.name}</Text>
              <Text style={{ fontWeight: '700' }}>{macro.value}{macro.unit}</Text>
            </View>
            <View style={{ height: 12, backgroundColor: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
              <View style={{
                height: '100%', borderRadius: 999, backgroundColor: macro.color,
                width: `${Math.min((macro.value / macro.total) * 100, 100)}%`,
              }} />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: '100%', paddingVertical: 16, backgroundColor: '#000', borderRadius: 999, alignItems: 'center',
            shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Thêm vào Bữa sáng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
