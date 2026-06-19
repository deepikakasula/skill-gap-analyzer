package com.skillgapanalyzer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "role_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "user_id")
    private Long userId;

    @Column(nullable = false, name = "target_role")
    private String targetRole;

    @Column(name = "gap_percentage")
    private Double gapPercentage;

    @Column(name = "readiness_score")
    private Double readinessScore;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "role_analysis_matched_skills", joinColumns = @JoinColumn(name = "role_analysis_id"))
    @Column(name = "skill_name")
    private List<String> matchedSkills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "role_analysis_missing_skills", joinColumns = @JoinColumn(name = "role_analysis_id"))
    @Column(name = "skill_name")
    private List<String> missingSkills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "role_analysis_additional_skills", joinColumns = @JoinColumn(name = "role_analysis_id"))
    @Column(name = "skill_name")
    private List<String> additionalSkills;

    @Column(columnDefinition = "TEXT", name = "recommendations_json")
    private String recommendationsJson;

    @Column(columnDefinition = "TEXT", name = "roadmap_json")
    private String roadmapJson;

    @Column(nullable = false, name = "analyzed_date")
    private LocalDateTime analyzedDate;
}
