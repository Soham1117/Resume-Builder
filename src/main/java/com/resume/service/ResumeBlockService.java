package com.resume.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.model.Education;
import com.resume.model.EducationBlock;
import com.resume.model.Experience;
import com.resume.model.Project;
import com.resume.model.ResumeBlock;
import com.resume.model.ResumeData;
import com.resume.model.ScoredBlock;
import com.resume.model.Skill;
import com.resume.model.SkillsBlock;
import com.resume.model.User;
import com.resume.repository.UserRepository;

@Service
public class ResumeBlockService {

    @Value("${resume.max.experiences:3}")
    private int maxExperiences;

    @Value("${resume.max.projects:3}")
    private int maxProjects;


    @Autowired
    private ResumeBlockEmbedder embedder;

    @Autowired
    private KeywordMatchingService keywordService;

    @Autowired
    private ExperienceService experienceService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private SkillService skillService;

    @Autowired
    private EducationService educationService;

    @Autowired
    private UserRepository userRepository;

    private ResumeData resumeData;

    /**
     * Load resume blocks from database for a specific user
     */
    public ResumeData loadResumeBlocks(String username) {
        try {
           
            // Load experiences from database with bullets and technologies eagerly loaded
            List<Experience> experiences = experienceService.getAllExperiencesWithDetails(username);
            List<ResumeBlock> experienceBlocks = convertExperiencesToResumeBlocks(experiences);

            // Load projects from database
            List<Project> projects = projectService.getAllProjects(username);
            List<ResumeBlock> projectBlocks = convertProjectsToResumeBlocks(projects);

            // Load skills from database
            List<Skill> skills = skillService.getAllSkills(username);
            List<SkillsBlock> skillsBlocks = convertSkillsToSkillsBlocks(skills);

            // Load education from database
            List<Education> education = educationService.getAllEducation(username);
            List<EducationBlock> educationBlocks = convertEducationToEducationBlocks(education);

            // Create ResumeData object
            ResumeData data = new ResumeData();
            data.setExperiences(experienceBlocks);
            data.setProjects(projectBlocks);
            data.setSkills(skillsBlocks);
            data.setEducation(educationBlocks);

            return data;
        } catch (Exception e) {
            throw new RuntimeException("Failed to load resume blocks from database", e);
        }
    }

