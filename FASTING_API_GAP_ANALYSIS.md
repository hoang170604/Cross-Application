# Fasting API — Phân tích API Còn Thiếu (Gap Analysis)

> Đối chiếu giữa **frontend đang gọi** (`fastingService.ts`, `useFasting.ts`)  
> và **backend đang cung cấp** (`FastingController.java`, `FastingSessionController.java`)  
> — 2026-05-10

---

## Tóm tắt nhanh

| Loại vấn đề | Số lượng |
|---|---|
| 🔴 **Endpoint thiếu hoàn toàn** | 3 |
| 🟠 **Endpoint tồn tại nhưng bị gọi sai URL/method** | 2 |
| 🟡 **Trường dữ liệu thiếu trong entity/DTO** | 4 |
| 🟢 **Đã khớp đúng** | 4 |

---

## 🔴 Endpoint Thiếu Hoàn Toàn (Backend chưa có)

### 1. `POST /api/fasting/save-record`

**Frontend gọi (useFasting.ts:255):**
```typescript
await apiClient.post('/api/fasting/save-record', record);
```

**Payload gửi lên:**
```json
{
  "userId": 7,
  "startTime": "2026-05-09T22:00:00.000Z",
  "endTime": "2026-05-10T14:35:00.000Z",
  "totalDurationMinutes": 965,
  "targetDurationHours": 16
}
```

**Backend:** ❌ Không có `@PostMapping("/save-record")` trong bất kỳ controller nào.

**Hậu quả:** Khi người dùng kết thúc nhịn ăn, lệnh API này **luôn thất bại (404)**. Phiên vẫn reset ở local nhưng dữ liệu không được lưu lên server. Đây là bug nghiêm trọng nhất.

**Giải pháp đề xuất:** Thêm endpoint vào `FastingController`:
```java
@PostMapping("/save-record")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public ResponseEntity<ApiResponse<?>> saveRecord(@RequestBody FastingRecordDTO dto) {
    // Tương tự stopFasting nhưng nhận đầy đủ payload từ client
}
```

---

### 2. `GET /api/fasting/users/{userId}/history`

**Frontend gọi (useFasting.ts:169):**
```typescript
const res = await apiClient.get<FastingHistoryRecord[]>(
  `/api/fasting/users/${userId}/history?limit=5`
);
```

**Backend:** ❌ Không có `@GetMapping("/users/{userId}/history")` trong `FastingController`.  
Endpoint gần nhất là `/api/fasting/sessions/{userId}` nhưng **khác URL** và **không hỗ trợ `?limit`**.

**Hậu quả:** Mỗi lần app khởi động hoặc kết thúc fast, `fetchHistory()` gọi URL này và nhận **404**. Lịch sử nhịn ăn không bao giờ hiển thị trên UI.

**Giải pháp đề xuất:** Thêm vào `FastingController`:
```java
@GetMapping("/users/{userId}/history")
@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
public ResponseEntity<ApiResponse<?>> history(
    @PathVariable Long userId,
    @RequestParam(defaultValue = "20") int limit,
    @RequestParam(required = false) String from,
    @RequestParam(required = false) String to
) { ... }
```

---

### 3. `GET /api/fasting/state/{userId}` *(thiếu về mặt thiết kế)*

**FastingStateService** có method `getByUserId(Long userId)` nhưng **không có endpoint HTTP** nào expose nó.

```java
// Có trong service:
Optional<FastingStateDTO> getByUserId(Long userId);
// Nhưng FastingController không có @GetMapping cho method này
```

**Hậu quả:** Frontend không thể kiểm tra trạng thái `isFasting` hiện tại khi app restart mà không phải gọi `/open` (vốn chỉ trả về session object, không trả về `fastingGoalHours` trong `FastingState`).

---

## 🟠 Endpoint Tồn Tại Nhưng Bị Gọi Sai URL

### 4. Sai URL: History endpoint

| | Frontend (`fastingService.ts:25`) | Backend (`FastingController.java:60`) |
|---|---|---|
| **URL** | `GET /api/fasting/sessions/{userId}` | `GET /api/fasting/sessions/{userId}` ✅ |
| **Trả về** | `FastingSession[]` | `List<FastingSession>` ✅ |
| **Pagination** | Không gửi params | Không hỗ trợ params |

