package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.SkillDto;
import com.skillgapanalyzer.entity.Skill;
import com.skillgapanalyzer.exception.ResourceNotFoundException;
import com.skillgapanalyzer.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Autowired
    public SkillServiceImpl(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public SkillDto saveSkill(SkillDto skillDto) {
        Skill skill = Skill.builder()
                .skillName(skillDto.getSkillName())
                .skillLevel(skillDto.getSkillLevel())
                .userId(skillDto.getUserId())
                .build();

        Skill savedSkill = skillRepository.save(skill);
        return mapToDto(savedSkill);
    }

    @Override
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SkillDto getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill with id " + id + " not found."));
        return mapToDto(skill);
    }

    @Override
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill with id " + id + " not found.");
        }
        skillRepository.deleteById(id);
    }

    private SkillDto mapToDto(Skill skill) {
        return SkillDto.builder()
                .id(skill.getId())
                .skillName(skill.getSkillName())
                .skillLevel(skill.getSkillLevel())
                .userId(skill.getUserId())
                .build();
    }
}
