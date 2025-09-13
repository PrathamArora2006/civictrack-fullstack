package com.civictrack.model.dto;

import com.civictrack.model.Complaint;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintDTO extends Complaint {
    private double userTotalScore;
    private double adminPriorityScore;
}

