package com.crossapplication.main.repository.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.entity.User;

public interface UserRepositoryInterface {
    public void save(User user);

    public Optional<User> findById(Long id);

    public Optional<User> findByEmail(String email);

    public List<User> findAllUser();

    public void updateUser(User user);

    public void deleteUser(Long id);
}
