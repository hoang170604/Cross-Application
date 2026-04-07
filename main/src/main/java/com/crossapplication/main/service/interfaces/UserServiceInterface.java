package com.crossapplication.main.service.interfaces;

import java.util.Optional;

import com.crossapplication.main.dto.UserDTO;
import com.crossapplication.main.entity.NutritionGoal;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.UserProfile;

public interface UserServiceInterface {
    User register(String email, String password);

    String login(String email, String password);

    void changePassword(Long userId, String newPassword);

    NutritionGoal updateProfileAndCalculateGoal(Long id, UserProfile profile);

    Optional<UserDTO> getById(Long id);

    void requestPasswordReset(String email);

    void verifyEmail(String token);
}