    /**
     * Load resume blocks from database for a specific user ID
     */
    public ResumeData loadResumeBlocksByUserId(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

            // Load experiences from database with bullets and technologies eagerly loaded
            List<Experience> experiences = experienceService.getAllExperiencesWithDetails(user.getUsername());
            List<ResumeBlock> experienceBlocks = convertExperiencesToResumeBlocks(experiences);

            // Load projects from database
            List<Project> projects = projectService.getAllProjects(user.getUsername());
            List<ResumeBlock> projectBlocks = convertProjectsToResumeBlocks(projects);

            // Load skills from database
            List<Skill> skills = skillService.getAllSkills(user.getUsername());
            List<SkillsBlock> skillsBlocks = convertSkillsToSkillsBlocks(skills);

            // Load education from database
            List<Education> education = educationService.getAllEducation(user.getUsername());
            List<EducationBlock> educationBlocks = convertEducationToEducationBlocks(education);

            // Create ResumeData object
            ResumeData data = new ResumeData();
            data.setExperiences(experienceBlocks);
            data.setProjects(projectBlocks);
            data.setSkills(skillsBlocks);
            data.setEducation(educationBlocks);

            return data;
        } catch (Exception e) {
            throw new RuntimeException("Failed to load resume blocks from database", e);
        }
    }

    /**
     * Convert database Experience entities to ResumeBlock objects
     */
    private List<ResumeBlock> convertExperiencesToResumeBlocks(List<Experience> experiences) {
        return experiences.stream()
                .map(this::convertExperienceToResumeBlock)
                .collect(Collectors.toList());
    }

    /**
     * Convert database Project entities to ResumeBlock objects
     */
    private List<ResumeBlock> convertProjectsToResumeBlocks(List<Project> projects) {
        return projects.stream()
                .map(this::convertProjectToResumeBlock)
                .collect(Collectors.toList());
    }

    /**
     * Convert a single Experience entity to ResumeBlock
     */
    private ResumeBlock convertExperienceToResumeBlock(Experience experience) {
        // Convert experience bullets to lines and handle links (handle null collection)
        List<String> lines = new ArrayList<>();
        if (experience.getBullets() != null) {
            for (var bullet : experience.getBullets().stream()
                    .sorted((b1, b2) -> Integer.compare(b1.getOrderIndex(), b2.getOrderIndex()))
                    .collect(Collectors.toList())) {
                String line = bullet.getBulletText();
                // Add link indicator if bullet has a link
                if (bullet.getLink() != null && !bullet.getLink().trim().isEmpty()) {
                    line = line + " [LINK: " + bullet.getLink() + "]";
                }
                lines.add(line);
            }
        }

        // Convert experience technologies to tags (handle null collection)
        List<String> tags = experience.getTechnologies() != null ? 
                experience.getTechnologies().stream()
                        .map(tech -> tech.getTechnology())
                        .collect(Collectors.toList()) : 
                new ArrayList<>();

        // Create ResumeBlock
        ResumeBlock block = new ResumeBlock(
                experience.getId().toString(),
                experience.getTitle(),
                experience.getCompany(),
                experience.getLocation(),
                experience.getDateRange(),
                tags,
                lines,
                experience.getPriority() != null ? experience.getPriority() | 5 : 5
        );

        return block;
    }

    /**
     * Convert a single Project entity to ResumeBlock
     */
    private ResumeBlock convertProjectToResumeBlock(Project project) {
        // Convert project bullets to lines
        List<String> lines = project.getBullets().stream()
                .sorted((b1, b2) -> Integer.compare(b1.getOrderIndex(), b2.getOrderIndex()))
                .map(bullet -> bullet.getBulletText())
                .collect(Collectors.toList());

        // Convert project technologies to tags
        List<String> tags = project.getTechnologiesList().stream()
                .map(tech -> tech.getTechnology())
                .collect(Collectors.toList());

        // Create ResumeBlock
        ResumeBlock block = new ResumeBlock(
                project.getId().toString(),
                project.getTitle(),
                project.getTechnologies(),
                project.getLink(),
                tags,
                lines,
                project.getPriority() != null ? project.getPriority() | 5 : 5
        );

        return block;
    }

    /**
     * Convert Skill list to SkillsBlock list
     */
    private List<SkillsBlock> convertSkillsToSkillsBlocks(List<Skill> skills) {
        if (skills == null || skills.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Group skills by category
        Map<String, List<Skill>> skillsByCategory = skills.stream()
                .collect(Collectors.groupingBy(Skill::getCategory));
        
        List<SkillsBlock> skillsBlocks = new ArrayList<>();
        
        for (Map.Entry<String, List<Skill>> entry : skillsByCategory.entrySet()) {
            String category = entry.getKey();
            List<Skill> categorySkills = entry.getValue();
            
            // Sort by order index
            categorySkills.sort((s1, s2) -> Integer.compare(s1.getOrderIndex(), s2.getOrderIndex()));
            
            // Extract skill names
            List<String> skillNames = categorySkills.stream()
                    .map(Skill::getSkillName)
                    .collect(Collectors.toList());
            
            SkillsBlock block = new SkillsBlock("skills-" + category, category, skillNames);
            skillsBlocks.add(block);
        }
        
        return skillsBlocks;
    }

    /**
     * Convert Education list to EducationBlock list
     */
    private List<EducationBlock> convertEducationToEducationBlocks(List<Education> education) {
        if (education == null || education.isEmpty()) {
            return new ArrayList<>();
        }
        
        return education.stream()
                .map(edu -> new EducationBlock(
                    edu.getId().toString(),
                    edu.getDegree(),
                    edu.getInstitution(),
                    edu.getDateRange(),
                    edu.getGpa(),
                    edu.getLocation()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Legacy method for backward compatibility - loads from JSON file
     * @deprecated Use loadResumeBlocks(String username) instead
     */
    @Deprecated
    public ResumeData loadResumeBlocks() {
        if (resumeData == null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                ClassPathResource resource = new ClassPathResource("resume_blocks.json");
                resumeData = mapper.readValue(resource.getInputStream(), ResumeData.class);
            } catch (IOException e) {
                throw new RuntimeException("Failed to load resume blocks", e);
            }
        }
        return resumeData;
    }

    public List<ResumeBlock> selectTopExperiences(List<ResumeBlock> experiences, String jobDescription) {
        // Use vector embeddings to score and rank experiences, preserving all data
        List<ScoredBlock> scoredExperiences = embedder.scoreBlocksWithEmbeddings(experiences, jobDescription, keywordService);
        
        // Return top experiences up to maxExperiences, preserving original ResumeBlock data
        return scoredExperiences.stream()
                .limit(maxExperiences)
                .map(ScoredBlock::getBlock)
                .collect(Collectors.toList());
    }

    public List<ResumeBlock> selectTopProjects(List<ResumeBlock> projects, String jobDescription) {
        // Use vector embeddings to score and rank projects
        List<ScoredBlock> scoredProjects = embedder.scoreBlocksWithEmbeddings(projects, jobDescription, keywordService);
        
        // Return top projects up to maxProjects
        return scoredProjects.stream()
                .limit(maxProjects)
                .map(ScoredBlock::getBlock)
                .collect(Collectors.toList());
    }

 
    // Legacy methods for backward compatibility
    public List<ResumeBlock> selectTopExperiences(List<ResumeBlock> experiences, Set<String> keywords) {
        // Convert keywords back to job description for embedding service
        String jobDescription = String.join(" ", keywords);
        return selectTopExperiences(experiences, jobDescription);
    }

    public List<ResumeBlock> selectTopProjects(List<ResumeBlock> projects, Set<String> keywords) {
        // Convert keywords back to job description for embedding service
        String jobDescription = String.join(" ", keywords);
        return selectTopProjects(projects, jobDescription);
    }

    // Utility methods for monitoring
    public int getEmbeddingCacheSize() {
        return embedder.getCacheSize();
    }

    public void clearEmbeddingCache() {
        embedder.clearCache();
    }
} 