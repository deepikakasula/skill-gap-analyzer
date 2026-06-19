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
public class RoadmapWeekDto {
    private String week;
    private String title;
    private List<String> topics;
    private int estimatedHours;
    private int progress; // default 0
}
