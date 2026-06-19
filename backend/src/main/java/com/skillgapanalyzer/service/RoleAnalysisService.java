package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.RoleAnalysisRequestDto;
import com.skillgapanalyzer.dto.RoleAnalysisResponseDto;

import java.util.List;

public interface RoleAnalysisService {
    RoleAnalysisResponseDto runAnalysis(RoleAnalysisRequestDto requestDto);
    List<RoleAnalysisResponseDto> getHistoryByUserId(Long userId);
    RoleAnalysisResponseDto getLatestByUserId(Long userId);
}
