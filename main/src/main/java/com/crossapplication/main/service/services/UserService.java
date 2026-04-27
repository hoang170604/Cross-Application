package com.crossapplication.main.service.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.dto.UserDTO;
import com.crossapplication.main.entity.NutritionGoal;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.UserProfile;
import com.crossapplication.main.repository.interfaces.NutritionGoalRepository;
import com.crossapplication.main.repository.interfaces.UserProfileRepository;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.UserServiceInterface;
import com.crossapplication.main.util.JwtTokenProvider;
import com.crossapplication.main.util.PasswordEncoder;

@Service
public class UserService implements UserServiceInterface {

    @Autowired
    private UserRepositoryInterface userRepo;

    @Autowired
    private NutritionGoalRepository goalRepo;

    @Autowired
    private UserProfileRepository profileRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public User register(String email, String password) {
        Optional<User> existing = userRepo.findByEmail(email);
        if (existing.isPresent()) throw new IllegalArgumentException("Email already registered");
        if (email == null || email.isBlank() || password == null || password.length() < 8) {
            throw new IllegalArgumentException("Email and password (min 8 chars) are required");
        }
        User u = new User();
        u.setEmail(email);
        u.setPassword(PasswordEncoder.encodePassword(password));
        u.setCreatedAt(LocalDate.now());
        userRepo.save(u);
        return u;
    }

    @Override
    public String login(String email, String password) {
        Optional<User> uopt = userRepo.findByEmail(email);
        if (uopt.isEmpty()) throw new IllegalArgumentException("Invalid credentials");
        User u = uopt.get();
        if (!PasswordEncoder.matches(password, u.getPassword())) throw new IllegalArgumentException("Invalid credentials");
        return jwtTokenProvider.generateToken(u.getId(), u.getEmail());
    }

    @Override
    public User loginAndGetUser(String email, String password) {
        Optional<User> uopt = userRepo.findByEmail(email);
        if (uopt.isEmpty()) throw new IllegalArgumentException("Invalid credentials");
        User u = uopt.get();
        if (!PasswordEncoder.matches(password, u.getPassword())) throw new IllegalArgumentException("Invalid credentials");
        return u;
    }
    
    // Generate token with role
    public String generateTokenWithRole(Long userId, String email, String role) {
        return jwtTokenProvider.generateToken(userId, email, role);
    }

    @Override
    public void changePassword(Long userId, String newPassword) {
        Optional<User> uopt = userRepo.findById(userId);
        if (uopt.isEmpty()) throw new IllegalArgumentException("User not found");
        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        User u = uopt.get();
        u.setPassword(PasswordEncoder.encodePassword(newPassword));
        userRepo.updateUser(u);
    }
        // cá nhân hóa, tính chỉ số cơ thể
    @Override
    public NutritionGoal updateProfileAndCalculateGoal(Long id, UserProfile profile) {
        Optional<User> uopt = userRepo.findById(id);
        if (uopt.isEmpty()) throw new IllegalArgumentException("User not found");
        User u = uopt.get();

        // Persist UserProfile
        profile.setUser(u);
        profileRepo.save(profile);

        // 1. Tính Tỷ lệ trao đổi chất cơ bản (BMR) theo phương trình Mifflin-St Jeor
        double bmr;
        double weight = profile.getWeight();
        double height = profile.getHeight();
        int age = profile.getAge();
        String gender = profile.getGender();
        
        if ("male".equalsIgnoreCase(gender)) {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        
        // 2. Tính Tổng năng lượng tiêu hao hàng ngày (TDEE) dựa trên Hệ số vận động (Activity Multiplier)
        // Hệ số lấy từ activity_level của người dùng (1.2, 1.375, 1.55, 1.725, 1.9)
        double activityMultiplier = profile.getActivityLevel() > 0 ? profile.getActivityLevel() : 1.2;
        double tdee = bmr * activityMultiplier;
        
        // 3. Tính toán Năng lượng mục tiêu (Target Calories) dựa trên mục tiêu (Goal)
        double targetCalories = tdee;
        String goal = profile.getGoal() != null ? profile.getGoal().toLowerCase() : "maintain";
        
        double proteinRatio = 0.30;
        double carbRatio = 0.40;
        double fatRatio = 0.30;

        if ("lose_weight".equals(goal)) {
            targetCalories = tdee - 500;
            proteinRatio = 0.40;
            carbRatio = 0.30;
            fatRatio = 0.30;
        } else if ("build_muscle".equals(goal)) {
            targetCalories = tdee + 500;
            proteinRatio = 0.30;
            carbRatio = 0.50;
            fatRatio = 0.20;
        }

        double proteinCalories = targetCalories * proteinRatio;
        double carbCalories = targetCalories * carbRatio;
        double fatCalories = targetCalories * fatRatio;

        // 4. Khởi tạo và lưu mục tiêu dinh dưỡng (ngưỡng Grams)
        NutritionGoal ng = new NutritionGoal();
        ng.setUser(u);
        ng.setTargetCalories(Math.round(targetCalories));
        ng.setTargetProtein(Math.round(proteinCalories / 4.0));
        ng.setTargetCarb(Math.round(carbCalories / 4.0));
        ng.setTargetFat(Math.round(fatCalories / 9.0));
        return goalRepo.save(ng);
    }

    @Override
    public Optional<NutritionGoal> getLatestGoal(Long userId) {
        return goalRepo.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Optional<UserProfile> getProfile(Long userId) {
        return profileRepo.findByUserId(userId);
    }

    @Override
    public Optional<UserDTO> getById(Long id) {
        Optional<User> uopt = userRepo.findById(id);
        if (uopt.isEmpty()) return Optional.empty();
        User u = uopt.get();
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setCreatedAt(u.getCreatedAt());
        dto.setRole(u.getRole());
        return Optional.of(dto);
    }

    @Override
    public void requestPasswordReset(String email) {
        // Minimal stub: look up user to validate existence. Actual email flow not implemented.
        Optional<User> uopt = userRepo.findByEmail(email);
        if (uopt.isEmpty()) throw new IllegalArgumentException("Email not found");
    }

    @Override
    public void verifyEmail(String token) {
        // stub: token verification not implemented
    }
    
    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepo.findAll();
        List<UserDTO> dtos = new ArrayList<>();
        for (User u : users) {
            UserDTO dto = new UserDTO();
            dto.setId(u.getId());
            dto.setEmail(u.getEmail());
            dto.setCreatedAt(u.getCreatedAt());
            dto.setRole(u.getRole());
            dtos.add(dto);
        }
        return dtos;
    }
}
