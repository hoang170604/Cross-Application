# 🥗 NutriTrack Frontend - Expo & React Native

![NutriTrack Banner](https://img.shields.io/badge/NutriTrack-Obytes_Architecture-00C48C?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

**NutriTrack** là ứng dụng di động theo dõi dinh dưỡng và sức khỏe cá nhân hóa, được xây dựng trên nền tảng React Native (Expo). Dự án áp dụng kiến trúc phân lớp chuyên nghiệp, tập trung vào tính mô-đun, hiệu năng cao và khả năng đồng bộ thời gian thực với hệ thống Backend.

---

## 🏛️ Kiến Trúc Hệ Thống (Obytes Inspired)

Dự án được cấu trúc theo mô hình phân lớp (Layered Architecture), giúp tách biệt hoàn toàn giữa UI, State Management và API Service.

### 1. Phân Tầng Logic chuyên biệt
- **`src/api` (Service Layer)**: Quản lý toàn bộ giao tiếp với Backend thông qua Axios. Tách biệt logic gọi API khỏi UI components.
- **`src/store` (State Layer)**: Sử dụng **Zustand** để quản lý state toàn cầu (Auth, User Profile, App Settings) với cơ chế persist dữ liệu thông minh.
- **`src/core` (Infrastructure Layer)**: Chứa các cấu hình hệ thống, hàm tiện ích (utils), và logic tính toán cốt lõi (BMR, TDEE - đồng bộ với thuật toán Backend).
- **`src/hooks` (Domain Logic Layer)**: Các Custom Hooks đóng gói nghiệp vụ phức tạp, cung cấp dữ liệu tinh gọn cho Screens.

### 2. Hệ Thống Giao Diện (UI Layer)
- **`src/ui`**: Thư viện các Design System components có thể tái sử dụng cao (MealCard, FastingTimer, Charts).
- **`src/screens`**: Các màn hình tính năng lớn, kết hợp logic từ Store/Hooks và UI components.

---

## 📂 Cấu Trúc Thư Mục Cập Nhật

```text
frontend/
├── app/                # Expo Router (File-based Routing - Tabs & Stack)
├── src/
│   ├── api/            # Hệ thống gọi API (Axios Services)
│   ├── core/           # Constants, Utilities, Auth logic, Storage
│   ├── hooks/          # Custom hooks cho nghiệp vụ (useNutrition, useFasting)
│   ├── screens/        # UI chính của từng tính năng
│   ├── store/          # Zustand State Management (Global Store)
│   ├── types/          # TypeScript interface & types định danh
│   └── ui/             # Reusable UI Components & Theme system
├── assets/             # Media, Images & Fonts
└── scripts/            # Các helper scripts cho development
```

---

## 🛠️ Công Nghệ Chốt (Tech Stack)

- **Framework**: React Native (Expo SDK 54+)
- **State Management**: Zustand 5.x (Lightweight & High Performance)
- **Data Fetching**: Axios (Interceptors, Error Handling)
- **Navigation**: Expo Router (Native Routing)
- **Styling**: React Native StyleSheet (Optimized for performance)
- **Charts**: React Native Chart Kit
- **Type Safety**: TypeScript 5.9+

---

## ✨ Tính Năng Nổi Bật

- 🎯 **Cá nhân hóa mục tiêu**: Tính toán Calo, Macros (Protein/Carb/Fat) chính xác theo mục tiêu Giảm cân, Giữ cân hoặc Tăng cơ.
- 🕒 **Nhịn ăn gián đoạn (Fasting)**: Bộ đếm thời gian nhịn ăn real-time hỗ trợ nhiều chế độ (16:8, 18:6, 20:4).
- 📊 **Theo dõi trực quan**: Biểu đồ lịch sử cân nặng, dinh dưỡng và tiến độ nhịn ăn thông qua Chart Kit.
- 🔄 **Đồng bộ Backend**: Mọi thay đổi dữ liệu được đồng bộ 1:1 với hệ thống Spring Boot Backend.
- 📱 **Trải nghiệm mượt mà**: Tích hợp Expo Haptics và Reanimated cho các hiệu ứng tương tác cao cấp.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

1. **Clone project và cài đặt**:
   ```bash
   cd frontend
   npm install
   ```

2. **Cấu hình biến môi trường**:
   Kiểm tra file `src/api/apiClient.ts` để đảm bảo BASE_URL trỏ đúng địa chỉ Backend của bạn (thường là IP Local nếu chạy trên máy thật).

3. **Khởi chạy**:
   ```bash
   npx expo start
   ```

4. **Trình điều khiển**:
   - Nhấn `a`: Để mở Android Emulator.
   - Nhấn `i`: Để mở iOS Simulator.
   - Quét mã QR bằng ứng dụng **Expo Go** để chạy trực tiếp trên điện thoại.

---

## 🤝 Quy chuẩn Code (Development Workflow)

- Sử dụng **TypeScript** cho mọi file mới để đảm bảo type-safety.
- UI components mới nên được đặt trong `src/ui`.
- Logic phức tạp nên được viết thành **Hook** hoặc **Utils** để dễ Unit Test.
- Mọi API call phải thông qua Service trong `src/api`.
