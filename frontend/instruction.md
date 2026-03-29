# Project Instructions: NutriTrack (React Native Expo)

## 1. Tech Stack & Standards
- Framework: Expo SDK 50+ (Managed Workflow).
- Language: TypeScript (Strict mode).
- Styling: NativeWind (Tailwind CSS for React Native).
- Navigation: Expo Router (File-based routing).
- State Management: React Context API.

## 2. Coding Best Practices
- Component: Sử dụng Functional Components và Hooks.
- UI/UX: Mọi văn bản phải bọc trong thẻ <Text>, không dùng thẻ <div> của Web.
- Performance: Sử dụng Memoization (useMemo, useCallback) khi xử lý các phép tính Calo phức tạp.
- Clean Code: Biến và hàm phải đặt tên theo camelCase, rõ nghĩa (ví dụ: `calculateDailyCalorie` thay vì `calc`).

## 3. Advanced Mobile Standards
- **Safe Area:** Luôn bọc màn hình chính trong `SafeAreaView` để tránh lẹm vào Notch/Dynamic Island.
- **Image Optimization:** Sử dụng `expo-image` thay cho thẻ `Image` mặc định để tăng tốc độ load và lưu cache ảnh món ăn.
- **Platform Select:** Khi có sự khác biệt giữa iOS/Android (ví dụ: bóng đổ - shadow), sử dụng `Platform.select({ ios: {...}, android: {...} })`.
- **Keyboard Handling:** Mọi màn hình có ô nhập liệu (như nhập Cân nặng) phải sử dụng `KeyboardAvoidingView` để không bị bàn phím che khuất.