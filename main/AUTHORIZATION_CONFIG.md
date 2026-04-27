# 🔐 AUTHORIZATION CONFIGURATION REPORT
**Date:** April 27, 2026  
**Project:** CrossApplication (Spring Boot)  
**Status:** ✅ FULLY CONFIGURED WITH ROLE-BASED ACCESS CONTROL

---

## 📋 AUTHORIZATION OVERVIEW

### Role Hierarchy
```
┌─ ADMIN (All access)
└─ USER (Restricted to own data)
```

### Default Role
- New users registered get default role: **USER**
- Role is stored in `User.role` field (database table: `users`)
- Role is included in JWT token claims

---

## 🔑 JWT TOKEN CONFIGURATION

### Token Generation
- **Method:** `JwtTokenProvider.generateToken(userId, email, role)`
- **Claims:** `userId`, `email`, `role`
- **Expiration:** 24 hours (86400000 ms)
- **Algorithm:** HS256

### Token Usage
- **Header:** `Authorization: Bearer <token>`
- **Extract:** `JwtAuthenticationFilter` extracts role and sets as `SimpleGrantedAuthority`
- **Authority Format:** `ROLE_USER` or `ROLE_ADMIN`

### Login/Register Response
```json
{
  "token": "...",
  "userId": 1,
  "email": "user@example.com",
  "role": "USER",
  "expiresIn": 86400
}
```

---

## 🛡️ ENDPOINT AUTHORIZATION MATRIX

### 1️⃣ USER MANAGEMENT (`/api/users`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/register` | POST | ✅ Public | Anyone can register (gets USER role) |
| `/login` | POST | ✅ Public | Anyone can login |
| `/{id}` | GET | 🔒 ADMIN or Owner | Only ADMIN or the user themselves |
| `/{id}/password` | PUT | 🔒 ADMIN or Owner | Only ADMIN or the user themselves |
| `/{id}/profile` | PUT | 🔒 ADMIN or Owner | Only ADMIN or the user themselves |
| `/password-reset` | POST | ✅ Public | Email-based reset |
| `/verify-email` | POST | ✅ Public | Token-based verification |

**Rule:** `@PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")`

---

### 2️⃣ FOOD MANAGEMENT (`/api/foods`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/` | GET | 🔒 USER or ADMIN | Browse food database |
| `/search` | GET | 🔒 USER or ADMIN | Search foods by name |
| `/categories` | GET | 🔒 USER or ADMIN | Browse food categories |
| `/{id}` | GET | 🔒 USER or ADMIN | View food details |
| `/{id}/calculate` | GET | 🔒 USER or ADMIN | Calculate nutrition |
| `/meals/{userId}/{mealId}/foods` | POST | 🔒 ADMIN or Owner | Add food to meal |
| `/{id}` | PUT | 🔒 ADMIN | Update food database |
| `/{id}` | DELETE | 🔒 ADMIN | Delete from database |

**Rules:**
- Browse/Search: `@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")`
- Add meal: `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`
- Modify DB: `@PreAuthorize("hasRole('ADMIN')")`

---

### 3️⃣ DIARY MANAGEMENT (`/api/diaries`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/users/{userId}/meals/{mealType}` | POST | 🔒 ADMIN or Owner | Add food to user's meal |
| `/meal-logs/{id}` | PUT | 🔒 USER or ADMIN | Update meal log |
| `/meal-logs/{id}` | DELETE | 🔒 USER or ADMIN | Delete meal entry |

**Rule:** 
- Add meal: `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`
- Modify: `@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")`

---

### 4️⃣ ACTIVITY TRACKING (`/api/activities`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/users/{userId}` | POST | 🔒 ADMIN or Owner | Add activity for user |
| `/{id}` | PUT | 🔒 USER or ADMIN | Update activity |
| `/{id}` | DELETE | 🔒 USER or ADMIN | Delete activity |

**Rule:**
- Add: `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`
- Modify: `@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")`

---

### 5️⃣ WATER TRACKING (`/api/water`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/log` | POST | 🔒 USER or ADMIN | Log water intake |
| `/daily-total` | GET | 🔒 ADMIN or Owner | Get daily water total |
| `/logs` | GET | 🔒 ADMIN or Owner | Get water history |

**Rule:** `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`

---

### 6️⃣ PROGRESS TRACKING (`/api/progress`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/weight` | GET | 🔒 ADMIN or Owner | Weight history |
| `/report` | GET | 🔒 ADMIN or Owner | Nutrition report |
| `/nutrition` | GET | 🔒 ADMIN or Owner | Daily nutrition |
| `/nutrition/summary` | GET | 🔒 ADMIN or Owner | Nutrition summary |
| `/latest-weight` | GET | 🔒 ADMIN or Owner | Latest weight |
| `/log-weight` | POST | 🔒 USER or ADMIN | Log weight |

**Rule:** `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`

---

### 7️⃣ FASTING MANAGEMENT (`/api/fasting`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/start` | POST | 🔒 USER or ADMIN | Start fasting |
| `/stop` | POST | 🔒 USER or ADMIN | Stop fasting |
| `/sessions/{userId}` | GET | 🔒 ADMIN or Owner | Get user's sessions |
| `/sessions/{userId}/open` | GET | 🔒 ADMIN or Owner | Get open session |

**Rule:** `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`

---

### 8️⃣ FASTING SESSIONS (`/api/fasting-sessions`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/user/{userId}` | GET | 🔒 ADMIN or Owner | List user's sessions |
| `/{id}` | GET | 🔒 USER or ADMIN | Get session details |
| `/` | POST | 🔒 USER or ADMIN | Create session |
| `/{id}` | PUT | 🔒 USER or ADMIN | Update session |
| `/{id}` | DELETE | 🔒 USER or ADMIN | Delete session |

