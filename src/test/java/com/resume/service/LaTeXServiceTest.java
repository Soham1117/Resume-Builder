package com.resume.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.resume.model.EducationBlock;
import com.resume.model.SkillsBlock;

class LaTeXServiceTest {

    @Test
    void testGenerateSkillsLatex() {
        LaTeXService latexService = new LaTeXService();
        
        // Create test skills
        List<SkillsBlock> skillsBlocks = new ArrayList<>();
        
        // Programming Languages
        List<String> languages = Arrays.asList("Java", "TypeScript", "C++", "JavaScript", "Python", "SQL", "HTML5", "CSS");
        skillsBlocks.add(new SkillsBlock("skills-languages", "Languages", languages));
        
        // Skills & Technologies
        List<String> technologies = Arrays.asList("Angular", "React", "OpenCV", "Git", "Docker", "AWS", "JIRA", "CI/CD", "Jest", "Lambda", "SFML", "Cloud Computing", "Agile Development", "Frontend", "Backend", "Full-Stack", "Object Oriented Programming techniques", "NodeJS", "Kubernetes");
        skillsBlocks.add(new SkillsBlock("skills-technologies", "Skills & Technologies", technologies));
        
        // Tools
        List<String> tools = Arrays.asList("VS Code", "Figma", "Adobe Photoshop", "Jupyter Notebook");
        skillsBlocks.add(new SkillsBlock("skills-tools", "Tools", tools));
        
        // Test LaTeX generation
        String skillsLatex = latexService.generateSkillsLatex(skillsBlocks);
        
        // Verify the output contains expected content
        assertNotNull(skillsLatex);
        assertFalse(skillsLatex.isEmpty());
        
        // Check that all categories are present
        assertTrue(skillsLatex.contains("\\textbf{Languages:}"));
        assertTrue(skillsLatex.contains("\\textbf{Skills \\& Technologies:}"));
        assertTrue(skillsLatex.contains("\\textbf{Tools:}"));
        
        // Check that skills are present
        assertTrue(skillsLatex.contains("Java"));
        assertTrue(skillsLatex.contains("React"));
        assertTrue(skillsLatex.contains("VS Code"));
        
        // Check LaTeX structure
        assertTrue(skillsLatex.contains("\\bulletItem{"));
        assertTrue(skillsLatex.contains("\\vspace{\\vspaceAfterBullets}"));
        
        
        
        
        
    }

    @Test
    void testGenerateEducationLatex() {
        LaTeXService latexService = new LaTeXService();
        
        // Create test education
        List<EducationBlock> educationBlocks = new ArrayList<>();
        
        // Master's degree
        educationBlocks.add(new EducationBlock(
            "1",
            "Master of Computer Science",
            "North Carolina State University",
            "Aug. 2023 -- May 2025",
            "4.0/4.0",
            "Raleigh, NC"
        ));
        
        // Bachelor's degree
        educationBlocks.add(new EducationBlock(
            "2",
            "Bachelor's of Engineering in Computer Science and Engineering",
            "Maharaja Sayajirao University of Baroda",
            "Jun 2017 -- May 2021",
            "3.97/4.0",
            "Baroda, India"
        ));
        
        // Test LaTeX generation
        String educationLatex = latexService.generateEducationLatex(educationBlocks);
        
        // Verify the output contains expected content
        assertNotNull(educationLatex);
        assertFalse(educationLatex.isEmpty());
        
        // Check that institutions are present
        assertTrue(educationLatex.contains("North Carolina State University"));
        assertTrue(educationLatex.contains("Maharaja Sayajirao University of Baroda"));
        
        // Check that degrees are present
        assertTrue(educationLatex.contains("Master of Computer Science"));
        assertTrue(educationLatex.contains("Bachelor's of Engineering in Computer Science and Engineering"));
        
        // Check that GPAs are present
        assertTrue(educationLatex.contains("GPA: 4.0/4.0"));
        assertTrue(educationLatex.contains("GPA: 3.97/4.0"));
        
        // Check that locations are present
        assertTrue(educationLatex.contains("Raleigh, NC"));
        assertTrue(educationLatex.contains("Baroda, India"));
        
        // Check LaTeX structure
        assertTrue(educationLatex.contains("\\item"));
        assertTrue(educationLatex.contains("\\begin{tabular*}"));
        assertTrue(educationLatex.contains("\\textbf{"));
        assertTrue(educationLatex.contains("\\textit{\\small"));
        
        
        
        
        
    }

