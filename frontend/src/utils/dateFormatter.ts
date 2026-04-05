/**
 * @file dateFormatter.ts
 * @description Các hàm thuần túy xử lý định dạng ngày tháng.
 * 
 * QUAN TRỌNG: KHÔNG sử dụng React Hook. Chỉ nhận đầu vào → trả đầu ra.
 */

/**
 * Lấy ngày hôm nay theo múi giờ địa phương, dạng chuỗi YYYY-MM-DD.
 * Giải quyết vấn đề UTC offset khi dùng toISOString() trực tiếp.
 *
 * @returns Chuỗi ngày local (VD: '2026-04-05')
 */
export function getLocalToday(): string {
  const d = new Date();
  return new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];
}

/** Cấu hình định dạng ngày tiếng Việt đầy đủ */
const VI_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/**
 * Định dạng ngày theo tiếng Việt đầy đủ.
 * VD: "Thứ Bảy, 5 tháng 4, 2026"
 *
 * @param date - Đối tượng Date cần định dạng
 * @returns Chuỗi ngày tiếng Việt
 */
export function formatVietnameseDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('vi-VN', VI_DATE_FORMAT).format(date);
}
