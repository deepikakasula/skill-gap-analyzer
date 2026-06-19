package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.AnalysisRequestDto;
import com.skillgapanalyzer.entity.Analysis;

import java.util.List;

public interface AnalysisService {
    Analysis runAnalysis(AnalysisRequestDto requestDto);
    List<Analysis> getAllAnalyses();
}