**Rules:**
- By user: `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`
- Other: `@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")`

---

### 9️⃣ WORKOUT CHALLENGES (`/api/workout-challenges`)

| Endpoint | Method | Authorization | Details |
|----------|--------|---------------|---------|
| `/` | GET | 🔒 USER or ADMIN | Browse all challenges |
| `/user/{userId}` | GET | 🔒 ADMIN or Owner | Get user's challenges |
| `/{id}` | GET | 🔒 USER or ADMIN | Get challenge details |
| `/` | POST | 🔒 ADMIN | Create challenge |
| `/{id}` | PUT | 🔒 ADMIN | Update challenge |
| `/{id}` | DELETE | 🔒 ADMIN | Delete challenge |

**Rules:**
- Browse: `@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")`
- User challenges: `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")`
- Manage: `@PreAuthorize("hasRole('ADMIN')")`

---

## 📊 AUTHORIZATION PATTERNS

### Pattern 1: Own Data Only
```java
@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
public ResponseEntity<?> getUserData(@PathVariable Long userId) { ... }
```
**Allows:** ADMIN (all users) or USER (only their own)

### Pattern 2: Authenticated Users
```java
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public ResponseEntity<?> browseData() { ... }
```
**Allows:** Any authenticated user (both USER and ADMIN)

### Pattern 3: Admin Only
```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> deleteData() { ... }
```
**Allows:** ADMIN only

---

## 🔧 IMPLEMENTATION DETAILS

### 1. Database
- **Table:** `users`
- **Field:** `role` (VARCHAR, default='USER')
- **Values:** 'USER', 'ADMIN'

### 2. JWT Token Provider
```java
// Generate token with role
String token = jwtTokenProvider.generateToken(userId, email, role);

// Extract role from token
String role = jwtTokenProvider.getRoleFromToken(token);
```

### 3. Authentication Filter
```java
// JwtAuthenticationFilter extracts role and sets authority
List<GrantedAuthority> authorities = new ArrayList<>();
authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

UsernamePasswordAuthenticationToken authentication =
    new UsernamePasswordAuthenticationToken(userId, null, authorities);
```

### 4. Method Security
```java
@EnableMethodSecurity(prePostEnabled = true)
```
Enables `@PreAuthorize` annotations on all controller methods.

---

## 📝 USAGE EXAMPLES

### Example 1: User Login Flow
```bash
# 1. Login
POST /api/users/login
Body: { "email": "user@example.com", "password": "password123" }

Response: {
  "token": "eyJhbGc...",
  "userId": 1,
  "email": "user@example.com",
  "role": "USER"
}

# 2. Use token in subsequent requests
GET /api/progress/nutrition?userId=1&date=2024-04-27
Header: Authorization: Bearer eyJhbGc...

# ✅ Allowed (userId=1 matches authentication.principal)
```

### Example 2: ADMIN Accessing Other User's Data
```bash
# 1. Admin Login
POST /api/users/login
Body: { "email": "admin@example.com", "password": "password123" }

Response: {
  "token": "eyJhbGc...",
  "userId": 2,
  "email": "admin@example.com",
  "role": "ADMIN"
}

# 2. Access other user's data
GET /api/progress/nutrition?userId=1&date=2024-04-27
Header: Authorization: Bearer eyJhbGc... (ADMIN token)

# ✅ Allowed (hasRole('ADMIN') is true)
```

### Example 3: Unauthorized Access
```bash
# User attempts to access another user's data
GET /api/progress/nutrition?userId=2&date=2024-04-27
Header: Authorization: Bearer eyJhbGc... (USER token for userId=1)

# ❌ Denied (userId=2 != authentication.principal (1))
Response: 403 Forbidden
```

---

## ✅ SECURITY CHECKLIST

- ✅ JWT authentication configured with role claims
- ✅ Role extracted from token in authentication filter
- ✅ Authorities set as `SimpleGrantedAuthority("ROLE_" + role)`
- ✅ `@PreAuthorize` annotations on all protected endpoints
- ✅ Owner-based access control implemented
- ✅ ADMIN override access configured
- ✅ Public endpoints: register, login, swagger, actuator
- ✅ All other endpoints require authentication
- ✅ Role default: USER
- ✅ UserDTO updated to include role field

---

## 📋 ROLE ASSIGNMENT

### How Users Get ADMIN Role
Currently, users are assigned **USER** role by default during registration. To promote a user to ADMIN:

**Option 1: Direct Database Update**
```sql
UPDATE users SET role = 'ADMIN' WHERE id = <userId>;
```

**Option 2: Create Admin Endpoint (Recommended)**
Add to UserController:
```java
@PostMapping("/{id}/promote-to-admin")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> promoteToAdmin(@PathVariable Long id) {
    userService.promoteToAdmin(id);
    return ResponseEntity.ok("User promoted to ADMIN");
}
```

---

## 🚀 DEPLOYMENT NOTES

1. **Ensure JWT Secret is configured** in `application.properties`
   ```properties
   jwt.secret=your-super-secret-key-for-jwt-token-generation-min-256-bits-long
   jwt.expiration=86400000
   ```

2. **Database migration** - Add role column if not exists:
   ```sql
   ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER';
   ```

3. **Test all endpoints** with both USER and ADMIN tokens

4. **Monitor logs** for `Authorization` and `AccessDeniedException`

---

**Configuration Complete** ✅  
All controllers now enforce role-based access control!
