package com.civictrack.model.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object for collecting user feedback on a resolved complaint.
 */
@Getter
@Setter
public class FeedbackDTO {
    /**
     * A boolean indicating if the user was satisfied with the quality of the work.
     */
    private Boolean satisfiedWithWork;

    /**
     * A boolean indicating if the user was satisfied with the speed of the resolution.
     */
    private Boolean satisfiedWithSpeed;
}



