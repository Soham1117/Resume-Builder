package com.resume.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

@Service
public class PDFService {

    @Value("${resume.pdf.output-dir:./generated-pdfs}")
    private String outputDir;

    @Value("${resume.pdf.temp-dir:./temp-latex}")
    private String tempDir;

    @Value("${resume.pdf.latex-timeout:30}")
    private int latexTimeout;

    @Value("${resume.pdf.cleanup-temp:true}")
    private boolean cleanupTemp;

    public String generatePDFFromLatex(String latexContent, String candidateName) throws IOException {
        String fileName = generateFileName(candidateName);
        Path outputPath = Paths.get(outputDir, fileName);
        
        // Ensure output directory exists and has proper permissions
        Path outputDirPath = Paths.get(outputDir);
        if (!Files.exists(outputDirPath)) {
            Files.createDirectories(outputDirPath);
        }
        outputDirPath.toFile().setWritable(true, false);
        
        // Try LaTeX compilation first
        try {
            return generatePDFWithLatex(latexContent, fileName, outputPath);
        } catch (IOException e) {
            System.err.println("LaTeX compilation failed, falling back to simple PDF: " + e.getMessage());
            // Fall back to simple PDF generation
            return generateSimplePDF(latexContent, candidateName, fileName, outputPath);
        }
    }
    
    private String generatePDFWithLatex(String latexContent, String fileName, Path outputPath) throws IOException {
        // Create temporary directory for LaTeX compilation
        Path tempPath = createTempDirectory();
        String tempFileName = "resume_" + UUID.randomUUID().toString().substring(0, 8);
        Path texFilePath = tempPath.resolve(tempFileName + ".tex");
        
        try {
            // Write LaTeX content to temporary file
            writeLatexFile(texFilePath, latexContent);
            
            // Compile LaTeX to PDF
            boolean compilationSuccess = compileLatexToPDF(tempPath, tempFileName);
            
            if (!compilationSuccess) {
                throw new IOException("LaTeX compilation failed. Check the LaTeX syntax.");
            }
            
            // Move generated PDF to output directory
            Path generatedPdfPath = tempPath.resolve(tempFileName + ".pdf");
            if (!Files.exists(generatedPdfPath)) {
                throw new IOException("PDF file was not generated during LaTeX compilation.");
            }
            
            Files.move(generatedPdfPath, outputPath);
            
            return "/resume/pdf/preview/" + fileName;
            
        } finally {
            // Clean up temporary files
            if (cleanupTemp) {
                cleanupTempDirectory(tempPath);
            }
        }
    }
    
    private String generateSimplePDF(String latexContent, String candidateName, String fileName, Path outputPath) throws IOException {
        // Create a simple PDF with the content using PDFBox
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText(candidateName + " - Resume");
                contentStream.endText();
                
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                contentStream.endText();
                
                // Add LaTeX content as text (simplified)
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(50, 680);
                
                String[] lines = latexContent.split("\n");
                int yPosition = 680;
                for (String line : lines) {
                    if (yPosition < 50) break; // Prevent overflow
                    if (line.trim().length() > 0) {
                        contentStream.newLineAtOffset(0, -15);
                        contentStream.showText(line.substring(0, Math.min(line.length(), 80)));
                        yPosition -= 15;
                    }
                }
                contentStream.endText();
            }
            
