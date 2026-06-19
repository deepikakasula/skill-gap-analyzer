package com.skillgapanalyzer.controller;

import com.skillgapanalyzer.dto.RoleAnalysisRequestDto;
import com.skillgapanalyzer.dto.RoleAnalysisResponseDto;
import com.skillgapanalyzer.service.RoleAnalysisService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis/role")
@CrossOrigin(origins = "*")
public class RoleAnalysisController {

    private final RoleAnalysisService roleAnalysisService;

    @Autowired
    public RoleAnalysisController(RoleAnalysisService roleAnalysisService) {
        this.roleAnalysisService = roleAnalysisService;
    }

    @PostMapping
    public ResponseEntity<RoleAnalysisResponseDto> runAnalysis(@Valid @RequestBody RoleAnalysisRequestDto requestDto) {
        RoleAnalysisResponseDto response = roleAnalysisService.runAnalysis(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RoleAnalysisResponseDto>> getHistoryByUserId(@PathVariable Long userId) {
        List<RoleAnalysisResponseDto> history = roleAnalysisService.getHistoryByUserId(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<RoleAnalysisResponseDto> getLatestByUserId(@PathVariable Long userId) {
        RoleAnalysisResponseDto response = roleAnalysisService.getLatestByUserId(userId);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
