package com.skillgapanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private Long id;

    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotBlank(message = "Skill level is required")
    private String skillLevel;

    @NotNull(message = "User ID is required")
    private Long userId;
}
