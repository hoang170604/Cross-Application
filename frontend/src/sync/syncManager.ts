import { useAppStore } from '../store/useAppStore';
import * as syncDb from './syncDb';
import * as diaryApi from '../api/diaryService';
import * as progressApi from '../api/progressService';

/**
 * HÀM TIẾN TRÌNH ĐỒNG BỘ NỀN CHI TIẾT (Offline Sync Worker)
 * 
 * VAI TRÒ: 
 * - Đây là trái tim của cơ chế đồng bộ ngoại tuyến (Offline Sync). Nó chịu trách nhiệm quét 
 *   hàng đợi tạm dưới SQLite (`sync_queue`), lấy dữ liệu người dùng đã thao tác khi mất mạng 
 *   và lần lượt gửi lên Backend Server khi thiết bị có kết nối trở lại.
 * 
 * THỜI ĐIỂM KÍCH HOẠT (TRIGGER POINTS):
 * 1. Khởi động ứng dụng (App Bootstrap): Ngay khi ứng dụng hoàn tất quá trình "Hydration" 
 *    (khôi phục state từ bộ nhớ vào RAM), hàm này sẽ chạy một lần để giải phóng dữ liệu cũ.
 * 2. Chạy ngầm định kỳ (Periodic Background Timer): Mỗi 30 giây chạy một lần để kiểm tra và 
 *    đồng bộ tự động nếu phát hiện có hàng đợi đang chờ.
 * 3. Ngay sau khi một tác vụ API thất bại: Khi người dùng thao tác trực tiếp, nếu API lỗi, 
 *    tác vụ sẽ được đưa vào SQLite và tiến trình đồng bộ nền được cảnh báo.
 */
