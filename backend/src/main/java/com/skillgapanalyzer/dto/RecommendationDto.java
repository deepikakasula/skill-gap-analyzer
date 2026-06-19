package com.skillgapanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDto {
    private String skillName;
    private String importance; // Critical, High, Medium, Low
    private List<String> topics;
    private List<String> resources;
    private List<String> practiceProjects;
}
