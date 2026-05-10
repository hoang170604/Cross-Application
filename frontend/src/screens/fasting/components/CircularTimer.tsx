import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ThemeColors } from '@/src/core/theme';
import { useTheme } from '@/src/hooks/useTheme';
import { FASTING_PHASES } from '../constants/fastingData';
import { formatDuration } from '../hooks/useFasting';
import { PhaseMarkers } from './PhaseMarkers';

const { width } = Dimensions.get('window');
const RING_SIZE = Math.min(240, width - 96);
const RING_BORDER = 12;

export interface CircularTimerProps {
  goalHours: number;
  isActive: boolean;
  progress: number;
  remainingSeconds: number;
  elapsedSeconds: number;
  elapsedHours: number;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  goalHours,
  isActive,
  progress,
  remainingSeconds,
  elapsedSeconds,
  elapsedHours,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  // ── Tooltip state for phase markers on the ring ────────────────────────────────────
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const tooltipTimerRef = useRef<any>(null);

  /** Tap a phase marker → show its tooltip for 3 seconds then auto-hide. */
  const handleMarkerPress = useCallback((phaseId: string) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    if (activeTooltipId === phaseId) {
      setActiveTooltipId(null);
      return;
    }
    setActiveTooltipId(phaseId);
    tooltipTimerRef.current = setTimeout(() => setActiveTooltipId(null), 3000);
  }, [activeTooltipId]);

  useEffect(() => {
    return () => { if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current); };
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Chế độ {goalHours}:{24 - goalHours}
          </Text>
        </View>
      </View>

      <View style={styles.ringWrapper}>
        <View style={[styles.ringContainer, { width: RING_SIZE, height: RING_SIZE }]}>
          {/* ── SVG Track & Progress ── */}
          <View style={{ position: 'absolute', width: RING_SIZE, height: RING_SIZE, transform: [{ rotate: '-90deg' }] }}>
            <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
              {/* Background Track */}
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={(RING_SIZE - RING_BORDER) / 2}
                stroke={colors.iconBg}
                strokeWidth={RING_BORDER}
                fill="none"
              />
              {/* Active Progress Stroke */}
              {isActive && progress > 0.005 && (
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={(RING_SIZE - RING_BORDER) / 2}
                  stroke="#0ea5e9"
                  strokeWidth={RING_BORDER}
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * ((RING_SIZE - RING_BORDER) / 2)}`}
                  strokeDashoffset={2 * Math.PI * ((RING_SIZE - RING_BORDER) / 2) * (1 - progress)}
                  strokeLinecap="round"
                />
              )}
            </Svg>
          </View>

          {/* ── Phase markers on the ring track ── */}
          <PhaseMarkers
            goalHours={goalHours}
            elapsedHours={elapsedHours}
            activeTooltipId={activeTooltipId}
            handleMarkerPress={handleMarkerPress}
            ringSize={RING_SIZE}
            strokeWidth={RING_BORDER}
          />

          {/* ── Center content: tooltip (if active) → label → timer → elapsed ── */}
          <View style={styles.ringCenter}>
            {activeTooltipId && (() => {
              const phase = FASTING_PHASES.find(p => p.id === activeTooltipId);
              if (!phase) return null;
              return (
                <View
                  style={[
                    styles.tooltipBadge,
                    { borderColor: phase.color, backgroundColor: phase.color + '22' },
                  ]}
                  pointerEvents="none"
                >
                  <Text style={styles.tooltipEmoji}>{phase.emoji}</Text>
                  <View>
                    <Text style={[styles.tooltipTitle, { color: phase.color }]}>
                      {phase.title}
                    </Text>
                    <Text style={styles.tooltipHour}>
                      sau {phase.startHour}h nhịn ăn
                    </Text>
                  </View>
                </View>
              );
            })()}

            <Text style={styles.ringLabel}>
              {isActive ? 'Thời gian còn lại' : 'Mục tiêu'}
            </Text>
            <Text
              style={styles.ringTimer}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {isActive
                ? formatDuration(remainingSeconds)
                : `${String(goalHours).padStart(2, '0')}:00:00`}
            </Text>
            {isActive && (
              <Text style={styles.ringElapsed}>
                {formatDuration(elapsedSeconds)} đã trôi qua
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  badge: {
    backgroundColor: '#0ea5e918',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0ea5e940',
  },
  badgeText: { fontSize: 14, fontWeight: '800', color: '#0ea5e9', letterSpacing: 0.2 },
  
  ringWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringFill: { position: 'absolute' },
  ringArc: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '78%',
    gap: 2,
  },

  tooltipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  tooltipEmoji: { fontSize: 14 },
  tooltipTitle: { fontSize: 11, fontWeight: '800', lineHeight: 15 },
  tooltipHour: { fontSize: 9, color: '#9CA3AF', fontWeight: '500' },

  ringLabel: {
    fontSize: 10, fontWeight: '600', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2,
    textAlign: 'center',
  },
  ringTimer: { fontSize: 34, fontWeight: '900', color: colors.text, textAlign: 'center', width: '100%' },
  ringElapsed: { fontSize: 11, color: colors.textSecondary, fontWeight: '500', textAlign: 'center' },
});
