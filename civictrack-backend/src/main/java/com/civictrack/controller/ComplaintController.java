package com.civictrack.controller;

import com.civictrack.model.Complaint;
import com.civictrack.model.dto.ComplaintDTO;
import com.civictrack.model.dto.EmployeeDTO;
import com.civictrack.model.dto.FeedbackDTO;
import com.civictrack.model.dto.ResolveDTO;
import com.civictrack.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // Endpoint for the user portal to create a new complaint
    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return complaintService.createComplaint(complaint);
    }

    // Endpoint for the user portal to get complaints sorted by proximity and other scores
    @GetMapping
    public List<ComplaintDTO> getAllComplaints(@RequestParam double lat, @RequestParam double lon) {
        return complaintService.getSortedComplaints(lat, lon);
    }
    
    // Endpoint for the admin portal to get complaints sorted by admin priority score
    @GetMapping("/admin-view")
    public List<ComplaintDTO> getAdminView() {
        return complaintService.getAdminSortedComplaints();
    }

    // Endpoint for the user portal to check for similar complaints before filing
    @PostMapping("/find-similar")
    public List<Complaint> findSimilar(@RequestBody Complaint complaint) {
        return complaintService.findSimilarComplaints(complaint);
    }

    // Endpoint for the user portal to upvote a complaint
    @PatchMapping("/{id}/upvote")
    public ResponseEntity<Complaint> upvoteComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.upvoteComplaint(id));
    }
    
    // Endpoint for the user portal to submit feedback on a resolved issue
    @PostMapping("/{id}/feedback")
    public ResponseEntity<Complaint> addFeedback(@PathVariable Long id, @RequestBody FeedbackDTO feedback) {
        return ResponseEntity.ok(complaintService.addFeedback(id, feedback));
    }

    // --- Admin-Specific Actions ---

    // Endpoint for the admin portal to assign an employee to a complaint
    @PatchMapping("/{id}/assign")
    public ResponseEntity<Complaint> assignEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(complaintService.assignEmployee(id, employeeDTO));
    }

    // Endpoint for the admin portal to resolve a complaint
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Complaint> resolveComplaint(@PathVariable Long id, @RequestBody ResolveDTO resolveDTO) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id, resolveDTO));
    }

    // Endpoint for the admin portal to update a complaint's status (e.g., to reopen it)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        return ResponseEntity.ok(complaintService.updateStatus(id, statusMap));
    }
}

