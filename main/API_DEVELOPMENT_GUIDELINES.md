# API Development Guidelines - CrossApplication

## Mục đích
Tài liệu này định nghĩa các tiêu chuẩn API mà tất cả developers phải tuân theo khi phát triển các endpoint mới hoặc cập nhật endpoints hiện có.

---

## 1. Response Wrapper - ApiResponse<T>

### Quy tắc bắt buộc
**Tất cả API responses phải bao bọc bằng `ApiResponse<T>`**

### Cấu trúc
```java
{
  "success": boolean,      // true nếu thành công, false nếu lỗi
  "message": String,       // Mô tả (có thể để null)
  "data": T,              // Dữ liệu trả về (có thể để null)
  "errorCode": String     // Mã lỗi (chỉ khi success=false)
}
```

### Factory Methods
```java
// Success responses
ApiResponse.success(data)                    // data, message = "Success"
ApiResponse.success(data, "Custom message")  // data với custom message

// Error responses
ApiResponse.error("Mô tả lỗi")              // Không có error code
ApiResponse.error("Mô tả", "ERROR_CODE")    // Có error code
```

### Ví dụ
```java
// Thành công
return ResponseEntity.ok(ApiResponse.success(userData, "User retrieved successfully"));

// Lỗi validation
return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));

// Lỗi nghiêm trọng
return ResponseEntity.badRequest().body(ApiResponse.error("Email already exists", "EMAIL_EXISTS"));

// Không tìm thấy resource
return ResponseEntity.status(HttpStatus.NOT_FOUND)
    .body(ApiResponse.error("User not found", "USER_NOT_FOUND"));
```

---

## 2. HTTP Status Codes - Bắt buộc

| Scenario | Status | Code | Ví dụ |
|----------|--------|------|------|
| Create thành công | 201 | CREATED | `ResponseEntity.status(HttpStatus.CREATED)` |
| Read thành công | 200 | OK | `ResponseEntity.ok()` |
| Update thành công | 200 | OK | `ResponseEntity.ok()` |
| Delete thành công | 204 | NO_CONTENT | `ResponseEntity.noContent().build()` |
| Validation failed | 400 | BAD_REQUEST | `ResponseEntity.badRequest()` |
| Authentication failed | 401 | UNAUTHORIZED | `ResponseEntity.status(HttpStatus.UNAUTHORIZED)` |
| Resource not found | 404 | NOT_FOUND | `ResponseEntity.status(HttpStatus.NOT_FOUND)` |
| Server error | 500 | INTERNAL_SERVER_ERROR | `ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)` |

### Không được dùng
❌ `ResponseEntity.ok()` cho DELETE  
❌ `ResponseEntity.ok()` cho create  
❌ `ResponseEntity.badRequest()` cho kiểm tra không tìm thấy

---

## 3. Controller Method Template

### CRUD Operations Template
```java
@RestController
@RequestMapping("/api/resource-name")  // Kebab-case, plural
public class ResourceController {

    @PostMapping
    public ResponseEntity<ApiResponse<?>> create(@RequestBody ResourceDTO dto) {
        try {
            Resource created = service.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Resource created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage(), "CREATE_FAILED"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> get(@PathVariable Long id) {
        try {
            Optional<Resource> opt = service.getById(id);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Resource not found", "RESOURCE_NOT_FOUND"));
            }
            return ResponseEntity.ok(ApiResponse.success(opt.get()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage(), "GET_FAILED"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> update(@PathVariable Long id, @RequestBody ResourceDTO dto) {
        try {
            Resource updated = service.update(id, dto);
            return ResponseEntity.ok(ApiResponse.success(updated, "Resource updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage(), "UPDATE_FAILED"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage(), "DELETE_FAILED"));
        }
    }
}
```

---

## 4. Naming Conventions

### URL Paths
- ✅ **Kebab-case cho resource names**: `/api/workout-challenges`, `/api/meal-logs`
- ✅ **Plural nouns**: `/api/users`, `/api/activities`
- ❌ **Không dùng camelCase**: `/api/workoutChallenges`
- ❌ **Không dùng singular**: `/api/user`

### Methods
- ✅ Descriptive name: `listByUser`, `findByUserId`
- ❌ Generic: `get`, `fetch`

