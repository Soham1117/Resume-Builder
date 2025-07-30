import axios from "axios";
import type {
  ContentItem,
  EducationBlock,
  SkillsBlock,
  CertificationBlock,
} from "../types";
import type { ResumeBlock } from "../utils/dataTransform";
import { transformResumeBlocksToContentItems } from "../utils/dataTransform";
import type {
  AuthRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth";

// Backend response interface
interface BackendResumeData {
  experiences: ResumeBlock[];
  projects: ResumeBlock[];
}

// New normalized data interfaces
export interface PersonalInfo {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  location?: string;
  dateRange?: string;
  description?: string;
  priority?: number;
  bullets?: ExperienceBullet[];
  technologies?: ExperienceTechnology[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceBullet {
  id?: number;
  bulletText: string;
  orderIndex: number;
  createdAt?: string;
}

export interface ExperienceTechnology {
  id?: number;
  technology: string;
  createdAt?: string;
}

export interface Project {
  id?: number;
  title: string;
  technologies?: string;
  link?: string;
  priority?: number;
  bullets?: ProjectBullet[];
  technologiesList?: ProjectTechnology[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectBullet {
  id?: number;
  bulletText: string;
  orderIndex: number;
  createdAt?: string;
}

export interface ProjectTechnology {
  id?: number;
  technology: string;
  createdAt?: string;
}

export interface Skill {
  id?: number;
  category: string;
  skillName: string;
  orderIndex: number;
  createdAt?: string;
}

export interface Certification {
  id?: number;
  name: string;
  issuer: string;
  dateObtained?: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id?: number;
  degree: string;
  institution: string;
  dateRange?: string;
  gpa?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Configure axios with base URL - Spring Boot has context path /api
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for authentication and logging
api.interceptors.request.use(
  (config) => {
    // Add JWT token to requests if available
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    console.log("Request config:", {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error("❌ API Response Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });

    // Handle 401 Unauthorized - try to refresh token
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/refresh")
    ) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshResponse = await api.post<AuthResponse>(
            "/auth/refresh",
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          );

          // Update tokens in localStorage
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);
          localStorage.setItem(
            "refreshToken",
            refreshResponse.data.refreshToken
          );

          // Retry original request with new token
          error.config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export interface JobDescriptionRequest {
  jobDescription: string;
}

export interface AnalysisResult {
  keySkills: string[];
  suggestedTechnologies: string[];
  recommendations: string;
  matchScore: number;
}

export interface BackendJobAnalysisResponse {
  selectedExperiences: ResumeBlock[];
  selectedProjects: ResumeBlock[];
  analysis: AnalysisResult;
  latexContent: string;
}

export interface JobAnalysisResponse {
  selectedExperiences: ContentItem[];
  selectedProjects: ContentItem[];
  analysis: AnalysisResult;
  latexContent: string;
}

export interface GenerateResumeRequest {
  resumeData: {
    experiences: ResumeBlock[];
    projects: ResumeBlock[];
    education?: EducationBlock[];
    skills?: SkillsBlock[];
    certifications?: CertificationBlock[];
  };
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  template?: string;
}

export interface GenerateResumeResponse {
  jobId: string;
  status: string;
  message: string;
  latex: string;
  pdfUrl: string;
}

export interface CacheStats {
  cacheSize: number;
}

export interface UserDataRequest {
  personalInfo: string;
  resumeData: string;
  suggestedExperiences: string;
  suggestedProjects: string;
  jobAnalysis: string;
}

export interface UserDataResponse {
  id: number;
  personalInfo: string;
  resumeData: string;
  suggestedExperiences: string;
  suggestedProjects: string;
  jobAnalysis: string;
  createdAt: string;
  updatedAt: string;
}

// API Service class
class ApiService {
  // Authentication methods
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Failed to login");
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Failed to register");
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post<AuthResponse>(
        "/auth/refresh",
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new Error("Failed to refresh token");
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  // Job analysis methods
  async analyzeJobDescription(
    jobDescription: string
  ): Promise<JobAnalysisResponse> {
    try {
      const response = await api.post<BackendJobAnalysisResponse>(
        "/resume/analyze",
        { jobDescription }
      );

      // Transform backend data to frontend format
      const selectedExperiences = transformResumeBlocksToContentItems(
        response.data.selectedExperiences
      );
      const selectedProjects = transformResumeBlocksToContentItems(
        response.data.selectedProjects
      );
      return {
        selectedExperiences,
        selectedProjects,
        analysis: response.data.analysis,
        latexContent: response.data.latexContent,
      };
    } catch (error) {
      console.error("Error analyzing job description:", error);
      throw new Error("Failed to analyze job description");
    }
  }

  // Get all resume blocks (experiences, projects, etc.)
  async getResumeBlocks(): Promise<BackendResumeData> {
    try {
      const response = await api.get<BackendResumeData>("/resume/blocks");
      return response.data;
    } catch (error) {
      console.error("Error fetching resume blocks:", error);
      throw new Error("Failed to fetch resume blocks");
    }
  }

  // Generate LaTeX resume
  async generateResume(
    request: GenerateResumeRequest
  ): Promise<GenerateResumeResponse> {
    try {
      const response = await api.post<GenerateResumeResponse>(
        "/resume/generate",
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error generating resume:", error);
      throw new Error("Failed to generate resume");
    }
  }

  // Test LaTeX generation
  async testLatexGeneration(): Promise<string> {
    try {
      const response = await api.post<string>("/resume/test-latex");
      return response.data;
    } catch (error) {
      console.error("Error testing LaTeX generation:", error);
      throw new Error("Failed to test LaTeX generation");
    }
  }

  // Cache management
  async getCacheStats(): Promise<CacheStats> {
    try {
      const response = await api.get<{ cacheSize: number }>(
        "/resume/cache/stats"
      );
      return { cacheSize: response.data.cacheSize };
    } catch (error) {
      console.error("Error getting cache stats:", error);
      throw new Error("Failed to get cache stats");
    }
  }

  async clearCache(): Promise<void> {
    try {
      await api.post("/resume/cache/clear");
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw new Error("Failed to clear cache");
    }
  }

  // Health checks
  async healthCheck(): Promise<boolean> {
    try {
      await api.get("/resume/pdf/status");
      return true;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  async authHealthCheck(): Promise<boolean> {
    try {
      await api.get("/auth/health");
      return true;
    } catch (error) {
      console.error("Auth health check failed:", error);
      return false;
    }
  }

  // Legacy user data methods (for backward compatibility)
  async saveUserData(request: UserDataRequest): Promise<UserDataResponse> {
    try {
      const response = await api.post<UserDataResponse>(
        "/user-data/save",
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error saving user data:", error);
      throw new Error("Failed to save user data");
    }
  }

  async getUserData(): Promise<UserDataResponse> {
    try {
      const response = await api.get<UserDataResponse>("/user-data/get");
      return response.data;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw new Error("Failed to get user data");
    }
  }

  async deleteUserData(): Promise<void> {
    try {
      await api.delete("/user-data/delete");
    } catch (error) {
      console.error("Error deleting user data:", error);
      throw new Error("Failed to delete user data");
    }
  }

  async hasUserData(): Promise<boolean> {
    try {
      const response = await api.get<boolean>("/user-data/exists");
      return response.data;
    } catch (error) {
      console.error("Error checking user data:", error);
      return false;
    }
  }

  async savePersonalInfo(personalInfo: string): Promise<UserDataResponse> {
    try {
      const response = await api.post<UserDataResponse>(
        "/user-data/personal-info",
        personalInfo
      );
      return response.data;
    } catch (error) {
      console.error("Error saving personal info:", error);
      throw new Error("Failed to save personal info");
    }
  }

  async saveResumeData(resumeData: string): Promise<UserDataResponse> {
    try {
      const response = await api.post<UserDataResponse>(
        "/user-data/resume-data",
        resumeData
      );
      return response.data;
    } catch (error) {
      console.error("Error saving resume data:", error);
      throw new Error("Failed to save resume data");
    }
  }

  async saveSuggestions(
    suggestedExperiences: string,
    suggestedProjects: string
  ): Promise<UserDataResponse> {
    try {
      const response = await api.post<UserDataResponse>(
        "/user-data/suggestions",
        null,
        {
          params: { suggestedExperiences, suggestedProjects },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving suggestions:", error);
      throw new Error("Failed to save suggestions");
    }
  }

  // New normalized data methods
  // Personal Info
  async getPersonalInfo(): Promise<PersonalInfo | null> {
    try {
      const response = await api.get<PersonalInfo>("/personal-info");
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 404) {
        return null;
      }
      console.error("Error getting personal info:", error);
      throw new Error("Failed to get personal info");
    }
  }

  async savePersonalInfoNormalized(
    personalInfo: PersonalInfo
  ): Promise<PersonalInfo> {
    try {
      const response = await api.post<PersonalInfo>(
        "/personal-info",
        personalInfo
      );
      return response.data;
    } catch (error) {
      console.error("Error saving personal info:", error);
      throw new Error("Failed to save personal info");
    }
  }

  async updatePersonalInfoField(
    field: string,
    value: string
  ): Promise<PersonalInfo> {
    try {
      const response = await api.patch<PersonalInfo>(
        `/personal-info/${field}`,
        value
      );
      return response.data;
    } catch (error) {
      console.error("Error updating personal info field:", error);
      throw new Error("Failed to update personal info field");
    }
  }

  async deletePersonalInfo(): Promise<void> {
    try {
      await api.delete("/personal-info");
    } catch (error) {
      console.error("Error deleting personal info:", error);
      throw new Error("Failed to delete personal info");
    }
  }

  async hasPersonalInfo(): Promise<boolean> {
    try {
      const response = await api.get<boolean>("/personal-info/exists");
      return response.data;
    } catch (error) {
      console.error("Error checking personal info:", error);
      return false;
    }
  }

  // Experiences
  async getAllExperiences(): Promise<Experience[]> {
    try {
      const response = await api.get<Experience[]>("/experiences");
      return response.data;
    } catch (error) {
      console.error("Error getting experiences:", error);
      throw new Error("Failed to get experiences");
    }
  }

  async getTopExperiences(limit: number): Promise<Experience[]> {
    try {
      const response = await api.get<Experience[]>(`/experiences/top/${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error getting top experiences:", error);
      throw new Error("Failed to get top experiences");
    }
  }

  async getExperienceById(id: number): Promise<Experience> {
    try {
      const response = await api.get<Experience>(`/experiences/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting experience:", error);
      throw new Error("Failed to get experience");
    }
  }

  async saveExperience(experience: Experience): Promise<Experience> {
    try {
      const response = await api.post<Experience>("/experiences", experience);
      return response.data;
    } catch (error) {
      console.error("Error saving experience:", error);
      throw new Error("Failed to save experience");
    }
  }

  async updateExperiencePriority(
    id: number,
    priority: number
  ): Promise<Experience> {
    try {
      const response = await api.patch<Experience>(
        `/experiences/${id}/priority`,
        priority
      );
      return response.data;
    } catch (error) {
      console.error("Error updating experience priority:", error);
      throw new Error("Failed to update experience priority");
    }
  }

  async deleteExperience(id: number): Promise<void> {
    try {
      await api.delete(`/experiences/${id}`);
    } catch (error) {
      console.error("Error deleting experience:", error);
      throw new Error("Failed to delete experience");
    }
  }

  async deleteAllExperiences(): Promise<void> {
    try {
      await api.delete("/experiences");
    } catch (error) {
      console.error("Error deleting all experiences:", error);
      throw new Error("Failed to delete all experiences");
    }
  }

  async addBulletToExperience(
    experienceId: number,
    bulletText: string,
    orderIndex: number
  ): Promise<ExperienceBullet> {
    try {
      const response = await api.post<ExperienceBullet>(
        `/experiences/${experienceId}/bullets`,
        {
          bulletText,
          orderIndex,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding bullet to experience:", error);
      throw new Error("Failed to add bullet to experience");
    }
  }

  async removeBulletFromExperience(
    experienceId: number,
    bulletId: number
  ): Promise<void> {
    try {
      await api.delete(`/experiences/${experienceId}/bullets/${bulletId}`);
    } catch (error) {
      console.error("Error removing bullet from experience:", error);
      throw new Error("Failed to remove bullet from experience");
    }
  }

  async addTechnologyToExperience(
    experienceId: number,
    technology: string
  ): Promise<ExperienceTechnology> {
    try {
      const response = await api.post<ExperienceTechnology>(
        `/experiences/${experienceId}/technologies`,
        technology
      );
      return response.data;
    } catch (error) {
      console.error("Error adding technology to experience:", error);
      throw new Error("Failed to add technology to experience");
    }
  }

  async removeTechnologyFromExperience(
    experienceId: number,
    technologyId: number
  ): Promise<void> {
    try {
      await api.delete(
        `/experiences/${experienceId}/technologies/${technologyId}`
      );
    } catch (error) {
      console.error("Error removing technology from experience:", error);
      throw new Error("Failed to remove technology from experience");
    }
  }

  async countExperiences(): Promise<number> {
    try {
      const response = await api.get<number>("/experiences/count");
      return response.data;
    } catch (error) {
      console.error("Error counting experiences:", error);
      throw new Error("Failed to count experiences");
    }
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>("/projects");
      return response.data;
    } catch (error) {
      console.error("Error getting projects:", error);
      throw new Error("Failed to get projects");
    }
  }

  async getTopProjects(limit: number): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(`/projects/top/${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error getting top projects:", error);
      throw new Error("Failed to get top projects");
    }
  }

  async getProjectById(id: number): Promise<Project> {
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting project:", error);
      throw new Error("Failed to get project");
    }
  }

  async saveProject(project: Project): Promise<Project> {
    try {
      const response = await api.post<Project>("/projects", project);
      return response.data;
    } catch (error) {
      console.error("Error saving project:", error);
      throw new Error("Failed to save project");
    }
  }

  async updateProjectPriority(id: number, priority: number): Promise<Project> {
    try {
      const response = await api.patch<Project>(
        `/projects/${id}/priority`,
        priority
      );
      return response.data;
    } catch (error) {
      console.error("Error updating project priority:", error);
      throw new Error("Failed to update project priority");
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }

  async deleteAllProjects(): Promise<void> {
    try {
      await api.delete("/projects");
    } catch (error) {
      console.error("Error deleting all projects:", error);
      throw new Error("Failed to delete all projects");
    }
  }

  async addBulletToProject(
    projectId: number,
    bulletText: string,
    orderIndex: number
  ): Promise<ProjectBullet> {
    try {
      const response = await api.post<ProjectBullet>(
        `/projects/${projectId}/bullets`,
        {
          bulletText,
          orderIndex,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding bullet to project:", error);
      throw new Error("Failed to add bullet to project");
    }
  }

  async removeBulletFromProject(
    projectId: number,
    bulletId: number
  ): Promise<void> {
    try {
      await api.delete(`/projects/${projectId}/bullets/${bulletId}`);
    } catch (error) {
      console.error("Error removing bullet from project:", error);
      throw new Error("Failed to remove bullet from project");
    }
  }

  async addTechnologyToProject(
    projectId: number,
    technology: string
  ): Promise<ProjectTechnology> {
    try {
      const response = await api.post<ProjectTechnology>(
        `/projects/${projectId}/technologies`,
        technology
      );
      return response.data;
    } catch (error) {
      console.error("Error adding technology to project:", error);
      throw new Error("Failed to add technology to project");
    }
  }

  async removeTechnologyFromProject(
    projectId: number,
    technologyId: number
  ): Promise<void> {
    try {
      await api.delete(`/projects/${projectId}/technologies/${technologyId}`);
    } catch (error) {
      console.error("Error removing technology from project:", error);
      throw new Error("Failed to remove technology from project");
    }
  }

  async countProjects(): Promise<number> {
    try {
      const response = await api.get<number>("/projects/count");
      return response.data;
    } catch (error) {
      console.error("Error counting projects:", error);
      throw new Error("Failed to count projects");
    }
  }

  // Skills
  async getAllSkills(): Promise<Skill[]> {
    try {
      const response = await api.get<Skill[]>("/skills");
      return response.data;
    } catch (error) {
      console.error("Error getting skills:", error);
      throw new Error("Failed to get skills");
    }
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    try {
      const response = await api.get<Skill[]>(`/skills/category/${category}`);
      return response.data;
    } catch (error) {
      console.error("Error getting skills by category:", error);
      throw new Error("Failed to get skills by category");
    }
  }

  async getSkillCategories(): Promise<string[]> {
    try {
      const response = await api.get<string[]>("/skills/categories");
      return response.data;
    } catch (error) {
      console.error("Error getting skill categories:", error);
      throw new Error("Failed to get skill categories");
    }
  }

  async getSkillById(id: number): Promise<Skill> {
    try {
      const response = await api.get<Skill>(`/skills/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting skill:", error);
      throw new Error("Failed to get skill");
    }
  }

  async saveSkill(skill: Skill): Promise<Skill> {
    try {
      const response = await api.post<Skill>("/skills", skill);
      return response.data;
    } catch (error) {
      console.error("Error saving skill:", error);
      throw new Error("Failed to save skill");
    }
  }

  async updateSkill(skill: Skill): Promise<Skill> {
    try {
      const response = await api.put<Skill>(`/skills/${skill.id}`, skill);
      return response.data;
    } catch (error) {
      console.error("Error updating skill:", error);
      throw new Error("Failed to update skill");
    }
  }

  async deleteSkill(id: number): Promise<void> {
    try {
      await api.delete(`/skills/${id}`);
    } catch (error) {
      console.error("Error deleting skill:", error);
      throw new Error("Failed to delete skill");
    }
  }

  async deleteAllSkills(): Promise<void> {
    try {
      await api.delete("/skills");
    } catch (error) {
      console.error("Error deleting all skills:", error);
      throw new Error("Failed to delete all skills");
    }
  }

  async countSkills(): Promise<number> {
    try {
      const response = await api.get<number>("/skills/count");
      return response.data;
    } catch (error) {
      console.error("Error counting skills:", error);
      throw new Error("Failed to count skills");
    }
  }

  // Certifications
  async getAllCertifications(): Promise<Certification[]> {
    try {
      const response = await api.get<Certification[]>("/certifications");
      return response.data;
    } catch (error) {
      console.error("Error getting certifications:", error);
      throw new Error("Failed to get certifications");
    }
  }

  async getCertificationsByIssuer(issuer: string): Promise<Certification[]> {
    try {
      const response = await api.get<Certification[]>(
        `/certifications/issuer/${issuer}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting certifications by issuer:", error);
      throw new Error("Failed to get certifications by issuer");
    }
  }

  async getCertificationById(id: number): Promise<Certification> {
    try {
      const response = await api.get<Certification>(`/certifications/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting certification:", error);
      throw new Error("Failed to get certification");
    }
  }

  async saveCertification(
    certification: Certification
  ): Promise<Certification> {
    try {
      const response = await api.post<Certification>(
        "/certifications",
        certification
      );
      return response.data;
    } catch (error) {
      console.error("Error saving certification:", error);
      throw new Error("Failed to save certification");
    }
  }

  async updateCertificationName(
    id: number,
    name: string
  ): Promise<Certification> {
    try {
      const response = await api.patch<Certification>(
        `/certifications/${id}/name`,
        name
      );
      return response.data;
    } catch (error) {
      console.error("Error updating certification name:", error);
      throw new Error("Failed to update certification name");
    }
  }

  async updateCertificationIssuer(
    id: number,
    issuer: string
  ): Promise<Certification> {
    try {
      const response = await api.patch<Certification>(
        `/certifications/${id}/issuer`,
        issuer
      );
      return response.data;
    } catch (error) {
      console.error("Error updating certification issuer:", error);
      throw new Error("Failed to update certification issuer");
    }
  }

  async updateCertificationDate(
    id: number,
    dateObtained: string
  ): Promise<Certification> {
    try {
      const response = await api.patch<Certification>(
        `/certifications/${id}/date`,
        dateObtained
      );
      return response.data;
    } catch (error) {
      console.error("Error updating certification date:", error);
      throw new Error("Failed to update certification date");
    }
  }

  async updateCertificationLink(
    id: number,
    link: string
  ): Promise<Certification> {
    try {
      const response = await api.patch<Certification>(
        `/certifications/${id}/link`,
        link
      );
      return response.data;
    } catch (error) {
      console.error("Error updating certification link:", error);
      throw new Error("Failed to update certification link");
    }
  }

  async deleteCertification(id: number): Promise<void> {
    try {
      await api.delete(`/certifications/${id}`);
    } catch (error) {
      console.error("Error deleting certification:", error);
      throw new Error("Failed to delete certification");
    }
  }

  async deleteAllCertifications(): Promise<void> {
    try {
      await api.delete("/certifications");
    } catch (error) {
      console.error("Error deleting all certifications:", error);
      throw new Error("Failed to delete all certifications");
    }
  }

  async countCertifications(): Promise<number> {
    try {
      const response = await api.get<number>("/certifications/count");
      return response.data;
    } catch (error) {
      console.error("Error counting certifications:", error);
      throw new Error("Failed to count certifications");
    }
  }

  // Education
  async getAllEducation(): Promise<Education[]> {
    try {
      const response = await api.get<Education[]>("/education");
      return response.data;
    } catch (error) {
      console.error("Error getting education:", error);
      throw new Error("Failed to get education");
    }
  }

  async getEducationByInstitution(institution: string): Promise<Education[]> {
    try {
      const response = await api.get<Education[]>(
        `/education/institution/${institution}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting education by institution:", error);
      throw new Error("Failed to get education by institution");
    }
  }

  async getEducationById(id: number): Promise<Education> {
    try {
      const response = await api.get<Education>(`/education/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting education:", error);
      throw new Error("Failed to get education");
    }
  }

  async saveEducation(education: Education): Promise<Education> {
    try {
      const response = await api.post<Education>("/education", education);
      return response.data;
    } catch (error) {
      console.error("Error saving education:", error);
      throw new Error("Failed to save education");
    }
  }

  async updateEducationDegree(id: number, degree: string): Promise<Education> {
    try {
      const response = await api.patch<Education>(
        `/education/${id}/degree`,
        degree
      );
      return response.data;
    } catch (error) {
      console.error("Error updating education degree:", error);
      throw new Error("Failed to update education degree");
    }
  }

  async updateEducationInstitution(
    id: number,
    institution: string
  ): Promise<Education> {
    try {
      const response = await api.patch<Education>(
        `/education/${id}/institution`,
        institution
      );
      return response.data;
    } catch (error) {
      console.error("Error updating education institution:", error);
      throw new Error("Failed to update education institution");
    }
  }

  async updateEducationDateRange(
    id: number,
    dateRange: string
  ): Promise<Education> {
    try {
      const response = await api.patch<Education>(
        `/education/${id}/date-range`,
        dateRange
      );
      return response.data;
    } catch (error) {
      console.error("Error updating education date range:", error);
      throw new Error("Failed to update education date range");
    }
  }

  async updateEducationGpa(id: number, gpa: string): Promise<Education> {
    try {
      const response = await api.patch<Education>(`/education/${id}/gpa`, gpa);
      return response.data;
    } catch (error) {
      console.error("Error updating education GPA:", error);
      throw new Error("Failed to update education GPA");
    }
  }

  async updateEducationLocation(
    id: number,
    location: string
  ): Promise<Education> {
    try {
      const response = await api.patch<Education>(
        `/education/${id}/location`,
        location
      );
      return response.data;
    } catch (error) {
      console.error("Error updating education location:", error);
      throw new Error("Failed to update education location");
    }
  }

  async deleteEducation(id: number): Promise<void> {
    try {
      await api.delete(`/education/${id}`);
    } catch (error) {
      console.error("Error deleting education:", error);
      throw new Error("Failed to delete education");
    }
  }

  async deleteAllEducation(): Promise<void> {
    try {
      await api.delete("/education");
    } catch (error) {
      console.error("Error deleting all education:", error);
      throw new Error("Failed to delete all education");
    }
  }

  async countEducation(): Promise<number> {
    try {
      const response = await api.get<number>("/education/count");
      return response.data;
    } catch (error) {
      console.error("Error counting education:", error);
      throw new Error("Failed to count education");
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export axios instance for custom requests
export { api };