export async function processSyncQueue() {
  
  // ==========================================
  // BƯỚC 1: TRUY VẤN HÀNG ĐỢI SQLite LOCAL
  // ==========================================
  // Lấy ra danh sách các hành động chưa đồng bộ xếp theo thứ tự thời gian tăng dần (FIFO).
  // Việc đồng bộ theo thứ tự FIFO (First-In, First-Out) là cực kỳ quan trọng để đảm bảo 
  // tính đúng đắn của dữ liệu nghiệp vụ (ví dụ: hành động thêm món ăn phải chạy trước hành động sửa/xóa món ăn đó).
  const queue = await syncDb.getSyncQueue();
  
  // Nếu hàng đợi rỗng, thoát sớm để tiết kiệm RAM, CPU và dung lượng pin của thiết bị di động.
  if (queue.length === 0) {
    return;
  }

  // ==========================================
  // BƯỚC 2: KIỂM TRA PHIÊN ĐĂNG NHẬP (AUTH STATES)
  // ==========================================
  // Lấy thông tin xác thực trực tiếp từ Zustand Store mà không cần thông qua React hooks 
  // (sử dụng getState() để gọi trực tiếp từ các file JS/TS thông thường).
  const { userId, token } = useAppStore.getState();
  
  // Nếu chưa đăng nhập (userId hoặc token trống), tiến trình không thể gọi API nên thoát sớm.
  if (!userId || !token) {
    return;
  }

  console.log(`[Sync Worker] Phát hiện ${queue.length} tác vụ đang chờ đồng bộ lên Server...`);

  // ==========================================
  // BƯỚC 3: DUYỆT TUẦN TỰ (SEQUENTIAL LOOP)
  // ==========================================
  // LƯU Ý QUAN TRỌNG: Tại sao lại dùng vòng lặp `for...of` tuần tự thay vì `Promise.all` song song?
  // -> Sử dụng tuần tự để đảm bảo thứ tự thực hiện (FIFO). Nếu dùng `Promise.all`, các API 
  //    sẽ bắn lên đồng thời không theo thứ tự, có thể gây ra lỗi xung đột khóa database ở Backend 
  //    (Deadlock) hoặc lỗi dữ liệu (ví dụ xóa bản ghi trước khi bản ghi đó được tạo trên Server).
  for (const item of queue) {
    try {
      // Giải mã dữ liệu (deserialize) từ chuỗi JSON lưu dưới cột SQLite thành object Javascript gốc.
      const payload = JSON.parse(item.payload);
      
      // Phân loại kiểu tác vụ bằng câu lệnh switch-case để gọi đúng hàm API trong Service Layer.
      switch (item.action_type) {
        
        case 'ADD_MEAL':
          // Đồng bộ bữa ăn dinh dưỡng (Ví dụ: Thêm món cho bữa Sáng, Trưa, Tối, Nhẹ)
          await diaryApi.addFoodToMeal(userId, payload.mealType, payload.date, payload);
          break;
          
        case 'ADD_ACTIVITY':
          // Đồng bộ bài tập luyện thể chất (Ví dụ: Chạy bộ, đạp xe...)
          await progressApi.addActivity(userId, payload);
          break;
          
        case 'LOG_WATER':
          // Đồng bộ lượng nước uống ghi nhận
          await progressApi.logWater(userId, payload.amount, payload.date);
          break;
          
        case 'LOG_WEIGHT':
          // Đồng bộ thông tin cân nặng đo lường
          await progressApi.logWeight(userId, payload.date, payload.weight);
          break;
      }
      
      // ==========================================
      // BƯỚC 4: XÓA TÁC VỤ KHI THÀNH CÔNG (CLEANUP)
      // ==========================================
      // Nếu API phản hồi thành công (mã trạng thái 2xx, không ném ra ngoại lệ/error), 
      // ta tiến hành xóa bản ghi này khỏi SQLite để tránh đồng bộ lặp lại ở chu kỳ sau.
      await syncDb.removeFromSyncQueue(item.id!);
      console.log(`[Sync Worker] Đồng bộ thành công tác vụ #${item.id} (${item.action_type}) lên Server.`);
      
    } catch (err: any) {
      
      // ==========================================
      // BƯỚC 5: TĂNG SỐ LẦN RETRY KHI API LỖI
      // ==========================================
      // Nếu gặp lỗi API từ phía Server (ví dụ: Lỗi Validate dữ liệu đầu vào 400, Lỗi nghiệp vụ 422),
      // ta tăng retry_count để theo dõi. Việc này giúp ghi nhận nhật ký lỗi.
      console.warn(`[Sync Worker] Lỗi khi đồng bộ tác vụ #${item.id}:`, err.message);
      await syncDb.incrementRetryCount(item.id!);

      // ==========================================
      // BƯỚC 6: CƠ CHẾ NGẮT SỚM (EARLY ABORT)
      // ==========================================
      // ĐÂY LÀ ĐIỂM MẤT CHỐT TRÁNH TIMEOUT VÀ TIẾT KIỆM TÀI NGUYÊN:
      // - Nếu phát hiện lỗi là do mất mạng hoàn toàn (Network Error), Server sập không phản hồi (No Response), 
      //   hoặc kết nối bị hết hạn chờ (Timeout 10000ms).
      // - Ta biết chắc chắn các phần tử còn lại trong hàng đợi cũng sẽ gặp lỗi tương tự nếu gửi tiếp.
      // - Vì thế, ta sử dụng lệnh `break` để thoát vòng lặp ngay lập tức.
      // - Việc ngắt sớm này giúp app không bị treo do chờ đợi hàng loạt timeout (mỗi tác vụ chờ 10 giây), 
      //   đồng thời bảo vệ dung lượng pin thiết bị di động của người dùng không bị cạn kiệt vô ích.
      const isNetworkOrTimeout = 
        err.message?.includes('timeout') || 
        err.message === 'Network Error' || 
        !err.response;
        
      if (isNetworkOrTimeout) {
        console.log('[Sync Worker] Phát hiện mất kết nối mạng hoặc Backend Server quá tải. Tạm ngừng vòng lặp đồng bộ.');
        break;
      }
    }
  }
}

