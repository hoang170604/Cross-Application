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
- **Duy trì vóc dáng (maintain):** TDEE giữ nguyên (Macros: 30% Protein, 40% Carb, 30% Fat).
- **Giảm cân & Đốt mỡ (lose_weight):** $TDEE - 500$ kcal (Macros: 40% Protein, 30% Carb, 30% Fat).
- **Tăng cơ & Tăng cân chuẩn (build_muscle):** $TDEE + 500$ kcal (Macros: 30% Protein, 50% Carb, 20% Fat).
- **Mang thai (Pregnancy):** $TDEE + 350$ kcal (Ưu tiên vi chất & Protein).

## 3. Kịch bản kiểm thử thực tế (Test Case Example)
Áp dụng cho đối tượng: Nam, 25 tuổi, Chiều cao 175 cm, Cân nặng 80 kg, Mức vận động Nhẹ (hệ số 1.375), Mục tiêu Giảm cân (`lose_weight`).
- **BMR (Basal Metabolic Rate):**
  $$BMR = 10 \times 80 + 6.25 \times 175 - 5 \times 25 + 5 = 1773.75 \text{ Kcal}$$
- **TDEE (Total Daily Energy Expenditure):**
  $$TDEE = 1773.75 \times 1.375 = 2438.9 \text{ Kcal}$$
- **Calo mục tiêu (Target Calories):**
  $$\text{Calo mục tiêu} = TDEE - 500 \text{ Kcal} = 2438.9 - 500 = 1938.9 \approx 1939 \text{ Kcal}$$
- **Phân bổ dinh dưỡng đa lượng (Macro Distribution):**
  Tỷ lệ giảm cân: 40% Protein, 30% Carb, 30% Fat.
  - **Protein (40%):** $1939 \times 40\% / 4 \text{ kcal/g} = 193.9 \text{g} \approx 194 \text{g}$
  - **Carb (30%):** $1939 \times 30\% / 4 \text{ kcal/g} = 145.4 \text{g} \approx 145 \text{g}$
  - **Fat (30%):** $1939 \times 30\% / 9 \text{ kcal/g} = 64.6 \text{g} \approx 65 \text{g}$

## 4. Intermittent Fasting (IF) Biological Stages
AI Agent sử dụng bảng này để hiển thị "Chú thích mục đích" và Badge trạng thái trên màn hình Fasting:

| Thời gian (Giờ) | Trạng thái | Mục đích & Lợi ích sinh học |
| :--- | :--- | :--- |
| **0h - 4h** | Sugar Processing | Cơ thể xử lý năng lượng từ bữa ăn cuối, Insulin tăng cao. |
| **4h - 12h** | Transition | Đường huyết giảm, cơ thể bắt đầu lấy năng lượng từ Glycogen trong gan. |
| **12h - 16h** | **Ketosis (Đốt mỡ)** | Glycogen cạn, cơ thể chuyển sang đốt mỡ thừa tạo Ketones. **Mục tiêu: Giảm cân.** |
| **16h - 24h** | **Autophagy (Tái tạo)** | Cơ thể tự dọn dẹp tế bào cũ/lỗi, tái tạo tế bào mới. **Mục tiêu: Trẻ hóa.** |

## 5. Data Flow & Integration
- **Frontend:** Dữ liệu từ Onboarding -> UserProfileContext -> Dashboard/Stats.
- **Backend:** Luôn chuẩn bị cấu trúc JSON CamelCase để đẩy dữ liệu lên Spring Boot API (Java 21).
- **Sync Rule:** Khi người dùng thay đổi cân nặng ở App, AI phải đề xuất tính toán lại TDEE dựa trên công thức ở mục (1).