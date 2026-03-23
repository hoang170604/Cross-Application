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

## 3. Web-to-Mobile Mapping Rule
- Khi tham chiếu mã nguồn từ `ReactWeb/`, phải ánh xạ:
  - div/section -> View
  - img -> Image (Expo)
  - button -> TouchableOpacity
  - span/p/h1 -> Text