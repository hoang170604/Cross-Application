package com.crossapplication.main.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.dto.UserDTO;
import com.crossapplication.main.dto.UserProfileDTO;
import com.crossapplication.main.entity.NutritionGoal;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.UserProfile;
import com.crossapplication.main.service.interfaces.UserServiceInterface;
import com.crossapplication.main.util.JwtTokenProvider;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserServiceInterface userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email and password are required"));
        }
        try {
            User user = userService.register(email, password);
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(Map.of(
                "token", token,
                "userId", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "expiresIn", 86400
            ), "Registration successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "REGISTRATION_FAILED"));
        }
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email and password are required"));
        }
        try {
            User user = userService.loginAndGetUser(email, password);
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(ApiResponse.success(Map.of(
                "token", token,
                "userId", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "expiresIn", 86400
            ), "Login successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(e.getMessage(), "LOGIN_FAILED"));
        }
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Long id) {
        Optional<UserDTO> userOpt = userService.getById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found", "USER_NOT_FOUND"));
        }
        return ResponseEntity.ok(ApiResponse.success(userOpt.get()));
    }

    // GET /api/users/admin/all (ADMIN: Get all users for management)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        try {
            java.util.List<UserDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success(users, "Retrieved " + users.size() + " users"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), "USERS_FETCH_FAILED"));
        }
    }

    // PUT /api/users/{id}/password
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public ResponseEntity<ApiResponse<?>> changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("New password is required"));
        }
        try {
            userService.changePassword(id, newPassword);
            return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "PASSWORD_CHANGE_FAILED"));
        }
    }

    // PUT /api/users/{id}/profile
    @PutMapping("/{id}/profile")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public ResponseEntity<ApiResponse<?>> updateProfileAndCalculateGoal(@PathVariable Long id,
            @RequestBody UserProfileDTO profileDTO) {
        try {
            UserProfile profile = new UserProfile();
            profile.setAge(profileDTO.getAge());
            profile.setGender(profileDTO.getGender());
            profile.setHeight(profileDTO.getHeight());
            profile.setWeight(profileDTO.getWeight());
            profile.setActivityLevel(profileDTO.getActivityLevel());
            profile.setGoal(profileDTO.getGoal());
            profile.setName(profileDTO.getName());
            profile.setFastingGoal(profileDTO.getFastingGoal());

            NutritionGoal goal = userService.updateProfileAndCalculateGoal(id, profile);
            return ResponseEntity.ok(ApiResponse.success(goal, "Profile updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "PROFILE_UPDATE_FAILED"));
        }
    }

    // POST /api/users/password-reset
    @PostMapping("/password-reset")
    public ResponseEntity<ApiResponse<?>> requestPasswordReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        try {
            userService.requestPasswordReset(email);
            return ResponseEntity.ok(ApiResponse.success(null, "Password reset email sent"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "PASSWORD_RESET_FAILED"));
        }
    }

    // POST /api/users/verify-email
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<?>> verifyEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Token is required"));
        }
        try {
            userService.verifyEmail(token);
            return ResponseEntity.ok(ApiResponse.success(null, "Email verified successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "EMAIL_VERIFICATION_FAILED"));
        }
    }
}
