package com.civictrack.model.dto;

// Existing FeedbackDTO code
public class FeedbackDTO {
    private boolean satisfiedWithWork;
    private boolean satisfiedWithSpeed;

    public boolean isSatisfiedWithWork() {
        return satisfiedWithWork;
    }

    public void setSatisfiedWithWork(boolean satisfiedWithWork) {
        this.satisfiedWithWork = satisfiedWithWork;
    }

    public boolean isSatisfiedWithSpeed() {
        return satisfiedWithSpeed;
    }

    public void setSatisfiedWithSpeed(boolean satisfiedWithSpeed) {
        this.satisfiedWithSpeed = satisfiedWithSpeed;
    }

    // other fields and methods
}