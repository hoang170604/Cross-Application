import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SharedHeader } from '@/src/ui/SharedHeader';
import { useAppStore } from '@/src/store/useAppStore';

const FASTING_GOALS = [
  { 
    id: '12:12', 
    title: '12:12', 
    desc: 'Dễ dàng', 
    detail: 'Nhịp sinh học cơ bản. Hỗ trợ tiêu hóa tự nhiên, làm quen với việc không ăn đêm. Kết hợp với việc tính toán calo để duy trì cân nặng ổn định.' 
  },
  { 
    id: '14:10', 
    title: '14:10', 
    desc: 'Trung cấp', 
    detail: 'Bắt đầu kích hoạt quá trình đốt mỡ thừa. Giúp cơ thể sử dụng năng lượng dự trữ hiệu quả hơn. Kiểm soát calo trong cửa sổ 10h giúp giảm cân bền vững.' 
  },
  { 
    id: '16:8', 
    title: '16:8', 
    desc: 'Phổ biến', 
    detail: 'Chế độ tối ưu cho việc giảm mỡ và tăng độ nhạy insulin. Giới hạn thời gian ăn giúp bạn kiểm soát calo tốt hơn và cảm thấy no lâu hơn.' 
  }
];

export default function WelcomeProfileScreen() {
  const router = useRouter();
  const { userProfile, updateUserProfile, setPendingSync, token } = useAppStore();
  
  const [name, setName] = useState('');
  const [fastingGoal, setFastingGoal] = useState<string | null>('16:8'); // Mặc định chọn 16:8

  const isFormValid = name.trim().length > 0 && fastingGoal !== null;

  const handleStartProcess = async () => {
    if (!isFormValid) return;

    updateUserProfile({
      name: name.trim(),
      fastingGoal: fastingGoal
    });

    if (token) {
      router.replace('/SyncLoadingScreen');
    } else {
      await setPendingSync(true);
      router.replace('/LoginScreen');
    }
  };

  const selectedGoalData = FASTING_GOALS.find(g => g.id === fastingGoal);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container}>
        <SharedHeader showBack />
        <ScrollView style={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.appTitle}>NUTRITRACK</Text>
          <Text style={styles.screenTitle}>Hoàn thiện hồ sơ 🚀</Text>
          <Text style={styles.subtitle}>Để cá nhân hóa trải nghiệm, chúng tôi cần thêm một vài thông tin ngắn từ bạn.</Text>

          {/* Nhập Tên */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tên của bạn</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Ví dụ: Nguyen Van A"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                style={styles.input}
              />
            </View>
          </View>

          {/* Chọn Mục tiêu Nhịn ăn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mục tiêu nhịn ăn khởi đầu</Text>
            <View style={styles.fastingRow}>
              {FASTING_GOALS.map((item) => {
                const isSelected = fastingGoal === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setFastingGoal(item.id)}
                    style={[styles.fastingCard, isSelected && styles.fastingCardSelected]}
                  >
                    <Text style={[styles.fastingTitle, isSelected && styles.fastingTitleSelected]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.fastingDesc, isSelected && styles.fastingDescSelected]}>
                      {item.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Vùng giải thích chi tiết */}
            {selectedGoalData && (
              <View style={styles.explanationBox}>
                <View style={styles.explanationHeader}>
                  <Ionicons name="information-circle" size={20} color="#00C48C" />
                  <Text style={styles.explanationTitle}>Về chế độ {selectedGoalData.id}</Text>
                </View>
                <Text style={styles.explanationText}>
                  {selectedGoalData.detail}
                </Text>
                
                {(() => {
                  const goal = userProfile?.goal?.toLowerCase() || '';
                  if (goal === 'lose_weight') {
                    return (
                      <View style={styles.tipBox}>
                        <Text style={styles.tipText}>
                          💡 <Text style={{fontWeight: '700'}}>Mẹo giảm mỡ:</Text> Dù nhịn ăn giúp kiểm soát thời gian, việc duy trì <Text style={{fontWeight: '700'}}>thâm hụt calo</Text> vẫn là chìa khóa để giảm cân hiệu quả.
                        </Text>
                      </View>
                    );
                  }
                  if (goal === 'build_muscle') {
                    return (
                      <View style={styles.tipBox}>
                        <Text style={styles.tipText}>
                          💡 <Text style={{fontWeight: '700'}}>Mẹo tăng cân:</Text> Nhịn ăn giúp tăng hấp thụ, nhưng hãy đảm bảo ăn đủ lượng <Text style={{fontWeight: '700'}}>calo thặng dư</Text> trong cửa sổ ăn của bạn nhé!
                        </Text>
                      </View>
                    );
                  }
                  return (
                    <View style={styles.tipBox}>
                      <Text style={styles.tipText}>
                        💡 <Text style={{fontWeight: '700'}}>Mẹo duy trì:</Text> Kết hợp nhịn ăn với mức <Text style={{fontWeight: '700'}}>calo cân bằng</Text> sẽ giúp bạn cải thiện sức khỏe nội tiết và trao đổi chất.
                      </Text>
                    </View>
                  );
                })()}

              </View>
            )}
          </View>
          
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            disabled={!isFormValid}
            onPress={handleStartProcess}
          >
            <Text style={styles.buttonText}>Bắt đầu hành trình</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  appTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 2, color: '#9CA3AF', marginBottom: 6 },
  screenTitle: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 32, lineHeight: 22 },
  
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 16 },
  
  inputWrapper: {
    backgroundColor: '#fff', borderRadius: 20, padding: 6,
    borderWidth: 1.5, borderColor: '#F3F4F6',
  },
  input: {
    width: '100%', paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#F9FAFB', borderRadius: 14,
    fontSize: 16, color: '#111827',
  },

  fastingRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  fastingCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastingCardSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#00C48C',
  },
  fastingTitle: { fontSize: 18, fontWeight: '800', color: '#4B5563', marginBottom: 4 },
  fastingTitleSelected: { color: '#00C48C' },
  fastingDesc: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  fastingDescSelected: { color: '#059669' },

  explanationBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  explanationTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
  explanationText: { fontSize: 14, color: '#6B7280', lineHeight: 22, marginBottom: 16 },
  tipBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00C48C',
  },
  tipText: { fontSize: 13, color: '#4B5563', lineHeight: 20 },

  footer: { padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  button: {
    backgroundColor: '#00C48C',
    paddingVertical: 16,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#00C48C',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});



