import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SharedHeaderProps {
  showProgress?: boolean;
  showBack?: boolean;
  progress?: number;
}

export default function SharedHeader({ showProgress = false, showBack = true, progress = 0 }: SharedHeaderProps) {
  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: '#fff',
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2 }}>NUTRITRACK</Text>
        <View style={{ width: 40 }} />
      </View>
      {showProgress && (
        <View style={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
          <View
            style={{
              height: '100%',
              backgroundColor: '#00C48C',
              width: `${progress}%`,
              borderRadius: 999,
            }}
          />
        </View>
      )}
    </View>
  );
}
