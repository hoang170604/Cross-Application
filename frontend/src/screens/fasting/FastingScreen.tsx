import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, StatusBar, SafeAreaView
} from 'react-native';
import { ThemeColors } from '@/src/core/theme';
import { useTheme } from '@/src/hooks/useTheme';
import { useFasting, formatDateDisplay } from '@/src/hooks/useFasting';
import { FASTING_PHASES } from '@/src/core/fastingConstants';
import { CircularTimer } from '@/src/ui/fasting/CircularTimer';
import { PlanSelector } from '@/src/ui/fasting/PlanSelector';

const FastingScreen = () => {
  const colors = useTheme();
  const styles = getStyles(colors);

  const {
    startTimestamp,
    goalHours,
    elapsedSeconds,
    isInitializing,
    isUploading,
    isActive,
    remainingSeconds,
    progress,
    elapsedHours,
    currentPhase,
    nextPhase,
    phaseProgress,
    targetEndISO,
    setGoalHours,
    handleStartFast,
    handleEndFast,
  } = useFasting();

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Đang khôi phục phiên nhịn ăn…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={colors.text === '#F8FAFC' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Page Header ── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Nhịn Ăn Gián Đoạn</Text>
          <Text style={styles.pageSubtitle}>
            {isActive ? 'Đang nhịn ăn ✦' : 'Sẵn sàng bắt đầu?'}
          </Text>
        </View>

        {/* ── Circular Timer ── */}
        <CircularTimer
          goalHours={goalHours}
          isActive={isActive}
          progress={progress}
          remainingSeconds={remainingSeconds}
          elapsedSeconds={elapsedSeconds}
          elapsedHours={elapsedHours}
        />

        {/* ── Schedule Card ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lịch trình</Text>
          <View style={styles.scheduleGrid}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Bắt đầu lúc</Text>
              <Text style={styles.scheduleValue} numberOfLines={1}>
                {startTimestamp ? formatDateDisplay(new Date(startTimestamp).toISOString()) : '—'}
              </Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Dự kiến kết thúc</Text>
              <Text style={styles.scheduleValue} numberOfLines={1}>
                {targetEndISO ? formatDateDisplay(targetEndISO) : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── End Fast CTA (active only) ── */}
        {isActive && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnEnd, isUploading && styles.btnDisabled]}
            onPress={handleEndFast}
            disabled={isUploading}
            activeOpacity={0.8}
          >
            {isUploading ? (
              <View style={styles.btnRow}>
                <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.actionBtnText}>Đang lưu…</Text>
              </View>
            ) : (
              <Text style={styles.actionBtnText}>⏹  Kết thúc nhịn ăn</Text>
            )}
          </TouchableOpacity>
        )}

        {/* ── Dynamic Biological Phase Card (active only) ── */}
        {isActive && (
          <View style={styles.card}>
            <View style={styles.phaseHeader}>
              <View style={[styles.phaseIconBox, { backgroundColor: currentPhase.color + '22' }]}>
                <Text style={styles.phaseEmoji}>{currentPhase.emoji}</Text>
              </View>
              <View style={styles.phaseTextBlock}>
                <Text style={styles.phaseLabel}>Giai đoạn hiện tại</Text>
                <Text style={[styles.phaseTitle, { color: currentPhase.color }]}>{currentPhase.title}</Text>
                <Text style={styles.phaseDesc}>{currentPhase.description}</Text>
              </View>
            </View>

            {nextPhase && (
              <View style={styles.phaseProgressWrapper}>
                <View style={styles.phaseProgressTrack}>
                  <View
                    style={[
                      styles.phaseProgressFill,
                      { width: `${Math.round(phaseProgress * 100)}%` as any, backgroundColor: currentPhase.color },
                    ]}
                  />
                </View>
                <Text style={styles.phaseProgressLabel}>
                  Tiếp theo: {nextPhase.emoji} {nextPhase.title} sau {((nextPhase.startHour - elapsedHours) * 60).toFixed(0)} phút
                </Text>
              </View>
            )}

            <View style={styles.phaseTimeline}>
              {FASTING_PHASES.map((phase, idx) => {
                const isReached = elapsedHours >= phase.startHour;
                const isCurrent = phase.id === currentPhase.id;
                return (
                  <View key={phase.id} style={styles.phaseTimelineItem}>
                    {idx < FASTING_PHASES.length - 1 && (
                      <View
                        style={[
                          styles.phaseConnector,
                          { backgroundColor: elapsedHours >= FASTING_PHASES[idx + 1].startHour ? currentPhase.color : colors.cardBorder },
                        ]}
                      />
                    )}
                    <View
                      style={[
                        styles.phaseDot,
                        {
                          backgroundColor: isReached ? phase.color : colors.surface,
                          borderColor: isReached ? phase.color : colors.cardBorder,
                          transform: isCurrent ? [{ scale: 1.25 }] : [],
                        },
                      ]}
                    >
                      {isCurrent && <View style={[styles.phaseDotCore, { backgroundColor: phase.color }]} />}
                    </View>
                    <Text style={[styles.phaseHourLabel, { color: isReached ? phase.color : colors.textSecondary }]}>
                      {phase.startHour}g
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Fasting Plan Selector (idle only) ── */}
        {!isActive && <PlanSelector goalHours={goalHours} setGoalHours={setGoalHours} />}

        {/* ── Start Fast CTA (idle only) ── */}
        {!isActive && (
          <TouchableOpacity style={[styles.actionBtn, styles.btnStart]} onPress={handleStartFast} activeOpacity={0.8}>
            <Text style={styles.actionBtnText}>▶  Bắt đầu nhịn ăn</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default FastingScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
    loadingText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
    scroll: { paddingHorizontal: 20, paddingBottom: 48 },

    pageHeader: { paddingTop: 24, paddingBottom: 20 },
    pageTitle: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    pageSubtitle: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginTop: 4 },

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
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 13, fontWeight: '600', color: colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16,
    },

    scheduleGrid: { flexDirection: 'row', alignItems: 'center' },
    scheduleItem: { flex: 1, alignItems: 'center' },
    scheduleDivider: { width: 1, height: 36, backgroundColor: colors.cardBorder },
    scheduleLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500', marginBottom: 4 },
    scheduleValue: { fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'center' },

    phaseHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
    phaseIconBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    phaseEmoji: { fontSize: 24 },
    phaseTextBlock: { flex: 1 },
    phaseLabel: { fontSize: 10, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
    phaseTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    phaseDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, flexShrink: 1 },

    phaseProgressWrapper: { marginBottom: 16 },
    phaseProgressTrack: { height: 5, borderRadius: 3, backgroundColor: colors.surface, overflow: 'hidden', marginBottom: 6 },
    phaseProgressFill: { height: '100%', borderRadius: 3 },
    phaseProgressLabel: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },

    phaseTimeline: {
      flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
      paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingHorizontal: 10,
    },
    phaseTimelineItem: { flex: 1, alignItems: 'center', position: 'relative', zIndex: 1 },
    phaseConnector: { position: 'absolute', top: 7, left: '50%', width: '100%', height: 2, zIndex: 1 },
    phaseDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 4, zIndex: 2 },
    phaseDotCore: { width: 6, height: 6, borderRadius: 3 },
    phaseHourLabel: { fontSize: 10, fontWeight: '600' },

    actionBtn: {
      borderRadius: 18, paddingVertical: 18, alignItems: 'center', justifyContent: 'center',
      marginTop: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18, shadowRadius: 10, elevation: 4,
    },
    btnStart: { backgroundColor: '#0ea5e9' },
    btnEnd: { backgroundColor: '#f43f5e' },
    btnDisabled: { opacity: 0.6 },
    btnRow: { flexDirection: 'row', alignItems: 'center' },
    actionBtnText: { fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  });