### Path Parameters
- ✅ **Kebab-case cho sub-resources**: `/meal-logs/{id}`, `/fasting-sessions`
- ✅ **Logical order**: `/users/{userId}/meals/{mealType}`

---

## 5. Error Code Naming Convention

Format: `ACTION_RESOURCE_ERROR_TYPE`

### Pattern
```
[ACTION]_[RESOURCE]_[ERROR_TYPE]
   |         |          |
   |         |          +-- (Optional) Lý do
   |         +-- Tên entity
   +-- Hành động được thực hiện
```

### Ví dụ
| Error Code | Meaning |
|-----------|---------|
| `CREATE_FAILED` | Thêm resource thất bại |
| `USER_NOT_FOUND` | Không tìm thấy user |
| `MEAL_LOG_UPDATE_FAILED` | Cập nhật meal log thất bại |
| `ACTIVITY_ADD_FAILED` | Thêm activity thất bại |
| `FASTING_START_FAILED` | Bắt đầu fasting thất bại |
| `INVALID_INPUT` | Input không hợp lệ |
| `DUPLICATE_EMAIL` | Email đã tồn tại |

### Định nghĩa Error Codes trong Code
```java
public class ErrorCodes {
    // User errors
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    public static final String REGISTRATION_FAILED = "REGISTRATION_FAILED";
    public static final String LOGIN_FAILED = "LOGIN_FAILED";
    
    // Activity errors
    public static final String ACTIVITY_ADD_FAILED = "ACTIVITY_ADD_FAILED";
    public static final String ACTIVITY_UPDATE_FAILED = "ACTIVITY_UPDATE_FAILED";
    
    // Generic errors
    public static final String INVALID_INPUT = "INVALID_INPUT";
    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";
}
```

---

## 6. Request Body - DTOs

### Quy tắc
- ✅ **Luôn dùng DTO** cho request bodies
- ❌ **Không dùng raw entities** như `@RequestBody User user`
- ❌ **Không dùng `Map<String, Object>`** cho complex operations

### DTO Template
```java
public class ResourceDTO {
    
    private Long id;           // Có thể null khi create
    private String name;
    private String description;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;
    
    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    // ... các getter/setter khác
}
```

### Validate Input
```java
@PostMapping
public ResponseEntity<ApiResponse<?>> create(@RequestBody ResourceDTO dto) {
    // Validation
    if (dto.getName() == null || dto.getName().isEmpty()) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Name is required"));
    }
    
    if (dto.getName().length() > 255) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Name must be less than 255 characters"));
    }
    
    try {
        // Business logic
    } catch (Exception e) {
        // Error handling
    }
}
```

---

## 7. Exception Handling Pattern

### Bắt buộc pattern
```java
try {
    // Business logic
    return ResponseEntity.status(SUCCESS_STATUS)
        .body(ApiResponse.success(result, "Success message"));
} catch (IllegalArgumentException e) {
    // Business validation errors
    return ResponseEntity.badRequest()
        .body(ApiResponse.error(e.getMessage(), "SPECIFIC_ERROR_CODE"));
} catch (Exception e) {
    // Unexpected errors
    logger.error("Unexpected error", e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.error("Internal server error", "INTERNAL_ERROR"));
}
```

### Không được
❌ Não trả về exception object  
❌ Raw error messages không có format  
❌ Không log errors  

---

## 8. List Endpoints

### Best Practice
```java
@GetMapping
public ResponseEntity<ApiResponse<?>> listAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(required = false) String sortBy) {
    try {
        List<Resource> resources = service.listAll(page, size, sortBy);
        return ResponseEntity.ok(ApiResponse.success(resources));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage(), "LIST_FAILED"));
    }
}

@GetMapping("/user/{userId}")
public ResponseEntity<ApiResponse<?>> listByUser(@PathVariable Long userId) {
    try {
        List<Resource> resources = service.listByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(resources));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage(), "LIST_FAILED"));
    }
}
```

---

## 9. Validation Best Practices

### Input Validation
```java
@PostMapping
public ResponseEntity<ApiResponse<?>> create(@RequestBody ResourceDTO dto) {
    // 1. Null checks
    if (dto.getName() == null) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Name is required"));
    }
    
    // 2. Format validation
    if (!isValidEmail(dto.getEmail())) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Invalid email format"));
    }
    
    // 3. Business rule validation
    if (service.exists(dto.getName())) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Name already exists", "DUPLICATE_NAME"));
    }
    
    try {
        // ... create resource
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage(), "CREATE_FAILED"));
    }
}
```