    @Test
    void testGenerateEducationLatexWithEmptyList() {
        LaTeXService latexService = new LaTeXService();
        
        // Test with empty education
        String emptyEducationLatex = latexService.generateEducationLatex(new ArrayList<>());
        
        // Should return empty string
        assertEquals("", emptyEducationLatex);
    }

    @Test
    void testGenerateEducationLatexWithNullList() {
        LaTeXService latexService = new LaTeXService();
        
        // Test with null education
        String nullEducationLatex = latexService.generateEducationLatex(null);
        
        // Should return empty string
        assertEquals("", nullEducationLatex);
    }

    @Test
    void testGenerateEducationLatexWithoutGPA() {
        LaTeXService latexService = new LaTeXService();
        
        // Create test education without GPA
        List<EducationBlock> educationBlocks = new ArrayList<>();
        
        educationBlocks.add(new EducationBlock(
            "1",
            "Bachelor of Science",
            "Test University",
            "2018 -- 2022",
            null, // No GPA
            "Test City, State"
        ));
        
        // Test LaTeX generation
        String educationLatex = latexService.generateEducationLatex(educationBlocks);
        
        // Verify the output
        assertNotNull(educationLatex);
        assertFalse(educationLatex.isEmpty());
        
        // Check that degree is present
        assertTrue(educationLatex.contains("Bachelor of Science"));
        
        // Check that GPA is not present
        assertFalse(educationLatex.contains("GPA:"));
        
        
        
        
        
    }

    @Test
    void testGenerateSkillsLatexWithEmptyList() {
        LaTeXService latexService = new LaTeXService();
        
        // Test with empty skills
        String emptySkillsLatex = latexService.generateSkillsLatex(new ArrayList<>());
        
        // Should return empty string
        assertEquals("", emptySkillsLatex);
    }

    @Test
    void testGenerateSkillsLatexWithNullList() {
        LaTeXService latexService = new LaTeXService();
        
        // Test with null skills
        String nullSkillsLatex = latexService.generateSkillsLatex(null);
        
        // Should return empty string
        assertEquals("", nullSkillsLatex);
    }

    @Test
    void testGenerateSkillsLatexWithSpecialCharacters() {
        LaTeXService latexService = new LaTeXService();
        
        // Create test skills with special characters
        List<SkillsBlock> skillsBlocks = new ArrayList<>();
        
        List<String> specialSkills = Arrays.asList("C++", "C#", "ASP.NET", "Node.js", "React.js", "SQL Server", "Git & GitHub");
        skillsBlocks.add(new SkillsBlock("skills-special", "Programming Languages", specialSkills));
        
        // Test LaTeX generation
        String skillsLatex = latexService.generateSkillsLatex(skillsBlocks);
        
        // Verify the output is properly escaped
        assertNotNull(skillsLatex);
        assertFalse(skillsLatex.isEmpty());
        
        // Print the actual output to see what it looks like
        
        
        
        
        
        // Check that the output contains the skills (they should be properly escaped)
        assertTrue(skillsLatex.contains("C++")); // C++ should be present
        assertTrue(skillsLatex.contains("C\\#")); // C# should be escaped
        assertTrue(skillsLatex.contains("ASP.NET")); // ASP.NET should be present
        assertTrue(skillsLatex.contains("Node.js")); // Node.js should be present
        assertTrue(skillsLatex.contains("React.js")); // React.js should be present
        assertTrue(skillsLatex.contains("SQL Server")); // SQL Server should be fine
        assertTrue(skillsLatex.contains("Git \\& GitHub")); // Git & GitHub should be escaped
    }
} 