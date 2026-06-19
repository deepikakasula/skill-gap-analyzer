package com.skillgapanalyzer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgapanalyzer.dto.RecommendationDto;
import com.skillgapanalyzer.dto.RoadmapWeekDto;
import com.skillgapanalyzer.dto.RoleAnalysisRequestDto;
import com.skillgapanalyzer.dto.RoleAnalysisResponseDto;
import com.skillgapanalyzer.entity.RoleAnalysis;
import com.skillgapanalyzer.entity.Skill;
import com.skillgapanalyzer.repository.RoleAnalysisRepository;
import com.skillgapanalyzer.repository.SkillRepository;
import com.skillgapanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleAnalysisServiceImpl implements RoleAnalysisService {

    private final RoleAnalysisRepository roleAnalysisRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // Role required skills definitions
    private static final Map<String, List<String>> ROLE_REQUIRED_SKILLS = new LinkedHashMap<>();
    static {
        ROLE_REQUIRED_SKILLS.put("Frontend Developer", Arrays.asList("React", "TypeScript", "JavaScript", "HTML/CSS", "Git"));
        ROLE_REQUIRED_SKILLS.put("Backend Developer", Arrays.asList("Java", "Spring Boot", "MySQL", "REST APIs", "Git"));
        ROLE_REQUIRED_SKILLS.put("Full-stack Developer", Arrays.asList("React", "TypeScript", "Java", "Spring Boot", "MySQL", "Git"));
        ROLE_REQUIRED_SKILLS.put("DevOps Engineer", Arrays.asList("Linux", "Git", "Docker", "Kubernetes", "CI/CD", "AWS"));
        ROLE_REQUIRED_SKILLS.put("Data Engineer", Arrays.asList("Python", "SQL", "Spark", "AWS", "Git"));
    }

    // Learning dependency hierarchy (lower value means higher prerequisite - should be learned earlier)
    private static final Map<String, Integer> SKILL_PREREQUISITE_ORDER = new HashMap<>();
    static {
        SKILL_PREREQUISITE_ORDER.put("html/css", 1);
        SKILL_PREREQUISITE_ORDER.put("javascript", 2);
        SKILL_PREREQUISITE_ORDER.put("python", 3);
        SKILL_PREREQUISITE_ORDER.put("linux", 4);
        SKILL_PREREQUISITE_ORDER.put("sql", 5);
        SKILL_PREREQUISITE_ORDER.put("git", 6);
        SKILL_PREREQUISITE_ORDER.put("typescript", 7);
        SKILL_PREREQUISITE_ORDER.put("java", 8);
        SKILL_PREREQUISITE_ORDER.put("rest apis", 9);
        SKILL_PREREQUISITE_ORDER.put("mysql", 10);
        SKILL_PREREQUISITE_ORDER.put("react", 11);
        SKILL_PREREQUISITE_ORDER.put("spring boot", 12);
        SKILL_PREREQUISITE_ORDER.put("spark", 13);
        SKILL_PREREQUISITE_ORDER.put("docker", 14);
        SKILL_PREREQUISITE_ORDER.put("aws", 15);
        SKILL_PREREQUISITE_ORDER.put("ci/cd", 16);
        SKILL_PREREQUISITE_ORDER.put("kubernetes", 17);
    }

    @Autowired
    public RoleAnalysisServiceImpl(RoleAnalysisRepository roleAnalysisRepository,
                                  SkillRepository skillRepository,
                                  UserRepository userRepository,
                                  ObjectMapper objectMapper) {
        this.roleAnalysisRepository = roleAnalysisRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public RoleAnalysisResponseDto runAnalysis(RoleAnalysisRequestDto requestDto) {
        // Validate user existence
        userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + requestDto.getUserId() + " not found."));

        String targetRole = requestDto.getTargetRole();
        List<String> requiredSkills = ROLE_REQUIRED_SKILLS.get(targetRole);
        if (requiredSkills == null) {
            throw new IllegalArgumentException("Target role '" + targetRole + "' is not supported. Supported roles: " + ROLE_REQUIRED_SKILLS.keySet());
        }

        // Fetch user skills
        List<Skill> userSkills = skillRepository.findByUserId(requestDto.getUserId());
        Set<String> userSkillNamesLower = userSkills.stream()
                .map(s -> s.getSkillName().trim().toLowerCase())
                .collect(Collectors.toSet());

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> additionalSkills = new ArrayList<>();

        // Categorize required skills
        for (String req : requiredSkills) {
            if (userSkillNamesLower.contains(req.toLowerCase())) {
                matchedSkills.add(req);
            } else {
                missingSkills.add(req);
            }
        }

        // Categorize additional skills
        Set<String> reqSkillNamesLower = requiredSkills.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        for (Skill s : userSkills) {
            String sName = s.getSkillName().trim();
            if (!reqSkillNamesLower.contains(sName.toLowerCase())) {
                additionalSkills.add(sName);
            }
        }

        // Calculations
        double totalRequired = requiredSkills.size();
        double gapPercentage = totalRequired > 0 ? (missingSkills.size() / totalRequired) * 100.0 : 0.0;
        double readinessScore = totalRequired > 0 ? (matchedSkills.size() / totalRequired) * 100.0 : 0.0;

        // Generate recommendations for missing skills
        List<RecommendationDto> recommendations = missingSkills.stream()
                .map(this::generateRecommendationForSkill)
                .collect(Collectors.toList());

        // Generate learning roadmap
        List<RoadmapWeekDto> roadmap = generateRoadmap(missingSkills);

        try {
            // Persist to database
            String recommendationsJson = objectMapper.writeValueAsString(recommendations);
            String roadmapJson = objectMapper.writeValueAsString(roadmap);

            RoleAnalysis roleAnalysis = RoleAnalysis.builder()
                    .userId(requestDto.getUserId())
                    .targetRole(targetRole)
                    .gapPercentage(gapPercentage)
                    .readinessScore(readinessScore)
                    .matchedSkills(matchedSkills)
                    .missingSkills(missingSkills)
                    .additionalSkills(additionalSkills)
                    .recommendationsJson(recommendationsJson)
                    .roadmapJson(roadmapJson)
                    .analyzedDate(LocalDateTime.now())
                    .build();

            RoleAnalysis saved = roleAnalysisRepository.save(roleAnalysis);

            return mapToResponseDto(saved, recommendations, roadmap);
        } catch (Exception e) {
            throw new RuntimeException("Failed to run and save role analysis: " + e.getMessage(), e);
        }
    }

    @Override
    public List<RoleAnalysisResponseDto> getHistoryByUserId(Long userId) {
        List<RoleAnalysis> history = roleAnalysisRepository.findByUserIdOrderByAnalyzedDateDesc(userId);
        return history.stream().map(this::convertToResponseDto).collect(Collectors.toList());
    }

    @Override
    public RoleAnalysisResponseDto getLatestByUserId(Long userId) {
        List<RoleAnalysis> history = roleAnalysisRepository.findByUserIdOrderByAnalyzedDateDesc(userId);
        if (history.isEmpty()) {
            return null;
        }
        return convertToResponseDto(history.get(0));
    }

    private RoleAnalysisResponseDto convertToResponseDto(RoleAnalysis entity) {
        try {
            List<RecommendationDto> recommendations = objectMapper.readValue(
                    entity.getRecommendationsJson(), new TypeReference<List<RecommendationDto>>() {});
            List<RoadmapWeekDto> roadmap = objectMapper.readValue(
                    entity.getRoadmapJson(), new TypeReference<List<RoadmapWeekDto>>() {});
            return mapToResponseDto(entity, recommendations, roadmap);
        } catch (Exception e) {
            throw new RuntimeException("Failed to read role analysis records: " + e.getMessage(), e);
        }
    }

    private RoleAnalysisResponseDto mapToResponseDto(RoleAnalysis entity,
                                                     List<RecommendationDto> recommendations,
                                                     List<RoadmapWeekDto> roadmap) {
        return RoleAnalysisResponseDto.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .targetRole(entity.getTargetRole())
                .matchedSkills(entity.getMatchedSkills())
                .missingSkills(entity.getMissingSkills())
                .additionalSkills(entity.getAdditionalSkills())
                .gapPercentage(entity.getGapPercentage())
                .readinessScore(entity.getReadinessScore())
                .recommendations(recommendations)
                .roadmap(roadmap)
                .analyzedDate(entity.getAnalyzedDate())
                .build();
    }

    private RecommendationDto generateRecommendationForSkill(String skillName) {
        String key = skillName.trim().toLowerCase();
        List<String> topics = new ArrayList<>();
        List<String> resources = new ArrayList<>();
        List<String> projects = new ArrayList<>();
        String importance = "High";

        if (key.contains("react")) {
            importance = "Critical";
            topics = Arrays.asList("React Fundamentals", "Components & Props", "State Management & Hooks", "Context API & Custom Hooks");
            resources = Arrays.asList("official React Docs (react.dev)", "Epic React by Kent C. Dodds");
            projects = Arrays.asList("Interactive Dashboard Application", "Weather Forecast App");
        } else if (key.contains("typescript") || key.equals("ts")) {
            importance = "High";
            topics = Arrays.asList("Static Typing & Basic Types", "Interfaces & Custom Type Declarations", "Generics & Utility Types", "Configuring tsconfig.json");
            resources = Arrays.asList("TypeScript Official Handbook (typescriptlang.org)", "Total TypeScript by Matt Pocock");
            projects = Arrays.asList("Type-safe React Task Tracker", "Generics Utility Library");
        } else if (key.contains("javascript") || key.equals("js")) {
            importance = "Critical";
            topics = Arrays.asList("Variables, Scope, and Closures", "ES6+ Array Methods & Features", "Asynchronous Programming (Promises, async/await)", "DOM Manipulation & Event Loop");
            resources = Arrays.asList("MDN Web Docs (developer.mozilla.org)", "Eloquent JavaScript book");
            projects = Arrays.asList("Vanilla JS E-commerce Product Page", "Async API Fetch and Chart Dashboard");
        } else if (key.contains("html/css") || key.contains("html") || key.contains("css")) {
            importance = "High";
            topics = Arrays.asList("Semantic HTML5 Tags", "CSS Flexbox & CSS Grid Layouts", "Responsive Design & Media Queries", "CSS Custom Properties (Variables)");
            resources = Arrays.asList("MDN HTML/CSS Tutorials", "CSS-Tricks layout guides");
            projects = Arrays.asList("Responsive Personal Landing Page", "Complex Dashboard Layout template");
        } else if (key.contains("git")) {
            importance = "High";
            topics = Arrays.asList("Git Repository Commands (init, commit, push)", "Branching & Merging Strategies", "GitHub Pull Request Workflows", "Resolving Branch Merge Conflicts");
            resources = Arrays.asList("Pro Git Book by Scott Chacon", "Learn Git Branching (learngitbranching.js.org)");
            projects = Arrays.asList("Initialize multi-branch repository, submit code reviews via PR");
        } else if (key.contains("java")) {
            importance = "Critical";
            topics = Arrays.asList("Java Core Basics & Object Oriented Design", "Collections Framework (List, Set, Map)", "Exception Handling workflows", "Java 8 Streams and Lambda Expressions");
            resources = Arrays.asList("Java Documentation (docs.oracle.com)", "Baeldung Java Tutorials");
            projects = Arrays.asList("Console-based Library System", "Multi-threaded File Processor");
        } else if (key.contains("spring boot") || key.contains("springboot")) {
            importance = "Critical";
            topics = Arrays.asList("Dependency Injection & Beans Config", "Building REST APIs with Spring Web", "Spring Data JPA & Hibernate integration", "Security Configurations & JWT");
            resources = Arrays.asList("Spring Academy courses", "Spring Boot Guides (spring.io)");
            projects = Arrays.asList("Employee Management Backend API", "Spring Boot Task Planner REST API");
        } else if (key.contains("mysql") || key.contains("sql")) {
            importance = "Critical";
            topics = Arrays.asList("Database Schemas & Data Types", "DML Queries (SELECT, JOIN, GROUP BY)", "Indexes & Query Optimization", "ACID Transactions & Constraints");
            resources = Arrays.asList("MySQL Documentation", "SQLBolt interactive tutorials");
            projects = Arrays.asList("Relational Database Schema design", "Writing analytical reporting queries");
        } else if (key.contains("rest apis") || key.contains("rest")) {
            importance = "High";
            topics = Arrays.asList("HTTP Methods & Status Codes", "Payload formatting with JSON", "API Documentation with OpenAPI/Swagger", "API security best practices");
            resources = Arrays.asList("REST API Design Manuals", "Swagger Docs tutorials");
            projects = Arrays.asList("Building a mock REST Gateway server");
        } else if (key.contains("docker")) {
            importance = "Medium";
            topics = Arrays.asList("Containers vs Virtual Machines", "Writing Dockerfiles", "Managing Docker Images & Volumes", "Multi-container orchestrations with Docker Compose");
            resources = Arrays.asList("Docker Docs (docs.docker.com)", "Docker Handbook on freeCodeCamp");
            projects = Arrays.asList("Dockerize Frontend + Backend application stack");
        } else if (key.contains("kubernetes") || key.equals("k8s")) {
            importance = "Medium";
            topics = Arrays.asList("K8s Cluster Architecture", "Deployments, Pods, and Services configuration", "ConfigMaps, Secrets, and Volumes", "Helm Chart package managers");
            resources = Arrays.asList("Kubernetes Documentation (kubernetes.io)", "KubeAcademy introductory course");
            projects = Arrays.asList("Deploy local service onto Minikube cluster");
        } else if (key.contains("ci/cd") || key.contains("jenkins") || key.contains("github actions")) {
            importance = "High";
            topics = Arrays.asList("Continuous Integration fundamentals", "Writing GitHub Actions workflows", "Automated Testing execution in pipeline", "Automated deployments to staging");
            resources = Arrays.asList("GitHub Actions Official Documentation", "GitLab CI Reference Manual");
            projects = Arrays.asList("Set up CI pipeline to build, test and dockerize app on pull request");
        } else if (key.contains("aws")) {
            importance = "Medium";
            topics = Arrays.asList("AWS Core Compute (EC2, ECS, Lambda)", "AWS Storage (S3, RDS, DynamoDB)", "IAM Users, Roles & Access Policies", "VPC Networking & Subnets");
            resources = Arrays.asList("AWS Cloud Practitioner Course", "AWS Developer Path guides");
            projects = Arrays.asList("Deploy static application to S3, set up EC2 environment");
        } else if (key.contains("linux")) {
            importance = "High";
            topics = Arrays.asList("Shell Command Navigation & Utilities", "File Permissions & Ownerships", "Process management & Logs debugging", "Shell scripting automation");
            resources = Arrays.asList("Linux Command Line by William Shotts", "Linux Journey tutorials");
            projects = Arrays.asList("Shell script to backup folders and push reports");
        } else if (key.contains("python")) {
            importance = "Critical";
            topics = Arrays.asList("Python Syntax, Loops, and Functions", "Data analysis with Pandas & NumPy", "File and API parsing", "Virtual environments configuration");
            resources = Arrays.asList("Real Python tutorial paths", "Official Python Tutorial docs");
            projects = Arrays.asList("Data Parsing script analyzing CSV datasets");
        } else if (key.contains("spark")) {
            importance = "High";
            topics = Arrays.asList("Spark Distributed Computing Architecture", "DataFrames, Datasets & RDDs", "Spark SQL for big data queries", "Performance optimization & partitions");
            resources = Arrays.asList("Apache Spark Programming Guide", "Databricks academy");
            projects = Arrays.asList("Process a heavy logging dataset on local cluster");
        } else {
            // Default fallback
            importance = "Medium";
            topics = Arrays.asList(skillName + " Basics", skillName + " Implementation", skillName + " Integration guidelines");
            resources = Arrays.asList("Official documentation for " + skillName, "Tutorial guides on " + skillName);
            projects = Arrays.asList("Build a small proof of concept project incorporating " + skillName);
        }

        return RecommendationDto.builder()
                .skillName(skillName)
                .importance(importance)
                .topics(topics)
                .resources(resources)
                .practiceProjects(projects)
                .build();
    }

    private List<RoadmapWeekDto> generateRoadmap(List<String> missingSkills) {
        List<RoadmapWeekDto> roadmap = new ArrayList<>();
        if (missingSkills.isEmpty()) {
            return roadmap;
        }

        // Sort missing skills by prerequisite order
        List<String> sortedSkills = new ArrayList<>(missingSkills);
        sortedSkills.sort((s1, s2) -> {
            int order1 = SKILL_PREREQUISITE_ORDER.getOrDefault(s1.trim().toLowerCase(), 100);
            int order2 = SKILL_PREREQUISITE_ORDER.getOrDefault(s2.trim().toLowerCase(), 100);
            return Integer.compare(order1, order2);
        });

        // Group into weekly milestones (1 skill per week, or multiple if there are too many)
        int totalSkills = sortedSkills.size();
        int weeksNeeded = totalSkills; // Map 1-to-1 if possible

        for (int i = 0; i < weeksNeeded; i++) {
            String skill = sortedSkills.get(i);
            RecommendationDto rec = generateRecommendationForSkill(skill);

            int estimatedHours = rec.getImportance().equals("Critical") ? 15 :
                                 rec.getImportance().equals("High") ? 12 : 8;

            roadmap.add(RoadmapWeekDto.builder()
                    .week("Week " + (i + 1))
                    .title("Master " + skill)
                    .topics(rec.getTopics())
                    .estimatedHours(estimatedHours)
                    .progress(0)
                    .build());
        }

        return roadmap;
    }
}
