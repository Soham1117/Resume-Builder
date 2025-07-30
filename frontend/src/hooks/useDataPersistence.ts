import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../services/api";
import { useAuth } from "./useAuth";
import type {
  ResumeData,
  PersonalInfo,
  ContentItem,
  JobAnalysisResponse,
} from "../types";
import type {
  PersonalInfo as NormalizedPersonalInfo,
  Experience as NormalizedExperience,
  Project as NormalizedProject,
  Skill as NormalizedSkill,
  Certification as NormalizedCertification,
  Education as NormalizedEducation,
} from "../services/api";

interface UseDataPersistenceReturn {
  isLoading: boolean;
  saveAllData: () => Promise<void>;
  loadAllData: (showToasts?: boolean) => Promise<void>;
  savePersonalInfo: (personalInfo: PersonalInfo) => Promise<void>;
  saveResumeData: (resumeData: ResumeData) => Promise<void>;
  saveSuggestions: (
    suggestedExperiences: ContentItem[],
    suggestedProjects: ContentItem[],
    jobAnalysis: JobAnalysisResponse | null
  ) => Promise<void>;
  hasStoredData: boolean;
  // New normalized data
  normalizedPersonalInfo: NormalizedPersonalInfo | null;
  experiences: NormalizedExperience[];
  projects: NormalizedProject[];
  skills: NormalizedSkill[];
  certifications: NormalizedCertification[];
  education: NormalizedEducation[];
  // Job analysis session persistence
  saveJobAnalysisSession: (jobAnalysis: JobAnalysisResponse | null) => void;
  loadJobAnalysisSession: () => JobAnalysisResponse | null;
}

