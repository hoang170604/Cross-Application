package com.crossapplication.main.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.WorkoutChallenge;
import com.crossapplication.main.repository.interfaces.WorkoutChallengeRepository;
import com.crossapplication.main.service.interfaces.WorkoutChallengeService;

@SpringBootTest
public class WorkoutChallengeServiceTest {

    @Autowired
    private WorkoutChallengeService challengeService;

    @Autowired
    private WorkoutChallengeRepository challengeRepo;

    @Test
    @Transactional
    public void testCompleteChallengeMarksInactive() {
        // create a test user
        com.crossapplication.main.entity.User testUser = new com.crossapplication.main.entity.User();
        testUser.setEmail("test+challenge@example.com");
        testUser.setPassword("pass");
        
        Long userId = 1L;
        try {
            // reflectively obtain UserRepositoryInterface bean
            org.springframework.context.ApplicationContext ctx = org.springframework.test.context.TestContextManager.class.getDeclaredConstructor(Class.class).newInstance(this.getClass()).getTestContext().getApplicationContext();
            com.crossapplication.main.repository.interfaces.UserRepositoryInterface userRepo = ctx.getBean(com.crossapplication.main.repository.interfaces.UserRepositoryInterface.class);
            userRepo.save(testUser);
            userId = testUser.getId();
        } catch (Exception ex) {
            // fallback to 1
        }
        WorkoutChallengeDTO dto = new WorkoutChallengeDTO();
        dto.setUserId(userId);
        dto.setChallengeName("Test");
        dto.setTargetValue(100.0);
        dto.setCurrentValue(100.0);
        WorkoutChallenge created = challengeService.create(dto);
        assertFalse(created.getIsActive(), "Challenge at target should be inactive");
    }
}
