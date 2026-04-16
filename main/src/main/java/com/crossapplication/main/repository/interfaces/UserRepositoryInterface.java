package com.crossapplication.main.repository.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crossapplication.main.entity.User;

public interface UserRepositoryInterface extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    default List<User> findAllUser() { return findAll(); }
    default void updateUser(User user) { save(user); }
    default void deleteUser(Long id) { deleteById(id); }
}