> URL này **khớp**, nhưng không hỗ trợ `?limit`, `?from`, `?to`. Cần nâng cấp service layer để hỗ trợ phân trang.

---

### 5. Conflict guard không trả đúng HTTP Status

**Backend (FastingStateServiceImpl.java:68):**
```java
if (openOpt.isPresent()) {
    throw new IllegalArgumentException("An open fasting session already exists for user");
}
```
→ Controller bắt exception này và trả về **`400 Bad Request`**.

**Vấn đề:** Theo chuẩn RESTful, khi tài nguyên đã tồn tại (conflict) nên trả **`409 Conflict`**, không phải `400`.  
Frontend hiện không phân biệt được đây là lỗi "đang có phiên active" hay lỗi validation — gây khó khăn cho error handling phía client.

---

## 🟡 Trường Dữ Liệu Thiếu Trong Entity/DTO

### 6. `FastingSession` thiếu trường `planType` và `goalHours`

Frontend gửi/nhận `planType` (e.g. `"16:8"`) và `targetDurationHours` trong `FastingRecord`:
```typescript
export interface FastingRecord {
  userId: number;
  startTime: string;
  endTime: string;
  totalDurationMinutes: number;
  targetDurationHours: number;  // ← Backend không lưu trường này
}
```

**Backend `FastingSession` entity** (FastingSession.java) chỉ có:
- `id`, `user`, `startTime`, `endTime`, `durationMinutes`, `isCompleted`

❌ **Thiếu:** `planType` (VARCHAR), `goalHours` / `targetDurationHours` (INT)

**Migration SQL cần thêm:**
```sql
ALTER TABLE fasting_session
  ADD COLUMN plan_type     VARCHAR(20) NULL,
  ADD COLUMN goal_hours    INTEGER     NULL;
```

---

### 7. `FastingSession` thiếu trường `status` (enum)

Frontend `FastingHistoryRecord` kỳ vọng trường `planName`:
```typescript
export interface FastingHistoryRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalDurationHours: number;
  planName: string;       // ← Backend không trả trường này
}
```

Backend chỉ trả `isCompleted: Boolean`. Không có `status` enum (`Active/Completed/Cancelled`) và không tính `totalDurationHours`.

---

### 8. `FastingSessionDTO` thiếu computed fields

Các trường sau **frontend kỳ vọng** trong response nhưng backend không tính/trả:

| Trường | Kỳ vọng (Frontend) | Thực tế (Backend DTO) |
|---|---|---|
| `planName` | `"16:8"` | ❌ không có |
| `totalDurationHours` | `16.08` | ❌ không có (chỉ có `durationMinutes`) |
| `date` | `"2026-05-09"` | ❌ không có (phải parse từ `startTime`) |
| `status` | `"Completed"` | ❌ không có (chỉ có `isCompleted: Boolean`) |

---

## 🟢 Đã Khớp Đúng (Hoạt động bình thường)

| Method | URL | Frontend | Backend | Trạng thái |
|---|---|---|---|---|
| `POST` | `/api/fasting/start` | `fastingService.ts:13` | `FastingController.start()` | ✅ Khớp |
| `POST` | `/api/fasting/stop` | `fastingService.ts:19` | `FastingController.stop()` | ✅ Khớp |
| `GET` | `/api/fasting/sessions/{userId}` | `fastingService.ts:25` | `FastingController.sessions()` | ✅ Khớp (thiếu pagination) |
| `GET` | `/api/fasting/sessions/{userId}/open` | `fastingService.ts:31` | `FastingController.openSession()` | ✅ Khớp |

---

## Roadmap sửa lỗi theo độ ưu tiên

```
🔴 P0 — Khẩn cấp (gây mất dữ liệu)
├── Implement POST /api/fasting/save-record
└── Implement GET  /api/fasting/users/{userId}/history?limit=N

🟠 P1 — Quan trọng (tính năng bị hỏng)
├── Thêm planType, goalHours vào FastingSession entity + migration
├── Thêm computed fields vào FastingSessionDTO (planName, totalDurationHours, date, status)
└── Đổi 409 Conflict thay vì 400 cho duplicate active session

🟡 P2 — Nâng cấp (UX bị thiếu)
├── Thêm pagination (page, limit) cho /api/fasting/sessions/{userId}
├── Thêm date filtering (from, to) cho history endpoint
└── Expose GET /api/fasting/state/{userId} để resume session khi app restart
```
