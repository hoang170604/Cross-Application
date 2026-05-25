import { getDatabase } from '../db/database';

/**
 * ĐỊNH NGHĨA HỢP ĐỒNG DỮ LIỆU HÀNG ĐỢI ĐỒNG BỘ (SyncItem)
 * Đây là cấu trúc dữ liệu của một dòng (row) trong bảng `sync_queue` dưới SQLite local.
 * Mỗi khi người dùng thực hiện một thao tác thay đổi dữ liệu (Thêm món ăn, ghi nhận bài tập, uống nước, cân nặng...)
 * trong điều kiện mất mạng hoặc server lỗi, hệ thống sẽ đóng gói (serialize) thành đối tượng này để lưu trữ tạm.
 */
export interface SyncItem {
  id?: number;                  // Khóa chính tự tăng (Primary Key - AUTOINCREMENT) của dòng trong bảng SQLite
  action_type: 'ADD_MEAL' | 'ADD_ACTIVITY' | 'LOG_WATER' | 'LOG_WEIGHT'; // Định danh hành động (Loại nghiệp vụ cần đồng bộ)
  payload: string;              // Chuỗi JSON (JSON stringified) chứa toàn bộ tham số cần thiết để gọi API tương ứng
  created_at: string;           // Thời điểm xảy ra thao tác (dùng để sắp xếp đồng bộ theo đúng thứ tự thời gian FIFO)
  retry_count?: number;         // Số lần đã thử đồng bộ thất bại (giúp phát hiện các tác vụ lỗi vĩnh viễn - Poison Pill)
}

/**
 * HÀM THÊM YÊU CẦU ĐỒNG BỘ VÀO HÀNG ĐỢI (Queue Producer)
 * @param action - Loại nghiệp vụ cần đồng bộ (ví dụ: 'ADD_MEAL', 'LOG_WATER', ...)
 * @param data - Đối tượng dữ liệu (object) chứa các tham số nghiệp vụ đầu vào của API
 * 
 * Cơ chế hoạt động:
 * 1. Mở kết nối đến database SQLite của thiết bị di động (qua getDatabase()).
 * 2. Chuyển đổi (serialize) đối tượng `data` thành chuỗi JSON dạng text để SQLite có thể lưu trữ vào cột kiểu TEXT (`payload`).
 * 3. Thực thi câu lệnh `INSERT` để lưu trữ bản ghi vào bảng `sync_queue` kèm mốc thời gian ISO hiện tại (`created_at`).
 * 4. Nhờ vậy, dữ liệu được bảo toàn ngay cả khi người dùng tắt app hoặc thiết bị hết pin trước khi có mạng trở lại.
 */
export async function addToSyncQueue(action: SyncItem['action_type'], data: any) {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO sync_queue (action_type, payload, created_at) VALUES (?, ?, ?)',
    [action, JSON.stringify(data), new Date().toISOString()]
  );
  console.log(`[SyncQueue] Đã lưu trữ tạm tác vụ [${action}] vào hàng đợi SQLite dưới máy.`);
}

/**
 * HÀM TRUY VẤN TOÀN BỘ HÀNG ĐỢI ĐỒNG BỘ (Queue Consumer Reader)
 * @returns Mảng các đối tượng SyncItem đang chờ xử lý, sắp xếp theo thứ tự thời gian cũ nhất đến mới nhất.
 * 
 * Cơ chế hoạt động:
 * 1. Mở kết nối cơ sở dữ liệu SQLite.
 * 2. Thực thi câu lệnh `SELECT` để lấy tất cả các bản ghi có trong bảng `sync_queue`.
 * 3. Áp dụng mệnh đề `ORDER BY created_at ASC` để đảm bảo cơ chế FIFO (First-In, First-Out - Vào trước, ra trước).
 *    Điều này tối quan trọng vì thứ tự thao tác của người dùng cần được giữ nguyên khi đồng bộ về Server (ví dụ: thêm bữa ăn rồi mới sửa/xóa).
 */
export async function getSyncQueue(): Promise<SyncItem[]> {
  const db = await getDatabase();
  return await db.getAllAsync<SyncItem>('SELECT * FROM sync_queue ORDER BY created_at ASC');
}

/**
 * HÀM XÓA TÁC VỤ SAU KHI ĐỒNG BỘ THÀNH CÔNG (Queue Cleaner)
 * @param id - Khóa chính (id) của tác vụ cần xóa trong bảng SQLite.
 * 
 * Cơ chế hoạt động:
 * - Sau khi Sync Worker (syncManager) gọi API thành công lên Backend, nó sẽ gọi hàm này.
 * - Thực thi câu lệnh `DELETE` dựa theo `id` để dọn dẹp hàng đợi SQLite, giải phóng bộ nhớ thiết bị.
 */
export async function removeFromSyncQueue(id: number) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
}

/**
 * HÀM TĂNG SỐ LẦN THỬ LẠI KHI THẤT BẠI (Retry Incrementer)
 * @param id - Khóa chính (id) của tác vụ đồng bộ bị lỗi API.
 * 
 * Cơ chế hoạt động:
 * - Nếu API báo lỗi (ngoại trừ lỗi mất mạng), ta tăng cột `retry_count` lên 1.
 * - Cột này giúp quản trị ứng dụng hoặc hệ thống theo dõi: nếu một tác vụ bị lỗi quá nhiều lần (ví dụ: do dữ liệu vi phạm ràng buộc ở Backend),
 *   ta có thể bỏ qua hoặc báo lỗi thay vì gửi yêu cầu vô hạn làm nghẽn hàng đợi (cơ chế tránh Poison Pill).
 */
export async function incrementRetryCount(id: number) {
  const db = await getDatabase();
  await db.runAsync('UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?', [id]);
}