---

## 10. Logging Convention

### Khuyến khích
```java
private static final Logger logger = LoggerFactory.getLogger(ResourceController.class);

@PostMapping
public ResponseEntity<ApiResponse<?>> create(@RequestBody ResourceDTO dto) {
    logger.info("Creating new resource: {}", dto.getName());
    
    try {
        Resource created = service.create(dto);
        logger.info("Resource created successfully with id: {}", created.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(created, "Resource created successfully"));
    } catch (Exception e) {
        logger.error("Error creating resource", e);
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage(), "CREATE_FAILED"));
    }
}
```

---

## 11. Query Parameters Convention

### Phổ biến
- `page` - Số trang (0-indexed)
- `size` - Kích thước trang
- `sortBy` - Field để sort
- `order` - ASC hoặc DESC
- `filter` - Filter conditions
- `date` - Ngày cụ thể (format: YYYY-MM-DD)

### Ví dụ
```
GET /api/activities?page=0&size=20&sortBy=startTime&order=DESC
GET /api/diaries/users/1/meals/BREAKFAST?date=2024-01-01
GET /api/fasting-sessions?filter=completed
```

---

## 12. API Response Examples

### Success - Create (201)
```json
{
  "success": true,
  "message": "Activity created successfully",
  "data": {
    "id": 123,
    "activityType": "RUNNING",
    "durationMinutes": 30
  }
}
```

### Success - Read (200)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 123,
    "userId": 1,
    "email": "user@example.com"
  }
}
```

### Success - List (200)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { "id": 1, "name": "Challenge 1" },
    { "id": 2, "name": "Challenge 2" }
  ]
}
```

### Success - Delete (204)
```
(No body)
HTTP/1.1 204 No Content
```

### Error - Validation (400)
```json
{
  "success": false,
  "message": "Email is required",
  "errorCode": "INVALID_INPUT"
}
```

### Error - Not Found (404)
```json
{
  "success": false,
  "message": "User not found",
  "errorCode": "USER_NOT_FOUND"
}
```

---

## 13. Checklist - Trước khi commit

- [ ] Tất cả endpoints trả về `ApiResponse<T>`
- [ ] Sử dụng HTTP status codes chính xác (201 for POST, 204 for DELETE, etc.)
- [ ] Có error code cho tất cả error cases
- [ ] Paths dùng kebab-case và plural
- [ ] DTOs được sử dụng cho request bodies
- [ ] Try-catch blocks được implement
- [ ] Logs được thêm vào
- [ ] Request/Response được validate
- [ ] Tên methods descriptive
- [ ] Comments được thêm nếu logic phức tạp

---

## 14. Common Mistakes - Tránh

### ❌ Sai
```java
@PutMapping("/{id}")
public ResponseEntity<Activity> update(@PathVariable Long id, @RequestBody Activity activity) {
    return ResponseEntity.ok(service.update(id, activity));
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.ok().build();  // SEVER! Should be noContent()
}

@GetMapping
public List<Resource> listAll() {  // Should wrap in ResponseEntity<ApiResponse<>>
    return service.listAll();
}
```

### ✅ Đúng
```java
@PutMapping("/{id}")
public ResponseEntity<ApiResponse<?>> update(@PathVariable Long id, @RequestBody ActivityDTO dto) {
    try {
        Activity updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Activity updated successfully"));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage(), "UPDATE_FAILED"));
    }
}

@DeleteMapping("/{id}")
public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long id) {
    try {
        service.delete(id);
        return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage(), "DELETE_FAILED"));
    }
}

@GetMapping
public ResponseEntity<ApiResponse<?>> listAll() {
    try {
        List<Resource> resources = service.listAll();
        return ResponseEntity.ok(ApiResponse.success(resources));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage(), "LIST_FAILED"));
    }
}
```

---

## Tham khảo

- API Specification: `API_SPECIFICATION.md`
- API Standardization Report: `API_STANDARDIZATION_REPORT.md`
- Current API Base URL: `http://localhost:8080/api`

---

**Last Updated:** April 23, 2026  
**Version:** 1.0

