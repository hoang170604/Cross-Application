package com.crossapplication.main.service;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.entity.FastingSession;
import com.crossapplication.main.repository.interfaces.FastingSessionRepository;
import com.crossapplication.main.repository.interfaces.FastingStateRepository;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.service.interfaces.FastingStateService;

@SpringBootTest
public class FastingFlowIntegrationTest {

    @Autowired
    private FastingStateService fastingStateService;

    @Autowired
    private FastingSessionRepository sessionRepo;

    @Autowired
    private UserRepositoryInterface userRepo;

    @Autowired
    private FastingStateRepository stateRepo;

    @Test
    @Transactional
    public void testStartStopCreatesSessionAndClosesIt() {
        // create a test user
        com.crossapplication.main.entity.User testUser = new com.crossapplication.main.entity.User();
        testUser.setEmail("test+fasting@example.com");
        testUser.setPassword("pass");
        userRepo.save(testUser);
        Long userId = testUser.getId();

        LocalDateTime start = LocalDateTime.now().minusHours(5);
        fastingStateService.startFasting(userId, start, 16);

        List<FastingSession> sessions = sessionRepo.findByUserId(userId);
        assertFalse(sessions.isEmpty(), "Session should be created on start");

        fastingStateService.stopFasting(userId, LocalDateTime.now());

        var open = sessionRepo.findFirstByUserIdAndIsCompletedFalseOrderByStartTimeDesc(userId);
        assertTrue(open.isEmpty(), "Open session should be closed after stop");
    }
}
