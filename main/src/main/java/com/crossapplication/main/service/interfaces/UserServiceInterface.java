package com.crossapplication.main.service.interfaces;

import com.crossapplication.main.entity.NutritionGoal;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.UserProfile;

public interface UserServiceInterface {
    public User register(String email, String password);

    public String login(String email, String password);

    public void changePassword(Long userId, String newPassword);

    public NutritionGoal updateProfileAndCalculateGoal(Long id, UserProfile profile);
}
