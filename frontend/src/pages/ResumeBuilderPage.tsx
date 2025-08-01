import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Code,
  Award,
  Eye,
  Lightbulb,
  X,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/layout/Sidebar";
import ContentLibrary from "../components/dragdrop/ContentLibrary";
import ResumePreview from "../components/resume/ResumePreview";
import JobDescriptionInput from "../components/forms/JobDescriptionInput";
import PersonalInfoForm from "../components/forms/PersonalInfoForm";
import EducationForm from "../components/forms/EducationForm";
import SkillsForm from "../components/forms/SkillsForm";
import CertificationsForm from "../components/forms/CertificationsForm";
import ExperienceForm from "../components/forms/ExperienceForm";
import ProjectForm from "../components/forms/ProjectForm";
import DraggableItem from "../components/dragdrop/DraggableItem";
import DemoWalkthrough from "../components/DemoWalkthrough";
import DemoRestartButton from "../components/DemoRestartButton";
import DemoWelcomeMessage from "../components/DemoWelcomeMessage";
import { useApi } from "../hooks/useApi";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { useDataPersistence } from "../hooks/useDataPersistence";
import { useAuth } from "../hooks/useAuth";
import { useDemo } from "../context/DemoContext";
import { transformResumeBlocksToContentItems } from "../utils/dataTransform";
import type {
  ContentItem,
  JobAnalysisResponse,
  AnalysisResult,
  PersonalInfo,
  EducationBlock,
  SkillsBlock,
  CertificationBlock,
} from "../types";
import Card from "../components/ui/Card";
import DropZone from "../components/dragdrop/DropZone";
import Header from "../components/layout/Header";

// Sidebar sections configuration
const sidebarSections = [
  {
    id: "job-analysis",
    title: "Job Analysis",
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    id: "personal",
    title: "Personal Info",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "experience",
    title: "Experience",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    id: "projects",
    title: "Projects",
    icon: <FolderOpen className="h-5 w-5" />,
  },
  {
    id: "education",
    title: "Education",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: "skills",
    title: "Skills",
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: "certifications",
    title: "Certifications",
    icon: <Award className="h-5 w-5" />,
  },
];

const ResumeBuilderPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("job-analysis");
  const [isResizing, setIsResizing] = useState(false);

  // Panel visibility states
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isContentLibraryVisible, setIsContentLibraryVisible] = useState(true);

  // Panel widths
  const [mainPanelWidth, setMainPanelWidth] = useState(40);
  const [contentLibraryWidth, setContentLibraryWidth] = useState(20);
  const [previewPanelWidth, setPreviewPanelWidth] = useState(40);

  // Normalized data state is now managed by useDataPersistence hook

  const [analysisResult, setAnalysisResult] =
    useState<JobAnalysisResponse | null>(null);
  const [suggestedExperiences, setSuggestedExperiences] = useState<
    ContentItem[]
  >([]);
  const [suggestedProjects, setSuggestedProjects] = useState<ContentItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [temporarySkills, setTemporarySkills] = useState<string[]>([]);

  // API hook
  const { getResumeBlocks } = useApi();

  // Auth hook
  const { logout } = useAuth();

  // Drag and drop functionality
  const { dragState, startDrag, endDrag } = useDragAndDrop();

  // Demo functionality
  const { isDemoActive, currentStep, demoSteps } = useDemo();

  // Data persistence hook - moved before conversion functions
  const {
    isLoading: isSaving,
    loadAllData,
    hasStoredData,
    normalizedPersonalInfo,
    experiences,
    projects,
    skills,
    certifications,
    education,
    saveJobAnalysisSession,
    loadJobAnalysisSession,
  } = useDataPersistence(
    {
      experiences: [],
      projects: [],
      education: [],
      skills: [],
      certifications: [],
    }, // Empty initial data
    {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    }, // Empty initial personal info
    suggestedExperiences,
    suggestedProjects,
    analysisResult
  );

  // Use the data from the hook, with fallbacks
  const personalInfo = normalizedPersonalInfo || {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
  };

  // Convert normalized data to legacy format for ResumePreview - now after hook call
  const convertPersonalInfo = (): PersonalInfo => ({
    name: personalInfo.name || "",
    email: personalInfo.email || "",
    phone: personalInfo.phone || "",
    location: personalInfo.location || "",
    linkedin: personalInfo.linkedin || "",
    portfolio: personalInfo.portfolio || "",
  });

  const convertExperiences = useCallback((): ContentItem[] => {
    return experiences.map((exp) => ({
      id: exp.id?.toString() || "",
      type: "experience" as const,
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      dateRange: exp.dateRange || "",
      description: exp.description || "",
      bulletPoints: exp.bullets?.map((b) => b.bulletText) || [],
      category: "Work Experience",
      tags: exp.technologies?.map((t) => t.technology) || [],
      technologies: exp.technologies?.map((t) => t.technology) || [],
    }));
  }, [experiences]);

  const convertProjects = useCallback((): ContentItem[] => {
    return projects.map((proj) => ({
      id: proj.id?.toString() || "",
      type: "project" as const,
      title: proj.title,
      technologies: proj.technologiesList?.map((t) => t.technology) || [],
      description: "",
      bulletPoints: proj.bullets?.map((b) => b.bulletText) || [],
      dateRange: "",
      link: proj.link || "",
      category: "Projects",
      tags: proj.technologiesList?.map((t) => t.technology) || [],
    }));
  }, [projects]);

  const convertEducation = (): EducationBlock[] => {
    return education.map((edu) => ({
      id: edu.id?.toString() || "",
      degree: edu.degree,
      institution: edu.institution,
      dateRange: edu.dateRange || "",
      gpa: edu.gpa || "",
      location: edu.location || "",
    }));
  };

  const convertSkills = (): SkillsBlock[] => {
    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill.skillName);
      return acc;
    }, {} as Record<string, string[]>);

    // Append temporary skills to existing "Skills & Technologies" category or create it
    if (temporarySkills.length > 0) {
      if (skillsByCategory["Skills & Technologies"]) {
        skillsByCategory["Skills & Technologies"] = [...skillsByCategory["Skills & Technologies"], ...temporarySkills];
      } else {
        skillsByCategory["Skills & Technologies"] = temporarySkills;
      }
    }

    return Object.entries(skillsByCategory).map(
      ([category, skillList], index) => ({
        id: `skills-${index}`,
        category,
        skills: skillList,
      })
    );
  };

  const convertCertifications = (): CertificationBlock[] => {
    return certifications.map((cert) => ({
      id: cert.id?.toString() || "",
      name: cert.name,
      issuer: cert.issuer,
      date: cert.dateObtained || "",
      link: cert.link || "",
    }));
  };

  // Handler functions - defined before useEffect to avoid dependency issues
  const handleLoadData = useCallback(() => {
    loadAllData();
  }, [loadAllData]);

  const handleClearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setSuggestedExperiences([]);
    setSuggestedProjects([]);
    setAnalysis(null);
    setTemporarySkills([]); // Clear temporary skills

    // Clear job analysis session from localStorage
    saveJobAnalysisSession(null);

    // Clear job description text from localStorage
    try {
      localStorage.removeItem("jobDescriptionText");
    } catch (error) {
      console.error("Error clearing job description:", error);
    }

    toast.success("Analysis cleared");
  }, [saveJobAnalysisSession]);

  // Load content items for job analysis
  const loadContentItems = useCallback(async () => {
    try {
      // Only load from legacy endpoint if we don't have normalized data
      if (experiences.length === 0 && projects.length === 0) {
        const blocks = await getResumeBlocks();
        if (blocks) {
          const items = transformResumeBlocksToContentItems([
            ...blocks.experiences,
            ...blocks.projects,
          ]);

          setContentItems(items);
        }
      } else {
        // Use normalized data for content items
        const normalizedItems = [...convertExperiences(), ...convertProjects()];
        setContentItems(normalizedItems);
      }
    } catch (error) {
      console.error("Error loading content items:", error);
      toast.error("Failed to load content items");
    }
  }, [
    getResumeBlocks,
    experiences.length,
    projects.length,
    convertExperiences,
    convertProjects,
  ]);

  // Load initial data - only run once when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load content items for job analysis
        await loadContentItems();

        // Check if user has existing data
        if (hasStoredData) {
          await loadAllData(false); // Don't show toasts for initial loading
        }

        // Load job analysis session from localStorage
        const savedAnalysis = loadJobAnalysisSession();
        if (savedAnalysis) {
          setAnalysisResult(savedAnalysis);
          setSuggestedExperiences(savedAnalysis.selectedExperiences || []);
          setSuggestedProjects(savedAnalysis.selectedProjects || []);
          setAnalysis(savedAnalysis.analysis);
          // Job analysis session restored from localStorage
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load initial data");
      }
    };

    loadInitialData();
  }, []); // Empty dependency array - only run once on mount

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S to save - removed since individual forms handle their own saving

      // Ctrl/Cmd + L to load
      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        handleLoadData();
      }

      // Escape to clear analysis
      if (event.key === "Escape" && analysisResult) {
        handleClearAnalysis();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [analysisResult, handleLoadData, handleClearAnalysis]);

  // Auto-switch sections during demo
  useEffect(() => {
    if (isDemoActive && demoSteps[currentStep]?.targetSection) {
      setActiveSection(demoSteps[currentStep].targetSection!);
    }
  }, [isDemoActive, currentStep, demoSteps]);

  // Handler functions
  const handleExport = () => {
    // Export functionality
    toast.success("Export feature coming soon!");
  };

  const handleSettings = () => {
    // Settings functionality
    toast.success("Settings feature coming soon!");
  };

  const handleLogout = () => {
    // Clear all session data
    try {
      localStorage.removeItem("jobAnalysisSession");
      localStorage.removeItem("jobDescriptionText");
      localStorage.removeItem("connectionState");
    } catch (error) {
      console.error("Error clearing session data:", error);
    }

    // Call the logout function from AuthContext
    logout();

    toast.success("Logged out successfully");
  };

  const handleContentSelect = (item: ContentItem) => {
    // Handle content selection for job analysis
    if (analysisResult) {
      const isExperience = item.type === "experience";
      const currentList = isExperience
        ? suggestedExperiences
        : suggestedProjects;
      const setList = isExperience
        ? setSuggestedExperiences
        : setSuggestedProjects;

      const isAlreadySelected = currentList.some(
        (selected) => selected.id === item.id
      );

      if (isAlreadySelected) {
        // Remove from suggestions
        const newList = currentList.filter(
          (selected) => selected.id !== item.id
        );
        setList(newList);
        updateAnalysisResult(newList, isExperience);
        toast.success(`${item.title} removed from suggestions`);
      } else {
        // Add to suggestions (respect 3-item limit)
        if (currentList.length >= 3) {
          toast.error(
            `Maximum 3 ${
              isExperience ? "experiences" : "projects"
            } allowed. Remove one first or drag to replace.`
          );
          return;
        }
        const newList = [...currentList, item];
        setList(newList);
        updateAnalysisResult(newList, isExperience);
        toast.success(`${item.title} added to suggestions`);
      }
    }
  };

  const handleJobAnalysis = () => {
    // Job analysis functionality
    toast.success("Job analysis started!");
  };

  const handleAnalysisComplete = (result: JobAnalysisResponse) => {
    setAnalysisResult(result);
    setSuggestedExperiences(result.selectedExperiences);
    setSuggestedProjects(result.selectedProjects);
    setAnalysis(result.analysis);

    // Reset temporary skills for new job analysis
    setTemporarySkills([]);

    // Save job analysis session to localStorage
    saveJobAnalysisSession(result);

    toast.success("Job analysis completed!");
  };

  // Handle adding temporary skills (not saved to database)
  const handleAddTemporarySkill = (skillName: string) => {
    if (!temporarySkills.includes(skillName)) {
      setTemporarySkills([...temporarySkills, skillName]);
      toast.success(`${skillName} added to resume`);
    } else {
      toast.success(`${skillName} is already added`);
    }
  };

  const handleAddAllTemporarySkills = () => {
    if (analysis?.suggestedSkills) {
      const newSkills = analysis.suggestedSkills.filter(
        (skill) => !temporarySkills.includes(skill)
      );
      setTemporarySkills([...temporarySkills, ...newSkills]);
      toast.success(`${newSkills.length} skills added to resume`);
    }
  };

  const handleRemoveTemporarySkill = (skillName: string) => {
    setTemporarySkills(temporarySkills.filter((skill) => skill !== skillName));
    toast.success(`${skillName} removed from resume`);
  };

  // Helper function to update analysis result when suggestions change
  const updateAnalysisResult = (
    newList: ContentItem[],
    isExperience: boolean
  ) => {
    if (analysisResult) {
      const updatedResult = {
        ...analysisResult,
        selectedExperiences: isExperience
          ? newList
          : analysisResult.selectedExperiences,
        selectedProjects: isExperience
          ? analysisResult.selectedProjects
          : newList,
      };
      setAnalysisResult(updatedResult);
    }
  };

  const handleContentDrop = (
    item: ContentItem,
    dropZoneId: string,
    dropEvent?: React.DragEvent
  ) => {
    if (!dropEvent) return;

    // Only handle suggested zones
    if (!dropZoneId.startsWith("suggested-")) return;

    const isExperience = item.type === "experience";
    const isExperienceZone = dropZoneId === "suggested-experiences";
    const isProjectZone = dropZoneId === "suggested-projects";

    // Ensure item type matches zone type
    if (
      (isExperience && !isExperienceZone) ||
      (!isExperience && !isProjectZone)
    ) {
      toast.error(
        `Cannot add ${item.type} to ${
          isExperienceZone ? "experiences" : "projects"
        } section`
      );
      return;
    }

    const currentList = isExperience ? suggestedExperiences : suggestedProjects;
    const setList = isExperience
      ? setSuggestedExperiences
      : setSuggestedProjects;

    // Check for uniqueness
    const isDuplicate = currentList.some((existing) => existing.id === item.id);
    if (isDuplicate) {
      toast.error(`${item.title} is already in suggestions`);
      return;
    }

    // Smart add/replace logic
    if (currentList.length < 3) {
      // Add to the end if less than 3 items
      const newList = [...currentList, item];
      setList(newList);
      updateAnalysisResult(newList, isExperience);
      toast.success(`${item.title} added to suggestions`);
    } else {
      // Replace item at hover position if at capacity (3 items)
      const targetIndex = findItemUnderMouse(dropEvent);
      const validIndex = Math.max(
        0,
        Math.min(targetIndex, currentList.length - 1)
      );
      const replacedItem = currentList[validIndex];

      const newList = [...currentList];
      newList[validIndex] = item;
      setList(newList);
      updateAnalysisResult(newList, isExperience);
      toast.success(`${item.title} replaced ${replacedItem.title}`);
    }
  };

  const findItemUnderMouse = (dropEvent: React.DragEvent): number => {
    const dropZone = dropEvent.currentTarget;
    const dropZoneRect = dropZone.getBoundingClientRect();
    const mouseY = dropEvent.clientY - dropZoneRect.top;

    // Get all draggable items in the drop zone using the correct selector
    const draggableItems = dropZone.querySelectorAll("[data-draggable-item]");

    if (!draggableItems || draggableItems.length === 0) return 0;

    // For replacement mode (when at capacity), find which item is under the mouse
    for (let i = 0; i < draggableItems.length; i++) {
      const itemRect = draggableItems[i].getBoundingClientRect();
      const itemTop = itemRect.top - dropZoneRect.top;
      const itemCenter = itemTop + itemRect.height / 2;

      // If mouse is above the center of this item, replace this item
      if (mouseY <= itemCenter) {
        return i;
      }
    }

    // If mouse is below all items, replace the last item
    return draggableItems.length - 1;
  };

  const handleReorder = (
    item: ContentItem,
    _dropZoneId: string,
    targetIndex: number
  ) => {
    const isExperience = item.type === "experience";
    const currentList = isExperience ? suggestedExperiences : suggestedProjects;
    const setList = isExperience
      ? setSuggestedExperiences
      : setSuggestedProjects;

    // Remove item from current position
    const filteredList = currentList.filter(
      (selected) => selected.id !== item.id
    );

    // Insert at target position
    const newList = [...filteredList];
    newList.splice(targetIndex, 0, item);

    setList(newList);

    // Update analysis result
    if (analysisResult) {
      const updatedResult = {
        ...analysisResult,
        selectedExperiences: isExperience
          ? newList
          : analysisResult.selectedExperiences,
        selectedProjects: isExperience
          ? analysisResult.selectedProjects
          : newList,
      };
      setAnalysisResult(updatedResult);
    }

    toast.success(`${item.title} reordered`);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "job-analysis":
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Job Analysis
                </h2>
                <p className="text-gray-600">
                  Paste a job description to get AI-powered suggestions for your
                  resume
                </p>
              </div>

              <JobDescriptionInput
                onAnalyze={handleJobAnalysis}
                onAnalysisComplete={handleAnalysisComplete}
                onClear={handleClearAnalysis}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DropZone
                  id="suggested-experiences"
                  type="experience"
                  accepts={["experience"]}
                  onDrop={handleContentDrop}
                  onReorder={handleReorder}
                  isFull={suggestedExperiences.length >= 3}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Suggested Experiences
                      </h3>
                      <span className="text-xs text-gray-500">
                        {suggestedExperiences.length}/3
                      </span>
                    </div>
                    {suggestedExperiences.length > 0 ? (
                      suggestedExperiences.map((item, index) => (
                        <DraggableItem
                          key={item.id}
                          item={item}
                          onSelect={() => handleContentSelect(item)}
                          data-draggable-item={index}
                          sourceDropZone="suggested-experiences"
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No experiences suggested yet
                      </p>
                    )}
                  </div>
                </DropZone>

                <DropZone
                  id="suggested-projects"
                  type="project"
                  accepts={["project"]}
                  onDrop={handleContentDrop}
                  onReorder={handleReorder}
                  isFull={suggestedProjects.length >= 3}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Suggested Projects
                      </h3>
                      <span className="text-xs text-gray-500">
                        {suggestedProjects.length}/3
                      </span>
                    </div>
                    {suggestedProjects.length > 0 ? (
                      suggestedProjects.map((item, index) => (
                        <DraggableItem
                          key={item.id}
                          item={item}
                          onSelect={() => handleContentSelect(item)}
                          data-draggable-item={index}
                          sourceDropZone="suggested-projects"
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No projects suggested yet
                      </p>
                    )}
                  </div>
                </DropZone>
              </div>

              {/* Suggested Skills Section */}
              {analysis?.suggestedSkills && analysis.suggestedSkills.length > 0 && (
                <div className="mt-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Suggested Skills from Job Analysis
                      </h3>
                      <button
                        onClick={handleAddAllTemporarySkills}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Add All to Resume
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      These technical skills were identified from the job description and can be added to your resume for this specific application.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.suggestedSkills.map((skillName, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          <span>{skillName}</span>
                          <button
                            onClick={() => handleAddTemporarySkill(skillName)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Temporary Skills Section */}
              {temporarySkills.length > 0 && (
                <div className="mt-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Skills Added to Resume
                      </h3>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Will be included in PDF
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      These skills have been added to your resume for this specific job application and will be included in the PDF.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {temporarySkills.map((skillName, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          <span>{skillName}</span>
                          <button
                            onClick={() => handleRemoveTemporarySkill(skillName)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {analysisResult && (
                <Card className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Generated Content
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>LaTeX Content:</strong> Generated successfully
                    </p>
                    <p>
                      <strong>Experiences Found:</strong>{" "}
                      {suggestedExperiences.length}
                    </p>
                    <p>
                      <strong>Projects Found:</strong>{" "}
                      {suggestedProjects.length}
                    </p>
                    <p>
                      <strong>Match Score:</strong>{" "}
                      {analysis ? Math.round(analysis.matchScore * 100) : 0}%
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        );
      case "experience":
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Work Experience
                </h2>
                <p className="text-gray-600">
                  Add your work experience with detailed descriptions and
                  achievements
                </p>
              </div>

              <ExperienceForm
                experiences={experiences}
                onChange={() => {}} // Forms manage their own state
                onAutoSave={() => {
                  // Auto-save handled by form itself
                }}
                onLoad={() => {
                  // Data already loaded by parent
                }}
                onSaveComplete={async () => {
                  // Load data after save
                  await loadAllData(false);
                }}
              />
            </div>
          </div>
        );
      case "projects":
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Projects
                </h2>
                <p className="text-gray-600">
                  Showcase your projects with technologies used and key features
                </p>
              </div>

              <ProjectForm
                projects={projects}
                onChange={() => {}} // Forms manage their own state
                onAutoSave={() => {
                  // Auto-save handled by form itself
                }}
                onLoad={() => {
                  // Data already loaded by parent
                }}
                onSaveComplete={async () => {
                  // Load data after save
                  await loadAllData(false);
                }}
              />
            </div>
          </div>
        );
      case "personal":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <div className="max-w-2xl space-y-4">
              <PersonalInfoForm
                data={personalInfo}
                onChange={() => {}} // Form manages its own state
                onAutoSave={() => {
                  // Auto-save handled by form itself
                }}
                onLoad={() => {
                  // Data already loaded by parent
                }}
                onSaveComplete={async () => {
                  // Load data after save
                  await loadAllData(false);
                }}
              />
            </div>
          </div>
        );
      case "education":
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Education
                </h2>
                <p className="text-gray-600">
                  Add your educational background, degrees, and academic
                  achievements
                </p>
              </div>

              <EducationForm
                education={education}
                onChange={() => {}} // Form manages its own state
                onAutoSave={() => {
                  // Auto-save handled by form itself
                }}
                onLoad={() => {
                  // Data already loaded by parent
                }}
                onSaveComplete={async () => {
                  // Load data after save
                  await loadAllData(false);
                }}
              />
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Skills
                </h2>
                <p className="text-gray-600">
                  Organize your technical and soft skills into categories
                </p>
              </div>

              <SkillsForm
                skills={skills}
                onChange={() => {}} // Form manages its own state
                onAutoSave={() => {
                  // Auto-save handled by form itself
                }}
                onLoad={() => {
                  // Data already loaded by parent
                }}
                onSaveComplete={async () => {
                  // Load data after save
                  await loadAllData(false);
                }}
              />
            </div>
          </div>
        );
      case "certifications":
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Certifications & Achievements
                </h2>
                <p className="text-gray-600">
                  Add your certifications, awards, and professional achievements
                </p>
              </div>

              <CertificationsForm
                certifications={certifications}
                onChange={() => {}} // Form manages its own state
                onAutoSave={() => {
                  // Auto-save handled by form itself
                }}
                onLoad={() => {
                  // Data already loaded by parent
                }}
                onSaveComplete={async () => {
                  // Load data after save
                  await loadAllData(false);
                }}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Resume Builder
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Start by adding your personal information, work experience, and
                projects to create a professional resume.
              </p>
            </div>
          </div>
        );
    }
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onExport={handleExport}
        onSettings={handleSettings}
        onLoadData={handleLoadData}
        onLogout={handleLogout}
        isSaving={isSaving}
        hasStoredData={hasStoredData}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          sections={sidebarSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 flex overflow-hidden">
          {/* Main Content Panel */}
          <div
            className="bg-white overflow-y-auto relative transition-all duration-300 ease-in-out"
            style={{
              width:
                isPreviewVisible && isContentLibraryVisible
                  ? `${mainPanelWidth}%`
                  : isPreviewVisible
                  ? "60%"
                  : "100%",
            }}
          >
            {/* Resize Handle */}
            {(isPreviewVisible || isContentLibraryVisible) && (
              <div
                className="absolute top-0 bottom-0 right-0 w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                  handleResizeStart();

                  const startX = e.clientX;
                  const startMainWidth = mainPanelWidth;
                  const startPreviewWidth = previewPanelWidth;
                  const startContentWidth = contentLibraryWidth;
                  const totalWidth =
                    startMainWidth + startPreviewWidth + startContentWidth;

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = e.clientX - startX;
                    const containerWidth = window.innerWidth - 64; // Subtract sidebar width
                    const deltaPercent = (deltaX / containerWidth) * 100;

                    // Calculate new widths maintaining total percentage
                    const newMainWidth = Math.max(
                      20,
                      Math.min(80, startMainWidth + deltaPercent)
                    );
                    let newPreviewWidth = startPreviewWidth;
                    let newContentWidth = startContentWidth;

                    // Adjust other panels proportionally
                    const remainingWidth = totalWidth - newMainWidth;
                    if (remainingWidth > 0) {
                      const previewRatio =
                        startPreviewWidth /
                        (startPreviewWidth + startContentWidth);
                      const contentRatio =
                        startContentWidth /
                        (startPreviewWidth + startContentWidth);

                      newPreviewWidth = remainingWidth * previewRatio;
                      newContentWidth = remainingWidth * contentRatio;
                    }

                    setMainPanelWidth(newMainWidth);
                    setPreviewPanelWidth(newPreviewWidth);
                    setContentLibraryWidth(newContentWidth);
                  };

                  const handleMouseUp = () => {
                    setIsResizing(false);
                    handleResizeEnd();
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                    document.body.style.cursor = "";
                    document.body.style.userSelect = "";
                  };

                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                  document.body.style.cursor = "col-resize";
                  document.body.style.userSelect = "none";
                }}
              >
                <div className="w-0.5 h-8 bg-gray-400 rounded-full" />
              </div>
            )}

            {/* Resize indicator */}
            {isResizing && (
              <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-50">
                {Math.round(mainPanelWidth)}%
              </div>
            )}
            {renderActiveSection()}
          </div>

          {/* Preview Panel */}
          {isPreviewVisible && (
            <div
              className="bg-white border-l border-gray-200 overflow-hidden relative transition-all duration-300 ease-in-out flex flex-col"
              style={{
                width: isContentLibraryVisible
                  ? `${previewPanelWidth}%`
                  : "40%",
              }}
            >
              {/* Resize Handle */}
              {isContentLibraryVisible && (
                <div
                  className="absolute top-0 bottom-0 right-0 w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsResizing(true);
                    handleResizeStart();

                    const startX = e.clientX;
                    const startPreviewWidth = previewPanelWidth;
                    const startContentWidth = contentLibraryWidth;
                    const totalWidth = startPreviewWidth + startContentWidth;

                    const handleMouseMove = (e: MouseEvent) => {
                      const deltaX = e.clientX - startX;
                      const containerWidth = window.innerWidth - 64; // Subtract sidebar width
                      const deltaPercent = (deltaX / containerWidth) * 100;

                      // Calculate new widths maintaining total percentage
                      let newPreviewWidth = Math.max(
                        20,
                        Math.min(60, startPreviewWidth + deltaPercent)
                      );
                      let newContentWidth = totalWidth - newPreviewWidth;

                      // Ensure content library doesn't get too small
                      if (newContentWidth < 15) {
                        newContentWidth = 15;
                        newPreviewWidth = totalWidth - newContentWidth;
                      }

                      setPreviewPanelWidth(newPreviewWidth);
                      setContentLibraryWidth(newContentWidth);
                    };

                    const handleMouseUp = () => {
                      setIsResizing(false);
                      handleResizeEnd();
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);
                      document.body.style.cursor = "";
                      document.body.style.userSelect = "";
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                    document.body.style.cursor = "col-resize";
                    document.body.style.userSelect = "none";
                  }}
                >
                  <div className="w-0.5 h-8 bg-gray-400 rounded-full" />
                </div>
              )}

              {/* Resize indicator */}
              {isResizing && (
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-50">
                  {Math.round(previewPanelWidth)}%
                </div>
              )}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Resume Preview
                  </h3>
                </div>
                <button
                  onClick={() => setIsPreviewVisible(false)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Hide preview panel"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <ResumePreview
                  personalInfo={convertPersonalInfo()}
                  experiences={
                    suggestedExperiences.length > 0
                      ? suggestedExperiences
                      : convertExperiences()
                  }
                  projects={
                    suggestedProjects.length > 0
                      ? suggestedProjects
                      : convertProjects()
                  }
                  education={convertEducation()}
                  skills={convertSkills()}
                  certifications={convertCertifications()}
                  className="border-0 shadow-none h-full"
                  isPanel={true}
                />
              </div>
            </div>
          )}

          {/* Content Library Panel */}
          {isContentLibraryVisible && (
            <div
              className="bg-white border-l border-gray-200 relative transition-all duration-300 ease-in-out"
              style={{
                width: isPreviewVisible ? `${contentLibraryWidth}%` : "30%",
              }}
            >
              {/* Resize Handle */}
              {isPreviewVisible && (
                <div
                  className="absolute top-0 bottom-0 left-0 w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsResizing(true);
                    handleResizeStart();

                    const startX = e.clientX;
                    const startPreviewWidth = previewPanelWidth;
                    const startContentWidth = contentLibraryWidth;
                    const totalWidth = startPreviewWidth + startContentWidth;

                    const handleMouseMove = (e: MouseEvent) => {
                      const deltaX = startX - e.clientX;
                      const containerWidth = window.innerWidth - 64; // Subtract sidebar width
                      const deltaPercent = (deltaX / containerWidth) * 100;

                      // Calculate new widths maintaining total percentage
                      let newContentWidth = Math.max(
                        15,
                        Math.min(40, startContentWidth + deltaPercent)
                      );
                      let newPreviewWidth = totalWidth - newContentWidth;

                      // Ensure preview doesn't get too small
                      if (newPreviewWidth < 20) {
                        newPreviewWidth = 20;
                        newContentWidth = totalWidth - newPreviewWidth;
                      }

                      setContentLibraryWidth(newContentWidth);
                      setPreviewPanelWidth(newPreviewWidth);
                    };

                    const handleMouseUp = () => {
                      setIsResizing(false);
                      handleResizeEnd();
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);
                      document.body.style.cursor = "";
                      document.body.style.userSelect = "";
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                    document.body.style.cursor = "col-resize";
                    document.body.style.userSelect = "none";
                  }}
                >
                  <div className="w-0.5 h-8 bg-gray-400 rounded-full" />
                </div>
              )}

              {/* Resize indicator */}
              {isResizing && (
                <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-50">
                  {Math.round(contentLibraryWidth)}%
                </div>
              )}
              <ContentLibrary
                items={contentItems}
                onItemSelect={handleContentSelect}
                onDragStart={(item) => startDrag(item, "content-library")}
                onDragEnd={endDrag}
                isDragging={dragState.isDragging}
                draggedItemId={dragState.draggedItem?.id}
                onCollapse={() => setIsContentLibraryVisible(false)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Panel Toggle Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-50">
        {!isPreviewVisible && (
          <button
            onClick={() => setIsPreviewVisible(true)}
            className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            title="Show preview panel"
          >
            <Eye className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">
              Preview
            </span>
          </button>
        )}

        {!isContentLibraryVisible && (
          <button
            onClick={() => setIsContentLibraryVisible(true)}
            className="bg-secondary-600 text-white p-3 rounded-full shadow-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
            title="Show content library"
          >
            <FolderOpen className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">
              Library
            </span>
          </button>
        )}
      </div>

      {/* Demo Components */}
      <DemoWelcomeMessage />
      <DemoWalkthrough />
      <DemoRestartButton />
    </div>
  );
};

export default ResumeBuilderPage;
