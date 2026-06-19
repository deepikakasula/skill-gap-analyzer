package com.skillgapanalyzer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "skill_name")
    private String skillName;

    @Column(nullable = false, name = "current_level")
    private String currentLevel;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "analysis_missing_skills", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "missing_skill")
    private List<String> missingSkills;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(columnDefinition = "TEXT")
    private String evaluation;

    @Column(nullable = false, name = "analyzed_date")
    private LocalDateTime analyzedDate;
}