export const useDataPersistence = (
  resumeData: ResumeData,
  personalInfo: PersonalInfo,
  suggestedExperiences: ContentItem[],
  suggestedProjects: ContentItem[],
  jobAnalysis: JobAnalysisResponse | null
): UseDataPersistenceReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { isAuthenticated } = useAuth();

  // New normalized data states
  const [normalizedPersonalInfo, setNormalizedPersonalInfo] =
    useState<NormalizedPersonalInfo | null>(null);
  const [experiences, setExperiences] = useState<NormalizedExperience[]>([]);
  const [projects, setProjects] = useState<NormalizedProject[]>([]);
  const [skills, setSkills] = useState<NormalizedSkill[]>([]);
  const [certifications, setCertifications] = useState<
    NormalizedCertification[]
  >([]);
  const [education, setEducation] = useState<NormalizedEducation[]>([]);

  const checkForStoredData = useCallback(async () => {
    try {
      // Check if user has any data by checking multiple endpoints
      const [personalInfoExists, experiencesData, projectsData] =
        await Promise.all([
          apiService.hasPersonalInfo(),
          apiService.getAllExperiences(),
          apiService.getAllProjects(),
        ]);

      const hasData =
        personalInfoExists ||
        experiencesData.length > 0 ||
        projectsData.length > 0;
      setHasStoredData(hasData);
    } catch (error) {
      console.error("Error checking for stored data:", error);
      setHasStoredData(false);
    }
  }, []);

  const loadAllData = useCallback(
    async (showToasts = true) => {
      if (!isAuthenticated) {
        if (showToasts) {
          toast.error("Please log in to load your data");
        }
        return;
      }

      // Prevent multiple simultaneous loads
      if (isLoadingData) {
        return;
      }

      setIsLoadingData(true);
      setIsLoading(true);
      try {
        console.log("Loading normalized user data...");

        // Load all data from normalized endpoints in parallel
        const [
          personalInfoData,
          experiencesData,
          projectsData,
          skillsData,
          certificationsData,
          educationData,
        ] = await Promise.all([
          apiService.getPersonalInfo().catch(() => null),
          apiService.getAllExperiences().catch(() => []),
          apiService.getAllProjects().catch(() => []),
          apiService.getAllSkills().catch(() => []),
          apiService.getAllCertifications().catch(() => []),
          apiService.getAllEducation().catch(() => []),
        ]);

        // Update state with loaded data
        setNormalizedPersonalInfo(personalInfoData);
        setExperiences(experiencesData);
        setProjects(projectsData);
        setSkills(skillsData);
        setCertifications(certificationsData);
        setEducation(educationData);

        console.log("Loaded normalized data:", {
          personalInfo: personalInfoData,
          experiences: experiencesData,
          projects: projectsData,
          skills: skillsData,
          certifications: certificationsData,
          education: educationData,
        });

        // For backward compatibility, also load from /resume/blocks if needed
        try {
          const resumeBlocks = await apiService.getResumeBlocks();
          console.log("Resume blocks:", resumeBlocks);

          // Dispatch custom event with loaded data for compatibility
          const event = new CustomEvent("userDataLoaded", {
            detail: {
              personalInfo: personalInfoData,
              resumeData: resumeBlocks,
              experiences: experiencesData,
              projects: projectsData,
              skills: skillsData,
              certifications: certificationsData,
              education: educationData,
              suggestedExperiences: [],
              suggestedProjects: [],
              jobAnalysis: null,
            },
          });
          window.dispatchEvent(event);
        } catch (resumeBlocksError) {
          console.error("Error loading resume blocks:", resumeBlocksError);
        }

        const hasData =
          personalInfoData ||
          experiencesData.length > 0 ||
          projectsData.length > 0;
        if (showToasts) {
          if (hasData) {
            toast.success("Data loaded successfully");
          } else {
            toast("No saved data found");
          }
        }
      } catch (error) {
        console.error("Error loading normalized data:", error);
        if (showToasts) {
          toast.error("Failed to load data");
        }
      } finally {
        setIsLoading(false);
        setIsLoadingData(false);
      }
    },
    [isAuthenticated] // Removed isLoadingData to prevent circular dependency
  );

  const saveAllData = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save your data");
      return;
    }

    setIsLoading(true);
    try {
      console.log(
        "Saving normalized data is not implemented yet. Using legacy method for now."
      );

      // For now, still use the legacy method for saving
      // TODO: Implement saving to normalized endpoints
      const request = {
        personalInfo: JSON.stringify(personalInfo),
        resumeData: JSON.stringify(resumeData),
        suggestedExperiences: JSON.stringify(suggestedExperiences),
        suggestedProjects: JSON.stringify(suggestedProjects),
        jobAnalysis: jobAnalysis ? JSON.stringify(jobAnalysis) : "",
      };

      await apiService.saveUserData(request);
      setHasStoredData(true);
      toast.success("All data saved successfully");
    } catch (error) {
      console.error("Error saving all data:", error);
      toast.error("Failed to save data");
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    personalInfo,
    resumeData,
    suggestedExperiences,
    suggestedProjects,
    jobAnalysis,
  ]);

  // Check if user has stored data on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkForStoredData();
    }
  }, [isAuthenticated, checkForStoredData]);

  // Automatically load data when authenticated (silent) - only run once
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData(false); // Don't show toasts for automatic loading
    }
  }, [isAuthenticated]); // Removed loadAllData dependency to prevent infinite loop

  const savePersonalInfo = useCallback(
    async (personalInfo: PersonalInfo) => {
      if (!isAuthenticated) {
        toast.error("Please log in to save your data");
        return;
      }

      setIsLoading(true);
      try {
        // Convert PersonalInfo to NormalizedPersonalInfo format
        const normalizedData: NormalizedPersonalInfo = {
          name: personalInfo.name || "",
          email: personalInfo.email || "",
          phone: personalInfo.phone || "",
          location: personalInfo.location || "",
          linkedin: personalInfo.linkedin || "",
          portfolio: personalInfo.portfolio || "",
        };

        const savedInfo = await apiService.savePersonalInfoNormalized(
          normalizedData
        );
        setNormalizedPersonalInfo(savedInfo);
        setHasStoredData(true);
        toast.success("Personal info saved");
      } catch (error) {
        console.error("Error saving personal info:", error);
        toast.error("Failed to save personal info");
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const saveResumeData = useCallback(
    async (resumeData: ResumeData) => {
      if (!isAuthenticated) {
        toast.error("Please log in to save your data");
        return;
      }

      setIsLoading(true);
      try {
        // For now, still use the legacy method
        // TODO: Implement saving individual components to normalized endpoints
        await apiService.saveResumeData(JSON.stringify(resumeData));
        setHasStoredData(true);
        toast.success("Resume data saved");
      } catch (error) {
        console.error("Error saving resume data:", error);
        toast.error("Failed to save resume data");
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const saveSuggestions = useCallback(
    async (
      suggestedExperiences: ContentItem[],
      suggestedProjects: ContentItem[]
    ) => {
      if (!isAuthenticated) {
        toast.error("Please log in to save your data");
        return;
      }

      setIsLoading(true);
      try {
        // For now, still use the legacy method
        // TODO: Implement saving suggestions to normalized endpoints
        await apiService.saveSuggestions(
          JSON.stringify(suggestedExperiences),
          JSON.stringify(suggestedProjects)
        );
        setHasStoredData(true);
        toast.success("Suggestions saved");
      } catch (error) {
        console.error("Error saving suggestions:", error);
        toast.error("Failed to save suggestions");
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Job analysis session persistence using localStorage
  const saveJobAnalysisSession = useCallback((jobAnalysis: JobAnalysisResponse | null) => {
    try {
      if (jobAnalysis) {
        localStorage.setItem('jobAnalysisSession', JSON.stringify(jobAnalysis));
        console.log('Job analysis session saved to localStorage');
      } else {
        localStorage.removeItem('jobAnalysisSession');
        console.log('Job analysis session cleared from localStorage');
      }
    } catch (error) {
      console.error('Error saving job analysis session:', error);
    }
  }, []);

  const loadJobAnalysisSession = useCallback((): JobAnalysisResponse | null => {
    try {
      const saved = localStorage.getItem('jobAnalysisSession');
      if (saved) {
        const jobAnalysis = JSON.parse(saved);
        console.log('Job analysis session loaded from localStorage');
        return jobAnalysis;
      }
    } catch (error) {
      console.error('Error loading job analysis session:', error);
    }
    return null;
  }, []);

  return {
    isLoading,
    saveAllData,
    loadAllData,
    savePersonalInfo,
    saveResumeData,
    saveSuggestions,
    hasStoredData,
    normalizedPersonalInfo,
    experiences,
    projects,
    skills,
    certifications,
    education,
    saveJobAnalysisSession,
    loadJobAnalysisSession,
  };
};
