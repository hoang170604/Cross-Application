import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FASTING_PHASES } from '@/src/core/fastingConstants';
import { ThemeColors } from '@/src/core/theme';
import { useTheme } from '@/src/hooks/useTheme';

export interface PhaseMarkersProps {
  goalHours: number;
  elapsedHours: number;
  activeTooltipId: string | null;
  handleMarkerPress: (phaseId: string) => void;
  ringSize: number;
  strokeWidth?: number;
}

export const PhaseMarkers: React.FC<PhaseMarkersProps> = ({
  goalHours,
  elapsedHours,
  activeTooltipId,
  handleMarkerPress,
  ringSize,
  strokeWidth = 12,
}) => {
  const colors = useTheme();
  const styles = getStyles(colors);

  return (
    <>
      {FASTING_PHASES.filter(
        (phase) => phase.startHour === 0 || phase.startHour < goalHours
      ).map(phase => {
        const MARKER = 28;                     // marker touch target (px)
        const cx = ringSize / 2;               // circle center x
        const cy = ringSize / 2;               // circle center y
        const R  = (ringSize - strokeWidth) / 2; // exact center of the SVG stroke

        const ratio = Math.min(1, phase.startHour / goalHours);
        const angle = ratio * 2 * Math.PI - Math.PI / 2;

        const left = cx + R * Math.cos(angle) - MARKER / 2;
        const top  = cy + R * Math.sin(angle) - MARKER / 2;

        const isReached = elapsedHours >= phase.startHour;
        const isTooltipActive = activeTooltipId === phase.id;

        return (
          <TouchableOpacity
            key={phase.id}
            onPress={() => handleMarkerPress(phase.id)}
            activeOpacity={0.75}
            style={[
              styles.phaseMarker,
              {
                width: MARKER,
                height: MARKER,
                borderRadius: MARKER / 2,
                top,
                left,
                backgroundColor: colors.surface,
                borderColor: isReached ? phase.color : colors.cardBorder,
                // Scale up the active/tapped marker slightly
                transform: [{ scale: isTooltipActive ? 1.3 : 1 }],
              },
            ]}
          >
            <MaterialCommunityIcons 
              name={phase.icon as any} 
              size={16} 
              color={isReached ? phase.color : '#9CA3AF'} 
            />
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  phaseMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    zIndex: 10,
  },
});
