package com.skillgapanalyzer.repository;

import com.skillgapanalyzer.entity.RoleAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleAnalysisRepository extends JpaRepository<RoleAnalysis, Long> {
    List<RoleAnalysis> findByUserId(Long userId);
    List<RoleAnalysis> findByUserIdOrderByAnalyzedDateDesc(Long userId);
}
