import React, { useState, useRef } from "react";
import { Download, FileText, Eye } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import type {
  PersonalInfo,
  ContentItem,
  EducationBlock,
  SkillsBlock,
  CertificationBlock,
} from "../../types";
import { useApi } from "../../hooks/useApi";
import { transformContentItemsToResumeBlocks } from "../../utils/dataTransform";
import toast from "react-hot-toast";
import { api } from "../../services/api"; // Import api to get base URL

interface ResumePreviewProps {
  personalInfo: PersonalInfo;
  experiences: ContentItem[];
  projects: ContentItem[];
  education?: EducationBlock[];
  skills?: SkillsBlock[];
  certifications?: CertificationBlock[];
  className?: string;
  isPanel?: boolean; // New prop to indicate if this is used in a panel
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  personalInfo,
  experiences,
  projects,
  education = [],
  skills = [],
  certifications = [],
  className,
  isPanel = true,
}) => {
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { generateResume } = useApi();

  const handleExportPdf = async () => {
    // Use the experiences and projects that are currently being displayed
    const currentExperiences = experiences;
    const currentProjects = projects;

    if (currentExperiences.length === 0 && currentProjects.length === 0) {
      toast.error("Please add some content to your resume before exporting");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      // Transform ContentItem arrays to ResumeBlock arrays for backend
      const transformedExperiences =
        transformContentItemsToResumeBlocks(currentExperiences);
      const transformedProjects =
        transformContentItemsToResumeBlocks(currentProjects);

      const result = await generateResume({
        resumeData: {
          experiences: transformedExperiences,
          projects: transformedProjects,
          education,
          skills,
          certifications,
        },
        personalInfo,
        template: "modern", // Fixed template
      });

      if (result?.pdfUrl) {
        setPdfUrl(result.pdfUrl);
        setIsPdfMode(true);
        setPdfLoadError(false); // Reset error state for new PDF
        toast.success("PDF generated successfully!");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (pdfUrl) {
      try {
        // Extract filename from the URL
        const urlParts = pdfUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];

        // Use the API service to download the PDF with authentication
        const response = await api.get(`/resume/pdf/${fileName}`, {
          responseType: "blob",
        });

        // Create download link
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully!");
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download PDF. Please try again.");
      }
    }
  };

  const renderResumeContent = () => (
    <div className="max-w-4xl mx-auto" ref={previewRef}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-600 mt-2">
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.portfolio && (
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Experience Section */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div key={experience.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">
                    {experience.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {experience.dateRange}
                  </span>
                </div>
                {experience.company && (
                  <p className="text-sm text-gray-600 mb-2">
                    {experience.company}
                  </p>
                )}
                <p className="text-sm text-gray-700 mb-2">
                  {experience.description}
                </p>
                {experience.bulletPoints &&
                  experience.bulletPoints.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {experience.bulletPoints.map((point, index) => {
                        // Parse link indicators from bullet points
                        const linkMatch = point.match(/\[LINK:\s*([^\]]+)\]/);
                        const hasLink = linkMatch && linkMatch[1];
                        const textWithoutLink = hasLink
                          ? point.replace(/\[LINK:\s*[^\]]+\]/, "").trim()
                          : point;

                        return (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-primary-600 mt-1">•</span>
                            <div className="flex-1">
                              <span>{textWithoutLink}</span>
                              {hasLink && (
                                <div className="mt-1">
                                  <a
                                    href={linkMatch[1].trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
                                  >
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    View Project
                                  </a>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                {experience.technologies &&
                  experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {experience.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  {project.dateRange && (
                    <span className="text-sm text-gray-500">
                      {project.dateRange}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {project.description}
                </p>
                {project.bulletPoints && project.bulletPoints.length > 0 && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {project.bulletPoints.map((point, index) => {
                      // Parse link indicators from bullet points
                      const linkMatch = point.match(/\[LINK:\s*([^\]]+)\]/);
                      const hasLink = linkMatch && linkMatch[1];
                      const textWithoutLink = hasLink
                        ? point.replace(/\[LINK:\s*[^\]]+\]/, "").trim()
                        : point;

                      return (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <div className="flex-1">
                            <span>{textWithoutLink}</span>
                            {hasLink && (
                              <div className="mt-1">
                                <a
                                  href={linkMatch[1].trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
                                >
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  View Project
                                </a>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.link && (
                  <div className="mt-2">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      View Project →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-500">{edu.dateRange}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{edu.institution}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {edu.location && <span>{edu.location}</span>}
                  {edu.gpa && (
                    <>
                      <span>•</span>
                      <span>GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            Skills
          </h2>
          <div className="space-y-3">
            {skills.map((skillBlock) => (
              <div key={skillBlock.id} className="mb-3">
                <h4 className="font-medium text-gray-900 mb-2">
                  {skillBlock.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillBlock.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Certifications as part of Skills section */}
            {certifications.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-2">
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <span
                      key={cert.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center"
                    >
                      {cert.name}
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          🔗
                        </a>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {experiences.length === 0 &&
        projects.length === 0 &&
        education.length === 0 &&
        skills.length === 0 &&
        certifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>
              No content added yet. Start by adding your experience, projects,
              education, skills, and certifications!
            </p>
          </div>
        )}
    </div>
  );

  return (
    <Card
      className={`${isPanel ? "p-4" : "p-6"} ${className} flex flex-col h-full`}
    >
      {/* Preview Controls */}
      <div
        className={`flex items-center justify-center mb-6 pb-4 border-b border-gray-200 ${
          isPanel ? "flex-row space-y-3" : ""
        } flex-shrink-0`}
      >
        <div
          className={`flex items-center space-x-4 ${
            isPanel ? "w-full justify-between" : ""
          }`}
        >
          <h2 className="text-xl font-bold text-gray-900">Resume Preview</h2>
        </div>

        <div
          className={`flex items-center space-x-2 ${
            isPanel ? "w-full justify-end" : ""
          }`}
        >
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {isPdfMode && pdfUrl ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPdfMode(false)}
                className="flex items-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                {isPanel && <span>Preview</span>}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportPdf}
                disabled={isGeneratingPdf}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                {isPanel && (
                  <span>
                    {isGeneratingPdf ? "Generating..." : "Export PDF"}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview */}
      {isPdfMode && pdfUrl ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="w-full border border-gray-300 rounded-lg overflow-hidden flex-1 flex flex-col">
            {/* PDF Controls */}
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  PDF Preview
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPdfMode(false)}
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  {!isPanel && <span>Back to Preview</span>}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadPdf}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  {!isPanel && <span>Download</span>}
                </Button>
              </div>
            </div>

            {pdfLoadError ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    PDF preview is not available
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPdfMode(false)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Back to Preview</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleDownloadPdf}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={
                  pdfUrl.startsWith("http")
                    ? pdfUrl.replace("/pdf/preview/", "/pdf/public/")
                    : `${api.defaults.baseURL}${pdfUrl.replace(
                        "/pdf/preview/",
                        "/pdf/public/"
                      )}`
                }
                className="flex-1 w-full min-h-0"
                title="Resume PDF Preview"
                onError={() => {
                  setPdfLoadError(true);
                  toast.error(
                    "Failed to load PDF preview. Please try downloading the PDF instead."
                  );
                }}
                onLoad={() => setPdfLoadError(false)}
              />
            )}
          </div>
        </div>
      ) : (
        /* HTML Preview */
        <div
          className={`${isPdfMode ? "hidden" : "block"} ${
            isPanel ? "text-sm" : ""
          } overflow-y-auto scrollbar-hide flex-1 min-h-0`}
        >
          {renderResumeContent()}
        </div>
      )}
    </Card>
  );
};

export default ResumePreview;
