/**
 * @file BarcodeScannerScreen.tsx
 * @description Màn hình quét mã vạch món ăn bằng `expo-camera`. Sau khi quét
 * thành công, trả barcode về màn trước qua param `barcode`, hoặc gọi API
 * tra cứu nếu cần.
 *
 * Phụ thuộc: `expo-camera ~17` (Camera với BarcodeScanner integrated).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Lazy load expo-camera. Lib có thể chưa cài → fallback UI thông báo.
let CameraView: any = null;
let useCameraPermissions: any = null;
try {
  const ExpoCamera = require('expo-camera');
  CameraView = ExpoCamera.CameraView;
  useCameraPermissions = ExpoCamera.useCameraPermissions;
} catch {
  // sẽ render placeholder
}

// Tránh lỗi Hook rules bằng cách đảm bảo useCameraPermissions luôn là 1 hàm hook hợp lệ
if (!useCameraPermissions) {
  useCameraPermissions = () => {
    return [{ granted: false, canAskAgain: true } as any, async () => ({ granted: false } as any)];
  };
}

const SUPPORTED_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128'];

export default function BarcodeScannerScreen() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const scannedRef = useRef(false);

  // Hook quyền camera
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission?.();
    }
  }, [permission, requestPermission]);

  const handleScanned = ({ type, data }: { type: string; data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    setScanned(true);
    // Trả barcode về màn trước qua query param. Màn `SearchScan` có thể đọc
    // `params.barcode` và tự gọi API tra cứu.
    router.replace({ pathname: '/SearchScan' as any, params: { barcode: data, barcodeType: type } });
  };

  // ── Render: lib chưa cài ───────────────────────────────────────────────────
  if (!CameraView) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => router.back()} title="Quét mã vạch" />
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text style={styles.placeholderTitle}>Chưa cài đặt `expo-camera`</Text>
          <Text style={styles.placeholderBody}>
            Chạy `npx expo install expo-camera` rồi rebuild app để dùng tính năng quét mã vạch.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: web không có camera API qua expo-camera ────────────────────────
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => router.back()} title="Quét mã vạch" />
        <View style={styles.center}>
          <Ionicons name="globe-outline" size={48} color="#9CA3AF" />
          <Text style={styles.placeholderTitle}>Không hỗ trợ trên web</Text>
          <Text style={styles.placeholderBody}>Vui lòng mở app trên thiết bị iOS/Android.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: quyền camera ───────────────────────────────────────────────────
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#00C48C" size="large" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => router.back()} title="Quét mã vạch" />
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={48} color="#9CA3AF" />
          <Text style={styles.placeholderTitle}>Cần quyền truy cập camera</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={async () => {
              const r = await requestPermission?.();
              if (!r?.granted) {
                Alert.alert('Quyền camera', 'Vui lòng cấp quyền trong Cài đặt.');
              }
            }}
          >
            <Text style={styles.primaryBtnText}>Cấp quyền</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: camera đang chạy ───────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: SUPPORTED_TYPES }}
        onBarcodeScanned={scanned ? undefined : handleScanned}
      />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <Header onBack={() => router.back()} title="Quét mã vạch" tintColor="#fff" />
        <View style={styles.viewfinder} pointerEvents="none" />
        <Text style={styles.helper}>
          Đưa mã vạch vào khung. App sẽ tự nhận diện và tra cứu sản phẩm.
        </Text>
      </SafeAreaView>
    </View>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────
function Header({ onBack, title, tintColor = '#0F172A' }: { onBack: () => void; title: string; tintColor?: string }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Quay lại">
        <Ionicons name="chevron-back" size={22} color={tintColor} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: tintColor }]}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1.5 },
  viewfinder: {
    width: 260, height: 260, alignSelf: 'center', marginTop: '15%',
    borderWidth: 3, borderColor: '#00C48C', borderRadius: 24,
    backgroundColor: 'transparent',
  },
  helper: {
    color: '#fff', textAlign: 'center', marginTop: 24, paddingHorizontal: 32,
    fontSize: 14, fontWeight: '500',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  placeholderTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginTop: 8 },
  placeholderBody: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  primaryBtn: {
    marginTop: 12, paddingVertical: 12, paddingHorizontal: 24,
    backgroundColor: '#00C48C', borderRadius: 999,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
