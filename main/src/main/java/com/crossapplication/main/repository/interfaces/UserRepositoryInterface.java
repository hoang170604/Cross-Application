package com.crossapplication.main.repository.interfaces;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.entity.User;

public interface UserRepositoryInterface {
    void save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    List<User> findAllUser();

    void updateUser(User user);

    void deleteUser(Long id);
}
