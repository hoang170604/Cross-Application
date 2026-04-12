package com.crossapplication.main.service.services;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.dto.UserDTO;
import com.crossapplication.main.entity.NutritionGoal;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.UserProfile;
import com.crossapplication.main.repository.interfaces.NutritionGoalRepository;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.UserServiceInterface;

@Service
public class UserService implements UserServiceInterface {

    @Autowired
    private UserRepositoryInterface userRepo;

    @Autowired
    private NutritionGoalRepository goalRepo;

    @Override
    public User register(String email, String password) {
        Optional<User> existing = userRepo.findByEmail(email);
        if (existing.isPresent()) throw new IllegalArgumentException("Email already registered");
        User u = new User();
        u.setEmail(email);
        u.setPassword(password);
        u.setCreatedAt(LocalDate.now());
        userRepo.save(u);
        return u;
    }

    @Override
    public String login(String email, String password) {
        Optional<User> uopt = userRepo.findByEmail(email);
        if (uopt.isEmpty()) throw new IllegalArgumentException("Invalid credentials");
        User u = uopt.get();
        if (!u.getPassword().equals(password)) throw new IllegalArgumentException("Invalid credentials");
        return "token-" + u.getId() + "-" + System.currentTimeMillis();
    }

    @Override
    public void changePassword(Long userId, String newPassword) {
        Optional<User> uopt = userRepo.findById(userId);
        if (uopt.isEmpty()) throw new IllegalArgumentException("User not found");
        User u = uopt.get();
        u.setPassword(newPassword);
        userRepo.updateUser(u);
    }
        // cá nhân hóa, tính chỉ số cơ thể
    @Override
    public NutritionGoal updateProfileAndCalculateGoal(Long id, UserProfile profile) {
        Optional<User> uopt = userRepo.findById(id);
        if (uopt.isEmpty()) throw new IllegalArgumentException("User not found");
        User u = uopt.get();

        // Basic BMR calculation (Mifflin-St Jeor)
        double bmr;
        double weight = profile.getWeight();
        double height = profile.getHeight();
        int age = profile.getAge();
        String gender = profile.getGender();
        if ("male".equalsIgnoreCase(gender)) {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        double activity = profile.getActivityLevel() > 0 ? profile.getActivityLevel() : 1.2;
        double targetCalories = bmr * activity;
        String goal = profile.getGoal() != null ? profile.getGoal().toLowerCase() : "maintain";
        if (goal.contains("lose")) targetCalories -= 500;
        if (goal.contains("gain")) targetCalories += 500;

        NutritionGoal ng = new NutritionGoal();
        ng.setUser(u);
        ng.setTargetCalories(targetCalories);
        
        double proteinCalories = targetCalories * 0.2;
        double carbCalories = targetCalories * 0.5;
        double fatCalories = targetCalories * 0.3;
        ng.setTargetProtein(proteinCalories / 4.0);
        ng.setTargetCarb(carbCalories / 4.0);
        ng.setTargetFat(fatCalories / 9.0);
        return goalRepo.save(ng);
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
}
