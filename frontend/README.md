# NutriTrack Frontend - Hệ Thống Quản Lý Dinh Dưỡng Thông Minh

![NutriTrack Banner](https://img.shields.io/badge/NutriTrack-Atomic_Design-00C48C?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

Chào mừng đến với **NutriTrack**, ứng dụng di động chuyên sâu về quản lý dinh dưỡng, nhịn ăn gián đoạn (Intermittent Fasting) và tối ưu hóa vận động. Dự án này được xây dựng với kiến trúc **Atomic Design** chuẩn mực, kết hợp cùng hệ thống quản lý logic đa tầng nhằm đảm bảo tính bảo trì, hiệu năng và khả năng mở rộng (Scalability).

---

## 🏛️ Kiến Trúc Hệ Thống

Để đáp ứng các tiêu chuẩn kỹ thuật khắt khe, NutriTrack áp dụng mô hình phân lớp logic độc lập (Decoupled Logic Layers), giúp tách biệt hoàn toàn giữa việc tính toán y sinh và hiển thị giao diện.

### 1. Phân Tầng Logic (Business Logic Layers)
Hệ thống được chia thành 4 lớp cốt lõi:
- **`src/@types`**: Định nghĩa "Single Source of Truth". Mọi dữ liệu (UserProfile, FastingSession, FoodItem) đều được kiểu hóa chặt chẽ bằng TypeScript Interfaces, hạn chế tối đa Runtime Errors.
- **`src/utils`**: Thư viện các **Pure Functions** (Hàm thuần túy). Các thuật toán tính BMR, TDEE, BMI, hay tách phiên nhịn ăn (`splitFastingSession`) được viết độc lập với React, giúp dễ dàng viết Unit Test và tái sử dụng.
- **`src/hooks`**: Lớp xử lý nghiệp vụ (Domain Logic). Các Custom Hooks (`useNutrition`, `useFasting`, `useWorkout`) đóng gói toàn bộ logic phức tạp và state cục bộ, cung cấp các API tinh gọn cho UI.
- **`src/context`**: Bộ điều phối trung tâm (Orchestrator). `UserProfileContext` quản lý states toàn cục và đồng bộ hóa dữ liệu giữa các Tabs (Diary, Statistics, Profile).

### 2. Kiến Trúc Giao Diện (Atomic Design Architecture)
Giao diện không được xây dựng theo từng màn hình rời rạc mà theo hệ thống linh kiện (Component System):
- **Atoms**: Các đơn vị nhỏ nhất không thể chia cắt (Button, ProgressBar, IconButton).
- **Molecules**: Sự kết hợp các Atoms để thực hiện một chức năng đơn giản (FoodItemRow, MacroMetric).
- **Organisms**: Các khối giao diện phức tạp, có khả năng tự quản lý hoặc nhận dữ liệu từ Hook/Context (WaterTrackerCard, FastingTimerCard, WeightHistoryChart).

---

## 📂 Cấu Trúc Thư Mục

```text
frontend/
├── app/                # Expo Router (File-based Routing)
├── src/
│   ├── components/
│   │   ├── atoms/      # Thành phần cơ bản (Button, Progress, icon)
│   │   ├── molecules/  # Thành phần phức hợp (Item rows, Metrics)
│   │   └── organisms/  # Khối tính năng (Charts, Tracker Cards, Timers)
│   ├── context/        # Global State Management (UserProfileContext)
│   ├── hooks/          # Nghiệp vụ Logic (useNutrition, useFasting, useStorage)
│   ├── types/          # Type Definitions (TypeScript)
│   └── utils/          # Logic tính toán y sinh (BMR, TDEE, Date)
└── assets/             # Hình ảnh, Font và Mascot
```

---

Dự án chú trọng đặc biệt vào việc tối ưu hóa mức tiêu thụ tài nguyên và trải nghiệm mượt mà trên thiết bị di động:

> [!IMPORTANT]
> **Memoization & 60 FPS**: 
> Sử dụng `React.memo` và `useMemo` cho các thành phần UI hay thay đổi (như đồng hồ nhảy giây trong FastingTimer hoặc thanh ProgressBar). Việc này giúp ngăn chặn hiện tượng re-render dư thừa cho các thành phần tĩnh xung quanh, duy trì khung hình ổn định ở mức 60 FPS.

- **Data Persistence (AsyncStorage)**: Tích hợp cơ chế tự động lưu trữ trạng thái người dùng vào bộ nhớ máy thông qua `useStorage`. Hệ thống đảm bảo dữ liệu không bị mất khi ứng dụng tắt đột ngột.
- **Dynamic Chart Scaling**: Biểu đồ lịch sử (Line/Bar Chart) sử dụng thuật toán **Dynamic Max Value**, tự động giãn nở thang đo theo dữ liệu thực tế của người dùng, tránh lỗi tràn khung hình (Layout Overflow).
- **Haptic Feedback & Stepper Logic**: Tích hợp rung cơ học (Haptics) khi tương tác với `WeightProgressCard`, kết hợp cùng cơ chế **Long Press** giúp người dùng điều chỉnh thông số nhanh chóng và trực quan.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Framework**: React Native (Expo SDK 50+)
- **Ngôn ngữ**: TypeScript 5.x
- **State Management**: React Context API & Custom Hooks
- **Navigation**: Expo Router (Native Stack & Bottom Tabs)
- **Visualization**: React Native Chart Kit
- **Feedback**: Expo Haptics

---

## 🚀 Hướng Dẫn Cài Đặt

Để chạy dự án dưới môi trường local, hãy thực hiện các bước sau:

1. **Cài đặt các gói phụ thuộc**:
   ```bash
   npm install
   ```
2. **Khởi động dự án Expo**:
   ```bash
   npx expo start
   ```
3. **Chạy trên thiết bị**: Quét mã QR bằng ứng dụng **Expo Go** (Android/iOS) hoặc nhấn `a` cho Android emulator, `i` cho iOS simulator.
