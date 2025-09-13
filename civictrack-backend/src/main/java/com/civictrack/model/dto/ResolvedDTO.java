package com.civictrack.model.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object for carrying the URL of the image
 * that proves a complaint has been resolved.
 */
@Getter
@Setter
public class ResolvedDTO {
    /**
     * The base64-encoded string or URL of the image showing the completed work.
     */
    private String resolvedImageUrl;
}
