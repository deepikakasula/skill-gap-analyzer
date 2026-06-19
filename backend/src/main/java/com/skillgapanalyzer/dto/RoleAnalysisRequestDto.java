package com.skillgapanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleAnalysisRequestDto {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Target role is required")
    private String targetRole;
}
