// Resume Data Types
export interface ResumeData {
  experiences: ContentItem[];
  projects: ContentItem[];
  education?: NormalizedEducation[];
  skills?: NormalizedSkill[];
  certifications?: NormalizedCertification[];
}

export interface ResumeBlock {
  id: string;
  title: string;
  company?: string;
  location?: string;
  dateRange?: string;
  technologies?: string;
  link?: string;
  lines?: string[];
  projects?: ExperienceProject[];
}

export interface ExperienceProject {
  id: string;
  title: string;
  link?: string;
  lines: string[];
}

export interface EducationBlock {
  id: string;
  degree: string;
  institution: string;
  dateRange: string;
  gpa?: string;
  location?: string;
}

export interface SkillsBlock {
  id: string;
  category: string;
  skills: string[];
}

export interface CertificationBlock {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

// Personal Information
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

// New Normalized Data Interfaces (matching backend structure)
export interface NormalizedPersonalInfo {
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

export interface NormalizedExperience {
  id?: number;
  title: string;
  company: string;
  location?: string;
  dateRange?: string;
  description?: string;
  priority?: number;
  bullets?: NormalizedExperienceBullet[];
  technologies?: NormalizedExperienceTechnology[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NormalizedExperienceBullet {
  id?: number;
  bulletText: string;
  orderIndex: number;
  createdAt?: string;
}

export interface NormalizedExperienceTechnology {
  id?: number;
  technology: string;
  createdAt?: string;
}

export interface NormalizedProject {
  id?: number;
  title: string;
  technologies?: string;
  link?: string;
  priority?: number;
  bullets?: NormalizedProjectBullet[];
  technologiesList?: NormalizedProjectTechnology[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NormalizedProjectBullet {
  id?: number;
  bulletText: string;
  orderIndex: number;
  createdAt?: string;
}

export interface NormalizedProjectTechnology {
  id?: number;
  technology: string;
  createdAt?: string;
}

export interface NormalizedSkill {
  id?: number;
  category: string;
  skillName: string;
  orderIndex: number;
  createdAt?: string;
}

export interface NormalizedCertification {
  id?: number;
  name: string;
  issuer: string;
  dateObtained?: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NormalizedEducation {
  id?: number;
  degree: string;
  institution: string;
  dateRange?: string;
  gpa?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Content Library Types
export interface ContentItem {
  id: string;
  type: 'experience' | 'project';
  title: string;
  company?: string;
  technologies?: string[];
  description: string;
  bulletPoints: string[];
  dateRange?: string;
  location?: string;
  link?: string;
  category: string;
  tags: string[];
}

export interface ContentLibrary {
  experiences: ContentItem[];
  projects: ContentItem[];
  skills: ContentItem[];
  achievements: ContentItem[];
}

// Drag & Drop Types
export interface DragItem {
  id: string;
  type: string;
  content: ContentItem;
}

export interface DropResult {
  draggedId: string;
  droppedOnId: string;
  type: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'date' | 'select';
  required?: boolean;
  validation?: Record<string, unknown>;
  options?: { value: string; label: string }[];
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerateResumeRequest {
  resumeData: ResumeData;
  personalInfo: PersonalInfo;
  template?: string;
}

export interface GenerateResumeResponse {
  pdfUrl: string;
  latex: string;
}

// UI Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Theme Types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

// Template Types
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  tags: string[];
}

// Analysis Types
export interface AnalysisResult {
  keySkills: string[];
  suggestedTechnologies: string[];
  suggestedSkills: string[];
  recommendations: string;
  matchScore: number;
}

export interface JobAnalysisResponse {
  selectedExperiences: ContentItem[];
  selectedProjects: ContentItem[];
  analysis: AnalysisResult;
  latexContent: string;
}

// Cover Letter Types
export interface CoverLetterRequest {
  jobDescription: string;
  jobTitle: string;
  companyName: string;
  companyAddress?: string;
  companyCityStateZip?: string;
  hiringManager?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateLocation?: string;
  candidateLinkedIn?: string;
  candidatePortfolio?: string;
}

export interface CoverLetterResponse {
  coverLetterContent: string;
  pdfFilePath: string;
  fileName: string;
  success: boolean;
  errorMessage?: string;
} 