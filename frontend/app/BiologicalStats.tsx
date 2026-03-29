import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SharedHeader from '@/components/SharedHeader';
import { useUserProfile } from '@/context/UserProfileContext';

export default function BiologicalStatsScreen() {
  const router = useRouter();
  const { userProfile, setUserProfile, calculateFinalCalories } = useUserProfile();
  
  const [gender, setGender] = useState(userProfile.gender || 'Nam');
  const [age, setAge] = useState(userProfile.age || 25);
  const [height, setHeight] = useState(userProfile.height || 170);
  const [weight, setWeight] = useState(userProfile.weight || 70);
  const [targetWeight, setTargetWeight] = useState(userProfile.targetWeight || 65);
  const [speed, setSpeed] = useState(userProfile.speed || 0.5);
  const [isPregnant, setIsPregnant] = useState(userProfile.isPregnant || false);
  const [hasDiabetes, setHasDiabetes] = useState(userProfile.hasDiabetes || false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SharedHeader showProgress progress={100} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 32 }}>Nhập chỉ số của bạn</Text>

        {/* Chọn giới tính */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Giới tính</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {(['Nam', 'Nữ'] as const).map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={{
                  flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center',
                  backgroundColor: gender === g ? '#00C48C' : '#fff',
                  shadowColor: gender === g ? '#86EFAC' : '#000',
                  shadowOpacity: gender === g ? 0.3 : 0.04,
                  shadowRadius: 4, elevation: gender === g ? 3 : 1,
                  borderWidth: gender === g ? 0 : 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <Text style={{ fontWeight: '600', color: gender === g ? '#fff' : '#4B5563' }}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tuổi */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Tuổi</Text>
          <View style={{
            backgroundColor: '#fff', borderRadius: 24, padding: 24,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            borderWidth: 1, borderColor: '#F3F4F6',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
          }}>
            <TouchableOpacity
              onPress={() => setAge(Math.max(10, age - 1))}
              style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="remove" size={20} color="#4B5563" />
            </TouchableOpacity>
            <Text style={{ fontSize: 28, fontWeight: '700' }}>{age}</Text>
            <TouchableOpacity
              onPress={() => setAge(Math.min(100, age + 1))}
              style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="add" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chiều cao & Cân nặng */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
          {/* Chiều cao */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Chiều cao (cm)</Text>
            <View style={{
              backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', gap: 16,
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <TouchableOpacity
                onPress={() => setHeight(Math.min(250, height + 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="add" size={16} color="#4B5563" />
              </TouchableOpacity>
              <Text style={{ fontSize: 24, fontWeight: '700' }}>{height}</Text>
              <TouchableOpacity
                onPress={() => setHeight(Math.max(100, height - 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="remove" size={16} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Cân nặng */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Cân nặng (kg)</Text>
            <View style={{
              backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', gap: 16,
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <TouchableOpacity
                onPress={() => setWeight(Math.min(200, weight + 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="add" size={16} color="#4B5563" />
              </TouchableOpacity>
              <Text style={{ fontSize: 24, fontWeight: '700' }}>{weight}</Text>
              <TouchableOpacity
                onPress={() => setWeight(Math.max(30, weight - 1))}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="remove" size={16} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Cân nặng mục tiêu (Ẩn nếu giữ dáng) */}
        {userProfile.goal !== 'maintain' && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Cân nặng mục tiêu (kg)</Text>
            <View style={{
              backgroundColor: '#fff', borderRadius: 24, padding: 24,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              borderWidth: 1, borderColor: '#F3F4F6',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <TouchableOpacity
                onPress={() => setTargetWeight(Math.max(30, targetWeight - 0.5))}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="remove" size={20} color="#4B5563" />
              </TouchableOpacity>
              <Text style={{ fontSize: 28, fontWeight: '700' }}>{targetWeight}</Text>
              <TouchableOpacity
                onPress={() => setTargetWeight(Math.min(200, targetWeight + 0.5))}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="add" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {userProfile.goal === 'gain_muscle' && (
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 12, fontStyle: 'italic', paddingHorizontal: 4 }}>
                *Gợi ý: Bạn có thể giữ nguyên mức cân hiện tại nếu muốn tập trung "Tăng cơ, Giảm mỡ" (Body Recomp).
              </Text>
            )}
          </View>
        )}

        {/* Chọn tốc độ (Ẩn nếu giữ dáng) */}
        {userProfile.goal !== 'maintain' && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' }}>Tốc độ mong muốn</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[
                { label: 'Chậm', value: 0.25, sub: '0.25kg/tuần' },
                { label: 'Vừa', value: 0.5, sub: '0.5kg/tuần' },
                { label: 'Nhanh', value: 1.0, sub: '1kg/tuần' }
              ].map((s) => (
                <TouchableOpacity
                  key={s.label}
                  onPress={() => setSpeed(s.value)}
                  style={{
                    flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center',
                    backgroundColor: speed === s.value ? '#ECFDF5' : '#fff',
                    borderWidth: 1, borderColor: speed === s.value ? '#00C48C' : '#F3F4F6',
                    shadowColor: speed === s.value ? '#86EFAC' : '#000',
                    shadowOpacity: speed === s.value ? 0.3 : 0.04,
                    shadowRadius: 4, elevation: speed === s.value ? 3 : 1,
                  }}
                >
                  <Text style={{ fontWeight: '700', color: speed === s.value ? '#00C48C' : '#4B5563', marginBottom: 4 }}>
                    {s.label}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6B7280' }}>{s.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Cập nhật Tình trạng sức khỏe */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 12, fontWeight: '500' }}>Tình trạng đặc biệt (Nếu có)</Text>
          <View style={{
            backgroundColor: '#fff', borderRadius: 24, padding: 16, gap: 16,
            borderWidth: 1, borderColor: '#F3F4F6',
          }}>
            {/* Mang thai (chỉ hiện cho nữ) */}
            {gender === 'Nữ' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18 }}>🤰</Text>
                  </View>
                  <Text style={{ fontWeight: '600', fontSize: 16 }}>Tôi đang mang thai</Text>
                </View>
                <Switch
                  value={isPregnant}
                  onValueChange={setIsPregnant}
                  trackColor={{ false: '#E5E7EB', true: '#34D399' }}
                  thumbColor="#fff"
                />
              </View>
            )}

            {/* Tiểu đường */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>🩸</Text>
                </View>
                <Text style={{ fontWeight: '600', fontSize: 16 }}>Chế độ tiểu đường</Text>
              </View>
              <Switch
                value={hasDiabetes}
                onValueChange={setHasDiabetes}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={() => {
            let finalTargetWeight = Number(targetWeight);
            const currentWeight = Number(weight);
            const userSpeed = typeof speed !== 'undefined' ? Number(speed) : 0.5;

            if (userProfile.goal === 'maintain') {
              finalTargetWeight = currentWeight;
            } else if (userProfile.goal === 'lose_weight') {
              if (finalTargetWeight >= currentWeight) {
                Alert.alert("Chưa hợp lệ", "Để giảm cân, cân nặng mục tiêu phải nhỏ hơn hiện tại");
                return;
              }
            } else if (userProfile.goal === 'gain_muscle') {
              if (finalTargetWeight < currentWeight) {
                Alert.alert("Chưa hợp lệ", "Để tăng cơ, cân nặng mục tiêu không được nhỏ hơn hiện tại");
                return;
              }
            }

            const updatedProfile = { 
              ...userProfile, 
              gender, 
              age: Number(age), 
              height: Number(height), 
              weight: currentWeight,
              targetWeight: finalTargetWeight,
              speed: userSpeed,
              isPregnant: gender === 'Nữ' ? isPregnant : false,
              hasDiabetes
            };

            const computedTarget = calculateFinalCalories(updatedProfile);
            updatedProfile.targetCalories = computedTarget;
            
            setUserProfile(updatedProfile);
            router.push('/AhaMoment');
          }}
          style={{ width: '100%', paddingVertical: 16, backgroundColor: '#000', borderRadius: 999, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Tạo Kế Hoạch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