            document.save(outputPath.toString());
        }
        
        return "/resume/pdf/preview/" + fileName;
    }
    
    private Path createTempDirectory() throws IOException {
        Path tempPath = Paths.get(tempDir, "latex_" + UUID.randomUUID().toString().substring(0, 8));
        Files.createDirectories(tempPath);
        
        // Ensure the directory has proper write permissions
        tempPath.toFile().setWritable(true, false); // Make writable for all users
        
        // Test write permissions by creating a test file
        Path testFile = tempPath.resolve("test_write.tmp");
        try {
            Files.write(testFile, "test".getBytes());
            Files.delete(testFile);
        } catch (IOException e) {
            throw new IOException("Cannot write to temporary directory: " + tempPath, e);
        }
        
        return tempPath;
    }
    
    private void writeLatexFile(Path texFilePath, String latexContent) throws IOException {
        // Ensure the parent directory exists and is writable
        Path parentDir = texFilePath.getParent();
        if (!Files.exists(parentDir)) {
            Files.createDirectories(parentDir);
        }
        
        // Set write permissions on the parent directory
        parentDir.toFile().setWritable(true, false);
        
        try (BufferedWriter writer = Files.newBufferedWriter(texFilePath)) {
            writer.write(latexContent);
        }
        
        // Ensure the file is readable
        texFilePath.toFile().setReadable(true, false);
    }
    
    private boolean compileLatexToPDF(Path tempPath, String fileName) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        
        // Set up the LaTeX compilation command
        // Try pdflatex first, then xelatex as fallback
        String[] commands = {
            "pdflatex",
            "-interaction=nonstopmode",
            fileName + ".tex"
        };
        
        processBuilder.command(commands);
        processBuilder.directory(tempPath.toFile());
        
        // Capture both stdout and stderr
        processBuilder.redirectErrorStream(true);
        
        Process process = null;
        try {
            process = processBuilder.start();
            
            // Wait for compilation with timeout
            boolean finished = process.waitFor(latexTimeout, TimeUnit.SECONDS);
            
            if (!finished) {
                process.destroyForcibly();
                throw new IOException("LaTeX compilation timed out after " + latexTimeout + " seconds.");
            }
            
            int exitCode = process.exitValue();
            
            // Read the output for debugging
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                StringBuilder output = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            // Check if PDF was generated successfully
            Path pdfPath = tempPath.resolve(fileName + ".pdf");
            if (Files.exists(pdfPath) && Files.size(pdfPath) > 0) {
                return true;
            }
            
            // If pdflatex failed, try xelatex as fallback
            if (exitCode != 0) {
                return tryXeLatex(tempPath, fileName);
            }
            
            return false;
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("LaTeX compilation was interrupted.", e);
        } finally {
            if (process != null) {
                process.destroyForcibly();
            }
        }
    }
    
    private boolean tryXeLatex(Path tempPath, String fileName) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        
        String[] commands = {
            "xelatex",
            "-interaction=nonstopmode",
            fileName + ".tex"
        };
        
        processBuilder.command(commands);
        processBuilder.directory(tempPath.toFile());
        processBuilder.redirectErrorStream(true);
        
        Process process = null;
        try {
            process = processBuilder.start();
            
            boolean finished = process.waitFor(latexTimeout, TimeUnit.SECONDS);
            
            if (!finished) {
                process.destroyForcibly();
                return false;
            }
            
            
            
            // Read the output for debugging
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                StringBuilder output = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            // Check if PDF was generated successfully
            Path pdfPath = tempPath.resolve(fileName + ".pdf");
            return Files.exists(pdfPath) && Files.size(pdfPath) > 0;
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        } finally {
            if (process != null) {
                process.destroyForcibly();
            }
        }
    }
    
    private void cleanupTempDirectory(Path tempPath) {
        try {
            // Delete all files in the temp directory
            Files.walk(tempPath)
                .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                .forEach(path -> {
                    try {
                        Files.deleteIfExists(path);
                    } catch (IOException e) {
                        System.err.println("Failed to delete temp file: " + path + " - " + e.getMessage());
                    }
                });
        } catch (IOException e) {
            System.err.println("Failed to cleanup temp directory: " + tempPath + " - " + e.getMessage());
        }
    }
    
    private String generateFileName(String candidateName) {
        String sanitizedName = candidateName.replaceAll("[^a-zA-Z0-9]", "_");
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        return sanitizedName + "_" + timestamp + ".pdf";
    }
    
    public Resource loadPDFAsResource(String fileName) throws IOException {
        Path filePath = Paths.get(outputDir, fileName);
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists()) {
            return resource;
        } else {
            throw new IOException("PDF file not found: " + fileName);
        }
    }
    
    /**
     * Check if LaTeX compiler is available on the system
     */
    public boolean isLatexAvailable() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("pdflatex", "--version");
            Process process = processBuilder.start();
            boolean finished = process.waitFor(5, TimeUnit.SECONDS);
            
            if (finished && process.exitValue() == 0) {
                return true;
            }
            
            // Try xelatex as fallback
            processBuilder = new ProcessBuilder("xelatex", "--version");
            process = processBuilder.start();
            finished = process.waitFor(5, TimeUnit.SECONDS);
            
            return finished && process.exitValue() == 0;
            
        } catch (IOException | InterruptedException e) {
            return false;
        }
    }
    
    /**
     * Get LaTeX compiler information
     */
    public String getLatexCompilerInfo() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("pdflatex", "--version");
            Process process = processBuilder.start();
            boolean finished = process.waitFor(5, TimeUnit.SECONDS);
            
            if (finished && process.exitValue() == 0) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream()))) {
                    String firstLine = reader.readLine();
                    return "pdflatex: " + (firstLine != null ? firstLine : "Available");
                }
            }
            
            // Try xelatex
            processBuilder = new ProcessBuilder("xelatex", "--version");
            process = processBuilder.start();
            finished = process.waitFor(5, TimeUnit.SECONDS);
            
            if (finished && process.exitValue() == 0) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream()))) {
                    String firstLine = reader.readLine();
                    return "xelatex: " + (firstLine != null ? firstLine : "Available");
                }
            }
            
            return "No LaTeX compiler found";
            
        } catch (IOException | InterruptedException e) {
            return "Error checking LaTeX compiler: " + e.getMessage();
        }
    }
} 