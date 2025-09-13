package com.civictrack.service;

import com.civictrack.model.Complaint;
import com.civictrack.model.dto.ComplaintDTO;
import com.civictrack.model.dto.EmployeeDTO;
import com.civictrack.model.dto.FeedbackDTO;
import com.civictrack.model.dto.ResolvedDTO;
import com.civictrack.repository.ComplaintRepository;
import jakarta.persistence.EntityNotFoundException;
import org.apache.commons.text.similarity.JaroWinklerDistance;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint createComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    public List<ComplaintDTO> getSortedComplaints(double userLat, double userLon) {
        return complaintRepository.findAll().stream()
                .map(complaint -> calculateScores(complaint, userLat, userLon))
                .sorted(Comparator.comparing(ComplaintDTO::getUserTotalScore).reversed())
                .collect(Collectors.toList());
    }
    
    public List<ComplaintDTO> getAdminSortedComplaints() {
         return complaintRepository.findAll().stream()
                .map(complaint -> calculateScores(complaint, 0, 0)) // User location not needed for admin
                .sorted(Comparator.comparing(ComplaintDTO::getAdminPriorityScore).reversed())
                .collect(Collectors.toList());
    }

    public List<Complaint> findSimilarComplaints(Complaint complaint) {
        if (complaint.getLatitude() == null || complaint.getLongitude() == null || complaint.getCategory() == null) {
            return List.of();
        }
        List<Complaint> nearbyComplaints = complaintRepository.findSimilarWithinRadius(
            complaint.getLatitude(), complaint.getLongitude(), complaint.getCategory()
        );
        
        JaroWinklerDistance similarity = new JaroWinklerDistance();
        return nearbyComplaints.stream()
                .filter(existing -> similarity.apply(complaint.getDescription(), existing.getDescription()) > 0.7) // 70% similarity
                .collect(Collectors.toList());
    }
    
    public Complaint upvoteComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Complaint not found"));
        complaint.setUpvotes(complaint.getUpvotes() + 1);
        return complaintRepository.save(complaint);
    }

    public Complaint addFeedback(Long id, FeedbackDTO feedback) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Complaint not found"));
        complaint.setSatisfiedWithWork(feedback.isSatisfiedWithWork());
        complaint.setSatisfiedWithSpeed(feedback.isSatisfiedWithSpeed());
        return complaintRepository.save(complaint);
    }

    public Complaint assignEmployee(Long id, EmployeeDTO employeeDTO) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Complaint not found"));
        complaint.setAssignedEmployeeName(employeeDTO.getName());
        complaint.setAssignedEmployeeContact(employeeDTO.getContact());
        complaint.setStatus("In Progress");
        return complaintRepository.save(complaint);
    }

    public Complaint resolveComplaint(Long id, ResolvedDTO resolveDTO) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Complaint not found"));
        complaint.setResolvedImageUrl(resolveDTO.getResolvedImageUrl());
        complaint.setStatus("Resolved");
        complaint.setResolvedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public Complaint updateStatus(Long id, Map<String, String> statusMap) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Complaint not found"));
        complaint.setStatus(statusMap.get("status"));
        return complaintRepository.save(complaint);
    }

    private ComplaintDTO calculateScores(Complaint complaint, double userLat, double userLon) {
        ComplaintDTO dto = new ComplaintDTO();
        BeanUtils.copyProperties(complaint, dto);

        double proximityScore = (userLat != 0 && userLon != 0 && complaint.getLatitude() != null && complaint.getLongitude() != null) 
                                ? getProximityScore(complaint.getLatitude(), complaint.getLongitude(), userLat, userLon) : 0;
        double urgencyScore = getUrgencyScore(complaint.getCategory());
        double ageScore = getAgeScore(complaint.getCreatedAt());
        double upvoteScore = getUpvoteScore(complaint.getUpvotes());

        dto.setUserTotalScore((proximityScore * 0.4) + (urgencyScore * 0.25) + (upvoteScore * 0.25) + (ageScore * 0.1));
        dto.setAdminPriorityScore((urgencyScore * 0.4) + (upvoteScore * 0.4) + (ageScore * 0.2));
        
        return dto;
    }

    private double getProximityScore(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        lat1 = Math.toRadians(lat1); lat2 = Math.toRadians(lat2);
        double a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        double c = 2 * Math.asin(Math.sqrt(a));
        double distance = 6371 * c;

        if (distance <= 0.5) return 10;
        if (distance <= 1.5) return 7;
        if (distance <= 3.0) return 4;
        return 0;
    }

    private int getUrgencyScore(String category) {
        if (category == null) return 0;
        switch (category.toLowerCase()) {
            case "garbage": case "streetlights": case "public toilet": case "parks": case "sewage": case "drainage": case "pipeline leakage": return 10;
            case "fire safety": case "damaged traffic signals": case "power cut": case "potholes": case "encroachment": case "damaged footpath": case "stray dogs": return 6;
            default: return 3;
        }
    }

    private int getAgeScore(LocalDateTime createdAt) {
        if (createdAt == null) return 0;
        long hours = Duration.between(createdAt, LocalDateTime.now()).toHours();
        if (hours < 6) return 0; if (hours <= 12) return 1; if (hours <= 18) return 2;
        if (hours <= 24) return 3; if (hours <= 30) return 4; if (hours <= 36) return 5;
        if (hours <= 42) return 6; if (hours <= 48) return 7; if (hours <= 54) return 8;
        if (hours <= 60) return 9;
        return 10;
    }

    private int getUpvoteScore(int upvotes) {
        if (upvotes <= 4) return 1; if (upvotes <= 14) return 4; if (upvotes <= 49) return 7;
        return 10;
    }
}

