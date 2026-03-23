package com.crossapplication.main.service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.UserServiceInterface;

@Service
public class UserService implements UserServiceInterface{

    @Autowired
    private UserRepositoryInterface userRepository;

    @Override
    public User register(String email, String password) {
        User existingUser = userRepository.findByEmail(email);
        if(existingUser!= null) {
            System.err.println("Email nay da duco su dung");
        }
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setPassword(password);
                newUser.setCreatedAt(null);
                userRepository.save(newUser);
        
        return newUser;
    }

    private String generateJwtToken(User user) {
        return "eyJhbGciOiJIUzI1NiJ9.token-for-" + user.getEmail();
    }

    @Override
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if(user.getEmail() == null) {
            System.err.println("Tai khoan khong ton tai!");
        } if (!user.getPassword().equals(password)) {
            System.err.println("Sai mat khau!");
        }
        return generateJwtToken(user);
    }

    @Override
    public void changePassword(Long userId, String newPassword) {
        //Timf hieu code them
    }
}
