import { fastingColors } from './fasting/colors';
import { diaryColors } from './diary/colors';
import { spacing, typography } from './shared';

export const Theme = {
  fasting: fastingColors,
  diary: diaryColors,
  shared: {
    spacing,
    typography,
  }
};

export default Theme;
