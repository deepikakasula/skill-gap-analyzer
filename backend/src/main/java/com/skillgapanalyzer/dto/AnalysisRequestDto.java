package com.skillgapanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnalysisRequestDto {
    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotBlank(message = "Current self-assessed level is required")
    private String currentLevel;
}
