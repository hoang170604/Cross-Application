package com.crossapplication.main.service.interfaces;

import com.crossapplication.main.entity.User;

public interface UserServiceInterface {
    public User register(String email, String password);

    public String login(String email, String password);

    public void changePassword(Long userId, String newPassword);

}
