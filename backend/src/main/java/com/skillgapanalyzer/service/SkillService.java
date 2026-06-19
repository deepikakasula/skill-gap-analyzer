package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.SkillDto;

import java.util.List;

public interface SkillService {
    SkillDto saveSkill(SkillDto skillDto);
    List<SkillDto> getAllSkills();
    SkillDto getSkillById(Long id);
    void deleteSkill(Long id);
}
