package com.civictrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    private String userPhone;
    
    private String category; // NEW

    @Column(columnDefinition = "TEXT")
    private String description;

    private String address;
    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String resolvedImageUrl;

    private String status;
    private int upvotes = 1; // NEW: Starts at 1

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    
    private String assignedEmployeeName;
    private String assignedEmployeeContact;
    
    // NEW: Feedback fields
    private Boolean satisfiedWithWork;
    private Boolean satisfiedWithSpeed;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "active";
    }
}

