package com.skillgapanalyzer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "skill_name")
    private String skillName;

    @Column(nullable = false, name = "skill_level")
    private String skillLevel;

    @Column(nullable = false, name = "user_id")
    private Long userId;
}
