export type ThemeColors = {
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  primary: string;
  success: string;
  danger: string;
  warning: string;
  surface: string;
  iconBg: string;
  iconColor: string;
  headerBg: string;
  shadow: string;
};

export const lightColors: ThemeColors = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  cardBorder: '#F3F4F6',
  text: '#1E293B',
  textSecondary: '#64748B',
  primary: '#0F172A',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  surface: '#F8FAFC',
  iconBg: '#F1F5F9',
  iconColor: '#94A3B8',
  headerBg: '#FFFFFF',
  shadow: '#000000',
};

export const darkColors: ThemeColors = {
  background: '#0F172A',
  card: '#1E293B',
  cardBorder: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  primary: '#FFFFFF',
  success: '#34D399',
  danger: '#F87171',
  warning: '#FBBF24',
  surface: '#334155',
  iconBg: '#475569',
  iconColor: '#CBD5E1',
  headerBg: '#0F172A',
  shadow: '#000000', // Đổ bóng trong Dark Mode thường giữ màu đen để có chiều sâu
};
