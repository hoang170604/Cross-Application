# 🧠 NutriTrack Project Skills: Nutrition & Fasting Logic

## 1. Calorie Calculation Logic (Mifflin-St Jeor)
Hệ thống tính toán dựa trên kịch bản (Mục tiêu x Mức độ vận động):
- **BMR Nam:** $10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} + 5$
- **BMR Nữ:** $10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} - 161$
- **TDEE (Total Daily Energy Expenditure):** $BMR \times \text{ActivityMultiplier}$.

**Bảng hệ số ActivityMultiplier:**
- *Ít vận động (Sedentary):* 1.2
- *Vận động nhẹ (Lightly active):* 1.375
- *Vận động vừa (Moderately active):* 1.55
- *Vận động nhiều (Very active):* 1.725
- *Vận động cực nhiều (Extra active):* 1.9

## 2. Goal Adjustment & Macros
- **Giữ cân (Maintenance):** TDEE giữ nguyên (Macros: 45% Carb, 25% Protein, 30% Fat).
- **Giảm cân (Weight Loss):** $TDEE - 500$ (Macros: 40% Carb, 30% Protein, 30% Fat).
- **Tăng cơ (Muscle Gain):** $TDEE + 500$ (Macros: 50% Carb, 25% Protein, 25% Fat).
- **Mang thai (Pregnancy):** $TDEE + 350$ (Ưu tiên vi chất & Protein).

## 3. Intermittent Fasting (IF) Biological Stages
AI Agent sử dụng bảng này để hiển thị "Chú thích mục đích" và Badge trạng thái trên màn hình Fasting:

| Thời gian (Giờ) | Trạng thái | Mục đích & Lợi ích sinh học |
| :--- | :--- | :--- |
| **0h - 4h** | Sugar Processing | Cơ thể xử lý năng lượng từ bữa ăn cuối, Insulin tăng cao. |
| **4h - 12h** | Transition | Đường huyết giảm, cơ thể bắt đầu lấy năng lượng từ Glycogen trong gan. |
| **12h - 16h** | **Ketosis (Đốt mỡ)** | Glycogen cạn, cơ thể chuyển sang đốt mỡ thừa tạo Ketones. **Mục tiêu: Giảm cân.** |
| **16h - 24h** | **Autophagy (Tái tạo)** | Cơ thể tự dọn dẹp tế bào cũ/lỗi, tái tạo tế bào mới. **Mục tiêu: Trẻ hóa.** |

## 4. Data Flow & Integration
- **Frontend:** Dữ liệu từ Onboarding -> UserProfileContext -> Dashboard/Stats.
- **Backend:** Luôn chuẩn bị cấu trúc JSON CamelCase để đẩy dữ liệu lên Spring Boot API (Java 21).
- **Sync Rule:** Khi người dùng thay đổi cân nặng ở App, AI phải đề xuất tính toán lại TDEE dựa trên công thức ở mục (1).