package com.crossapplication.main.repository.interfaces;

import java.util.List;

import com.crossapplication.main.entity.User;

public interface UserRepositoryInterface {
    public void save(User user);

    public User findById(int id);

    public User findByEmail(String email);

    public List<User> findAllUser();

    public void updateUser(User user);

    public void deleteUser(int id);
}
