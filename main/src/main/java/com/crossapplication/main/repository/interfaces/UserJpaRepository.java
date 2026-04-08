package com.crossapplication.main.repository.interfaces;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.User;

@Repository
public interface UserJpaRepository extends JpaRepository<User, Long> {
    public Optional<User> findByEmail(String email);
}
