package com.crossapplication.main.repository.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.FastingSession;

@Repository
public interface FastingSessionRepository extends JpaRepository<FastingSession, Long> {
    List<FastingSession> findByUserId(Long userId);
    // find an open (not completed) session for a user
    java.util.Optional<FastingSession> findFirstByUserIdAndIsCompletedFalseOrderByStartTimeDesc(Long userId);
}
