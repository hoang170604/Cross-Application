import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/hooks/useTheme';
import { ThemeColors } from '@/src/core/theme';

interface ThemeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const THEME_OPTIONS = [
  { id: 'system', title: 'Theo hệ thống', icon: 'settings', color: '#64748B', bg: '#F1F5F9', desc: 'Tự động theo giao diện thiết bị' },
  { id: 'light', title: 'Chế độ sáng', icon: 'sunny', color: '#F59E0B', bg: '#FEF3C7', desc: 'Sáng sủa, dễ nhìn ban ngày' },
  { id: 'dark', title: 'Chế độ tối', icon: 'moon', color: '#3B82F6', bg: '#EFF6FF', desc: 'Dịu mắt, tiết kiệm pin ban đêm' },
] as const;

export const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({ visible, onClose }) => {
  const { theme, setTheme } = useAppStore();
  const colors = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Chọn Giao Diện</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {THEME_OPTIONS.map((item) => {
            const isSelected = theme === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => {
                  setTheme(item.id as 'system' | 'light' | 'dark');
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, isSelected && { color: item.color }]}>
                    {item.title}
                  </Text>
                  <Text style={styles.optionDesc}>{item.desc}</Text>
                </View>
                <View style={[styles.radioCircle, isSelected && { borderColor: item.color }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: item.color }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 36 },
  handle: { alignSelf: 'center', width: 40, height: 4, backgroundColor: colors.cardBorder, borderRadius: 2, marginTop: 12, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  closeBtn: { padding: 4 },
  content: { paddingHorizontal: 24, gap: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent' },
  optionCardSelected: { backgroundColor: colors.card, borderColor: colors.primary, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  optionDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
});
