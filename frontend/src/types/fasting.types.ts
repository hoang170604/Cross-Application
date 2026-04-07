/**
 * @file fasting.types.ts
 * @description Hợp đồng dữ liệu cho hệ thống Nhịn ăn gián đoạn (Intermittent Fasting)
 * và Thử thách Vận động bù Calo (Workout Challenge).
 */

/** Phiên nhịn ăn đã hoàn thành, được lưu vào lịch sử */
export type FastingSession = {
  /** Mã định danh — dùng chuỗi ngày YYYY-MM-DD làm khóa chính */
  id: string;
  /** Mốc thời gian bắt đầu (Unix ms) */
  startTime: number;
  /** Mốc thời gian kết thúc (Unix ms) */
  endTime: number;
  /** Tổng thời lượng nhịn ăn trong ngày đó (giờ) */
  durationHours: number;
};

/** Trạng thái thời gian thực của Thử thách Vận động bù Calo */
export type WorkoutChallengeState = {
  /** Phiên có đang hoạt động không */
  isActive: boolean;
  /** Phiên có đang tạm dừng không */
  isPaused: boolean;
  /** Tổng thời gian mục tiêu (ms) — tính từ công thức 100kcal = 20 phút */
  targetMs: number;
  /** Thời gian đã tích lũy trước khi tạm dừng (ms) */
  accumulatedMs: number;
  /** Mốc thời gian lần cuối tiếp tục chạy (Unix ms) */
  lastResumeTime: number;
  /** Số kcal mục tiêu cần đốt */
  calorieTarget: number;
};
