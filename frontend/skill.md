# Project Skills: Nutrition & Logic

## 1. Calorie Calculation Logic (Mifflin-St Jeor)
Hệ thống tính toán dựa trên 18 kịch bản (3 mục tiêu x 6 mức độ vận động):
- BMR Nam: (10 * weight) + (6.25 * height) - (5 * age) + 5
- BMR Nữ: (10 * weight) + (6.25 * height) - (5 * age) - 161
- TDEE = BMR * ActivityMultiplier (1.2 đến 1.9).

## 2. Goal Adjustment
- Giảm cân: TDEE - 500.
- Tăng cơ: TDEE + 500.
- Mang thai (Nữ): TDEE + 350 (Ưu tiên sức khỏe).

## 3. Data Flow
- Dữ liệu từ Onboarding -> UserProfileContext -> Dashboard/Stats.
- Luôn chuẩn bị sẵn cấu trúc để sau này kết nối API Spring Boot (CamelCase).