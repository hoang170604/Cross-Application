package com.crossapplication.main.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ChallengeCompletedListener {
    private static final Logger logger = LoggerFactory.getLogger(ChallengeCompletedListener.class);

    @Autowired
    private com.crossapplication.main.service.interfaces.ProgressService progressService;

    @EventListener
    public void onChallengeCompleted(ChallengeCompletedEvent ev) {
        logger.info("Challenge completed: challengeId={}, userId={}", ev.getChallengeId(), ev.getUserId());
        try {
            progressService.onChallengeCompleted(ev.getUserId(), ev.getChallengeId());
        } catch (Exception ex) {
            logger.warn("Error handling challenge completion: {}", ex.getMessage());
        }
        // future: send notification via NotificationService
    }
}
