/**
 * @file fastingLogic.ts
 * @description Các hàm thuần túy xử lý logic Nhịn ăn Gián đoạn.
 * 
 * QUAN TRỌNG: KHÔNG sử dụng React Hook. Chỉ nhận đầu vào → trả đầu ra.
 */

import { FastingSession } from '@/src/types';

/**
 * Thông tin Linh vật (Mascot) tương ứng với mục tiêu nhịn ăn.
 */
export type MascotInfo = {
  /** Emoji biểu tượng */
  icon: string;
  /** Tên hiển thị của lộ trình (VD: '16:8') */
  name: string;
};

/**
 * Trả về Linh vật phù hợp với mục tiêu nhịn ăn.
 * Dùng trong cả tab Fasting và tab Nhật ký.
 *
 * @param goal - Số giờ mục tiêu nhịn ăn
 * @returns Đối tượng MascotInfo
 */
export function getMascotForGoal(goal: number): MascotInfo {
  if (goal <= 14) return { icon: '🐱', name: '14:10' };
  if (goal <= 16) return { icon: '🦊', name: '16:8' };
  if (goal <= 18) return { icon: '🐯', name: '18:6' };
  if (goal <= 20) return { icon: '🦁', name: '20:4' };
  return { icon: '🐉', name: 'OMAD' };
}

/**
 * Thuật toán Tách Ngày (Daily Time Splitting / Bucketing).
 * 
 * Khi một phiên nhịn ăn kéo dài xuyên qua nhiều ngày, hàm này sẽ tự động
 * chia nhỏ thành các khối (chunks) — mỗi khối thuộc đúng 1 ngày lịch.
 * 
 * Ví dụ: Nhịn từ 20h Thứ 2 đến 08h Thứ 4:
 *   - Thứ 2: 4 tiếng (20h → 24h)
 *   - Thứ 3: 24 tiếng (00h → 24h)
 *   - Thứ 4: 8 tiếng (00h → 08h)
 *
 * @param startMs - Mốc bắt đầu nhịn ăn (Unix ms)
 * @param endMs - Mốc kết thúc nhịn ăn (Unix ms)
 * @param existingHistory - Lịch sử phiên đã tồn tại (để cộng dồn)
 * @returns Mảng FastingSession đã được tách theo ngày
 */
export function splitFastingSession(
  startMs: number,
  endMs: number,
  existingHistory: FastingSession[] = [],
): FastingSession[] {
  const newHistory = [...existingHistory];
  let currentMs = startMs;

  while (currentMs < endMs) {
    // Tính mốc 00:00 của ngày hôm sau
    const d = new Date(currentMs);
    const nextDay = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const endOfDayMs = nextDay.getTime();

    // Mốc kết thúc chunk: hoặc cuối ngày, hoặc mốc kết thúc phiên (lấy nhỏ hơn)
    const chunkEndMs = Math.min(endOfDayMs, endMs);
    const chunkDurationHours = (chunkEndMs - currentMs) / (1000 * 60 * 60);

    // Chuyển sang YYYY-MM-DD chuẩn Local time
    const dateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];

    // Tìm xem ngày này đã có trong lịch sử chưa → cộng dồn
    const existingIdx = newHistory.findIndex(s => s.id === dateStr);
    if (existingIdx >= 0) {
      newHistory[existingIdx] = {
        ...newHistory[existingIdx],
        durationHours: newHistory[existingIdx].durationHours + chunkDurationHours,
        endTime: Math.max(newHistory[existingIdx].endTime, chunkEndMs),
      };
    } else {
      newHistory.push({
        id: dateStr,
        startTime: currentMs,
        endTime: chunkEndMs,
        durationHours: chunkDurationHours,
      });
    }

    currentMs = chunkEndMs;
  }

  return newHistory;
}
