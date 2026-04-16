package com.crossapplication.main.events;

import org.springframework.context.ApplicationEvent;

public class ChallengeCompletedEvent extends ApplicationEvent {
    private final Long challengeId;
    private final Long userId;

    public ChallengeCompletedEvent(Object source, Long challengeId, Long userId) {
        super(source);
        this.challengeId = challengeId;
        this.userId = userId;
    }

    public Long getChallengeId() { return challengeId; }
    public Long getUserId() { return userId; }
}
