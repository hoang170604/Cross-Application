# Báo cáo Mismatch (Lệch) Đồng bộ API giữa Frontend và Backend

### 2. Backend thiếu API lấy Lịch sử & Danh mục Hoạt động (Activities)
**File FE:** `frontend/src/api/progressService.ts` | **File BE:** `ActivityController.java`

**Vấn đề (Issue):** 
FE có khai báo 2 hàm:
- `getActivityTypes` gọi `GET /api/activities/types`
- `getActivitiesBetween` gọi `GET /api/activities/users/{userId}?startDate=...`

Tuy nhiên, `ActivityController` ở BE chỉ định nghĩa `@PostMapping`, `@PutMapping` và `@DeleteMapping`. Hoàn toàn không có `@GetMapping` nào, dẫn đến việc FE gọi sẽ bị lỗi 404 Not Found.

**Cách sửa (Suggested Fix):** 
Nên sửa ở BE. Thêm 2 hàm `@GetMapping("/types")` và `@GetMapping("/users/{userId}")` vào `ActivityController.java` và nối vào logic lấy dữ liệu của Service.

---

### 3. Backend thiếu API lấy Nhật ký Bữa ăn (Get Diary)
**File FE:** `frontend/src/api/diaryService.ts` | **File BE:** `DiaryController.java`

**Vấn đề (Issue):** 
FE có hàm `getDiary` chuyên dùng để render màn hình nhật ký, nó gọi `GET /api/diaries/users/{userId}?date={date}`. Nhưng nhìn vào `DiaryController.java`, BE chỉ hỗ trợ `POST`, `PUT`, `DELETE` cho các món ăn (Meal Log) chứ không có API nào để FE lấy dữ liệu hiển thị lên màn hình.

**Cách sửa (Suggested Fix):** 
Nên sửa ở BE. Bổ sung thêm hàm `@GetMapping("/users/{userId}")` để lấy toàn bộ `Meal` và `MealLog` của user theo ngày.

---

### 4. Sai kiểu dữ liệu Thời gian (Date vs DateTime) khi Lưu lượng Nước
**File FE:** `frontend/src/api/progressService.ts` | **File BE:** `WaterController.java`

**Vấn đề (Issue):** 
Trong hàm `logWater`, FE gửi lên `timestamp` bằng biến `logDate`. Biến này lấy từ `getLocalToday()` (chỉ trả về chuỗi ngày dạng `YYYY-MM-DD`). Tuy nhiên ở BE, class `LogWaterRequest` lại định nghĩa trường `timestamp` là kiểu `LocalDateTime`. Khi thư viện Jackson của Spring Boot cố gắng ép kiểu `YYYY-MM-DD` sang `LocalDateTime` (vốn bắt buộc phải có giờ phút giây, ví dụ: `YYYY-MM-DDTHH:mm:ss`), nó sẽ ném ra lỗi `InvalidFormatException` và BE sẽ trả về 400 Bad Request.

**Cách sửa (Suggested Fix):** 
Nên sửa ở BE hoặc FE.
- **Nếu sửa BE:** Đổi `LocalDateTime timestamp` thành `LocalDate timestamp` (vì thực tế ứng dụng chỉ quan tâm theo dõi nước theo ngày).
- **Nếu sửa FE:** Đừng dùng `getLocalToday()`, hãy dùng `new Date().toISOString()` để gửi chuỗi có đầy đủ giờ giấc.

---

### 5. Lỗi khóa quyền quản trị ở module Workout Challenges
**File FE:** `frontend/src/api/workoutService.ts` | **File BE:** `WorkoutChallengeController.java`

**Vấn đề (Issue):** 
FE cho phép người dùng tự tạo, sửa, xóa các thử thách tập luyện cá nhân thông qua các hàm `createChallenge`, `updateChallenge`. Thế nhưng ở BE, các endpoint `POST`, `PUT`, `DELETE` lại đang bị chặn gắt gao bởi tag `@PreAuthorize("hasRole('ADMIN')")`. Điều này khiến mọi thao tác của người dùng (với quyền USER) đều sẽ bị BE chặn đứng và trả về 403 Forbidden.

**Cách sửa (Suggested Fix):** 
Nên sửa ở BE. Nới lỏng phân quyền: Đổi thành `@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")` trên các endpoint thay đổi dữ liệu của `WorkoutChallengeController`, đồng thời bổ sung logic kiểm tra xem ID của thử thách có thực sự thuộc về người đang gọi API hay không để bảo mật.
