package com.skillgapanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleAnalysisResponseDto {
    private Long id;
    private Long userId;
    private String targetRole;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> additionalSkills;
    private Double gapPercentage;
    private Double readinessScore;
    private List<RecommendationDto> recommendations;
    private List<RoadmapWeekDto> roadmap;
    private LocalDateTime analyzedDate;
}
