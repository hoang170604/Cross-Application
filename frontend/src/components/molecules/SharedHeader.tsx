import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SharedHeaderProps {
  showProgress?: boolean;
  showBack?: boolean;
  progress?: number;
}

const SharedHeaderComponent: React.FC<SharedHeaderProps> = ({ 
  showProgress = false, 
  showBack = true, 
  progress = 0 
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={styles.logo}>NUTRITRACK</Text>
        <View style={{ width: 40 }} />
      </View>
      {showProgress && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%` }
            ]}
          />
        </View>
      )}
    </View>
  );
};

/**
 * Thành phần Header dùng chung (SharedHeader) cho Onboarding.
 * Được bọc React.memo để tối ưu hiệu năng.
 */
export const SharedHeader = React.memo(SharedHeaderComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24, 
    paddingTop: 24, 
    paddingBottom: 16
  },
  topRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  logo: {
    fontSize: 18, 
    fontWeight: '700', 
    letterSpacing: 2
  },
  progressTrack: {
    width: '100%', 
    height: 6, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 999, 
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00C48C',
    borderRadius: 999,
  }
});
