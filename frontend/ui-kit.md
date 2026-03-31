# 🎨 NutriTrack Design System (UI Kit)

## 1. Color Palette (Bảng màu chủ đạo)
Sử dụng hệ màu hiện đại, tạo cảm giác sạch sẽ và sức khỏe:
- **Primary (Mint Green):** `#10B981` (Tailwind: `emerald-500`) - Dùng cho nút chính, icon quan trọng.
- **Secondary (Orange):** `#F59E0B` (Tailwind: `amber-500`) - Dùng cho Nhịn ăn, Đốt mỡ, Năng lượng.
- **Background:** `#F9FAFB` (Tailwind: `slate-50`) - Nền chính của toàn app.
- **Card Background:** `#FFFFFF` (Tailwind: `white`) - Nền của các thẻ nội dung.
- **Text Primary:** `#111827` (Tailwind: `slate-900`) - Tiêu đề, nội dung chính.
- **Text Secondary:** `#6B7280` (Tailwind: `slate-500`) - Chú thích, đơn vị.
- **Danger:** `#EF4444` (Tailwind: `red-500`) - Nút hủy, kết thúc sớm, cảnh báo.

## 2. Typography (Phông chữ)
Mọi văn bản phải nằm trong thẻ `<Text>` của React Native:
- **Heading 1:** `text-2xl font-bold text-slate-900`
- **Heading 2:** `text-xl font-semibold text-slate-800`
- **Body:** `text-base text-slate-600`
- **Caption:** `text-xs text-slate-400`

## 3. Layout & Spacing (Bố cục & Khoảng cách)
- **Border Radius:** Ưu tiên `rounded-2xl` (16px) hoặc `rounded-3xl` (24px) để tạo cảm giác mềm mại.
- **Padding/Margin:** Sử dụng hệ số 4 (p-4, m-4, gap-4).
- **Shadow:** Sử dụng `shadow-sm` cho các Card để tạo chiều sâu trên nền trắng.
- **Container:** Mọi màn hình phải có `flex-1 bg-slate-50`.

## 4. Components Standard (Quy chuẩn thành phần)
- **Primary Card:** `bg-white rounded-2xl p-4 shadow-sm border border-slate-100`
- **Primary Button:** `bg-emerald-500 rounded-xl py-4 items-center shadow-md`
- **Secondary Button:** `border border-emerald-500 rounded-xl py-4 items-center`
- **Badge:** `px-3 py-1 rounded-full items-center justify-center` (Ví dụ: Badge 'Đốt mỡ' dùng `bg-amber-100 text-amber-600`).

## 5. Responsive Rules (Đa nền tảng)
- **Web Demo:** Để tránh kéo giãn trên Web, nội dung chính phải bọc trong `max-w-[500px] mx-auto w-full`.
- **Safe Area:** Luôn sử dụng `SafeAreaView` để tránh Notch/Dynamic Island trên iPhone.