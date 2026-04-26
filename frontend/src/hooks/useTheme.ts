import { useAppStore } from '../store/useAppStore';
import { lightColors, darkColors, ThemeColors } from '../core/theme';
import { useColorScheme } from 'react-native';

export function useTheme(): ThemeColors {
  const { theme } = useAppStore();
  const systemColorScheme = useColorScheme();

  // Nếu bạn muốn hỗ trợ 'system', có thể đọc systemColorScheme ở đây
  // Hiện tại đang hỗ trợ 2 chế độ 'light' | 'dark' rõ ràng.

  if (theme === 'dark') {
    return darkColors;
  }
  
  return lightColors;
}
