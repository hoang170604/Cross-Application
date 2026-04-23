# Quick Reference - API Standards

## Standard Response Format
```java
ResponseEntity<ApiResponse<?>>
  ├── success: boolean
  ├── message: String
  ├── data: T
  └── errorCode: String
```

## HTTP Status Codes
| Operation | Code | Usage |
|-----------|------|-------|
| Create    | 201  | `ResponseEntity.status(HttpStatus.CREATED)` |
| Read      | 200  | `ResponseEntity.ok()` |
| Update    | 200  | `ResponseEntity.ok()` |
| Delete    | 204  | `ResponseEntity.noContent().build()` |
| Error     | 400  | `ResponseEntity.badRequest()` |
| Not Found | 404  | `ResponseEntity.status(HttpStatus.NOT_FOUND)` |

## Success Response
```java
return ResponseEntity.ok(
    ApiResponse.success(data, "Success message")
);
```

## Error Response
```java
return ResponseEntity.badRequest().body(
    ApiResponse.error("Error message", "ERROR_CODE")
);
```

## Standard Try-Catch Pattern
```java
try {
    // Logic here
    return ResponseEntity.ok(ApiResponse.success(result, "Message"));
} catch (IllegalArgumentException e) {
    return ResponseEntity.badRequest()
        .body(ApiResponse.error(e.getMessage(), "ERROR_CODE"));
}
```

## Path Naming
✅ `/api/resources` (plural, kebab-case)  
✅ `/api/resource-type` (kebab-case)  
❌ `/api/resource` (singular)  
❌ `/api/resourceType` (camelCase)

## Error Code Format
`ACTION_RESOURCE_TYPE` (e.g., `USER_NOT_FOUND`, `CREATE_FAILED`)

## CRUD Template
```java
@RestController
@RequestMapping("/api/resource-name")
public class ResourceController {
    @PostMapping
    public ResponseEntity<ApiResponse<?>> create(@RequestBody ResourceDTO dto)
    { /* 201 CREATED */ }
    
    @GetMapping("/{id}")  
    public ResponseEntity<ApiResponse<?>> get(@PathVariable Long id)
    { /* 200 OK or 404 */ }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> update(@PathVariable Long id, @RequestBody ResourceDTO dto) 
    { /* 200 OK */ }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long id)
    { /* 204 NO_CONTENT */ }
}
```

## Files Reference
- Details: `API_SPECIFICATION.md`
- Guidelines: `API_DEVELOPMENT_GUIDELINES.md`
- Report: `API_STANDARDIZATION_REPORT.md`

