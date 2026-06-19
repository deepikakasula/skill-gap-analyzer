package com.skillgapanalyzer.controller;

import com.skillgapanalyzer.dto.AnalysisRequestDto;
import com.skillgapanalyzer.entity.Analysis;
import com.skillgapanalyzer.service.AnalysisService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class AnalysisController {

    private final AnalysisService analysisService;

    @Autowired
    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping
    public ResponseEntity<Analysis> runAnalysis(@Valid @RequestBody AnalysisRequestDto requestDto) {
        Analysis result = analysisService.runAnalysis(requestDto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Analysis>> getAllAnalyses() {
        List<Analysis> analyses = analysisService.getAllAnalyses();
        return ResponseEntity.ok(analyses);
    }
}
