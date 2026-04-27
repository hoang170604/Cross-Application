package com.crossapplication.main.service.interfaces;

import java.util.Optional;

import com.crossapplication.main.dto.UserDTO;
import com.crossapplication.main.entity.NutritionGoal;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.UserProfile;

public interface UserServiceInterface {
    public User register(String email, String password);

    public String login(String email, String password);

    public User loginAndGetUser(String email, String password);

    public void changePassword(Long userId, String newPassword);

    public NutritionGoal updateProfileAndCalculateGoal(Long id, UserProfile profile);

    public Optional<UserDTO> getById(Long id);

    public void requestPasswordReset(String email);

    public void verifyEmail(String token);
    
    /**
     * ADMIN: Get all users for management
     */
    public java.util.List<UserDTO> getAllUsers();
}
