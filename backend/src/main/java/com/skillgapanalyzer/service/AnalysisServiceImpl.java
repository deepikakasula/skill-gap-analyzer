package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.AnalysisRequestDto;
import com.skillgapanalyzer.entity.Analysis;
import com.skillgapanalyzer.repository.AnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalysisServiceImpl implements AnalysisService {

    private final AnalysisRepository analysisRepository;

    @Autowired
    public AnalysisServiceImpl(AnalysisRepository analysisRepository) {
        this.analysisRepository = analysisRepository;
    }

    @Override
    public Analysis runAnalysis(AnalysisRequestDto requestDto) {
        String skill = requestDto.getSkillName().trim().toLowerCase();
        String currentLevel = requestDto.getCurrentLevel();

        List<String> missingSkills = new ArrayList<>();
        String recommendation;
        String evaluation;

        if (skill.contains("react")) {
            evaluation = "Your React.js fundamentals are solid. To progress further, you need to master advanced state synchronization, performance tuning, and robust integration patterns.";
            missingSkills.add("React Server Components (RSC)");
            missingSkills.add("Zustand or Redux Toolkit");
            missingSkills.add("Performance Profiling & Memoization");
            missingSkills.add("Testing with MSW & React Testing Library");
            recommendation = "1. Read the official React Server Components Spec & Docs | react.dev/reference | Documentation\n" +
                    "2. Build a production-grade application using Next.js App Router | nextjs.org/learn | Hands-on Practice\n" +
                    "3. Complete Epic React: Advanced Patterns & Profiling | epicreact.dev | Course";
        } else if (skill.contains("spring boot") || skill.contains("springboot")) {
            evaluation = "You have sound knowledge of basic REST controllers and dependency injection. Target microservice communication, distributed transaction management, and reactive patterns next.";
            missingSkills.add("Spring Cloud & Config Server");
            missingSkills.add("Reactive Spring WebFlux");
            missingSkills.add("OAuth2 & JWT Security configurations");
            missingSkills.add("Distributed Tracing with Micrometer");
            recommendation = "1. Follow Spring Boot Microservices path on Spring Academy | spring.academy | Course\n" +
                    "2. Explore Spring Security Reference Manual | spring.io/projects/spring-security | Documentation\n" +
                    "3. Set up multi-container docker deployments for API gateway | docker.com | Hands-on Practice";
        } else if (skill.contains("java")) {
            evaluation = "Your Java fundamentals are established. To achieve advanced mastery, focus on concurrency frameworks, garbage collection tuning, JVM internals, and modern language features.";
            missingSkills.add("Java Concurrency & ForkJoinPool");
            missingSkills.add("JVM Memory Management & GC Tuning");
            missingSkills.add("Virtual Threads (Project Loom)");
            missingSkills.add("Custom ClassLoaders & Bytecode Manipulation");
            recommendation = "1. Read 'Effective Java' by Joshua Bloch | oracle.com/java | Course\n" +
                    "2. Complete advanced JVM internals documentation | docs.oracle.com | Documentation\n" +
                    "3. Practice profiling heap dumps using VisualVM | visualvm.github.io | Hands-on Practice";
        } else if (skill.contains("mysql") || skill.contains("sql")) {
            evaluation = "You possess core database querying and table creation skills. Focus on query indexing optimizations, execution plans, and transaction level locking settings.";
            missingSkills.add("Complex Query Query Optimization & Indexing");
            missingSkills.add("Database Partitioning & Replication");
            missingSkills.add("Transaction Isolation Levels & Lock Mechanisms");
            missingSkills.add("Stored Procedures & Custom User Functions");
            recommendation = "1. Study High Performance MySQL by Baron Schwartz | dev.mysql.com/doc | Documentation\n" +
                    "2. Practice profiling heavy nested queries using EXPLAIN | dev.mysql.com/doc | Hands-on Practice\n" +
                    "3. Take the MySQL Database Administration course | oracle.com/mysql | Course";
        } else if (skill.contains("git")) {
            evaluation = "Basic branch switching and commits are clear. Advanced workflows like interactive rebasing, hooks, cherry-picks, and clean merge strategies will boost your pipeline efficiency.";
            missingSkills.add("Interactive Rebase (git rebase -i)");
            missingSkills.add("Git Hooks configuration (husky)");
            missingSkills.add("Cherry-picking commits & conflict resolution");
            missingSkills.add("Git reflog troubleshooting & restoration");
            recommendation = "1. Read Pro Git Book by Scott Chacon | git-scm.com/book | Documentation\n" +
                    "2. Build a project utilizing automatic pre-commit linter hooks | github.com | Hands-on Practice\n" +
                    "3. Complete the Git Advanced workflow interactive exercises | learngitbranching.js.org | Course";
        } else {
            evaluation = String.format("You are evaluated as an %s in %s. To level up your competence, you should explore advanced architectures, security standards, and comprehensive testing methodologies associated with this technology.", currentLevel, requestDto.getSkillName());
            missingSkills.add(String.format("Advanced Architecture Design patterns in %s", requestDto.getSkillName()));
            missingSkills.add(String.format("Security hardening and best practices for %s", requestDto.getSkillName()));
            missingSkills.add("Performance analysis, tracing, and metric reporting");
            missingSkills.add(String.format("Unit and Integration testing frameworks for %s", requestDto.getSkillName()));
            recommendation = String.format("1. Read the official %s architecture manuals | %s.org/docs | Documentation\n" +
                    "2. Complete a capstone project implementing security and performance audits in %s | github.com/developer-learning-paths | Hands-on Practice\n" +
                    "3. Enroll in a certified advanced masterclass on %s | frontendmasters.com | Course", requestDto.getSkillName(), skill.replaceAll("[^a-z0-9]", ""), requestDto.getSkillName(), requestDto.getSkillName());
        }

        Analysis analysis = Analysis.builder()
                .skillName(requestDto.getSkillName())
                .currentLevel(currentLevel)
                .missingSkills(missingSkills)
                .recommendation(recommendation)
                .evaluation(evaluation)
                .analyzedDate(LocalDateTime.now())
                .build();

        return analysisRepository.save(analysis);
    }

    @Override
    public List<Analysis> getAllAnalyses() {
        return analysisRepository.findAll();
    }
}
