package com.crossapplication.main.repository.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.FastingState;

@Repository
public interface FastingStateRepository extends JpaRepository<FastingState, Long> {
}
