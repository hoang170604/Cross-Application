import { useAppStore } from '../store/useAppStore';
import { lightColors, darkColors, ThemeColors } from '../core/theme';
import { useColorScheme } from 'react-native';

export function useTheme(): ThemeColors {
  const { theme } = useAppStore();
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null | undefined

  // Nếu người dùng chọn 'system', theo hệ thống
  const resolvedTheme = theme === 'system'
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : theme;

  return resolvedTheme === 'dark' ? darkColors : lightColors;
}
