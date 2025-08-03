import React from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import type { CoverLetterResponse } from "../types";
import { api } from "../services/api";
import { useEffect } from "react";

interface CoverLetterPreviewProps {
  coverLetter: CoverLetterResponse | null;
  isLoading: boolean;
  onRegenerate?: () => void;
  onDownload?: () => void;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  coverLetter,
  isLoading,
  onRegenerate,
  onDownload,
}) => {
  useEffect(() => {
    if (coverLetter) {
      console.log(
        "Constructed PDF URL:",
        `${api.defaults.baseURL}/resume/pdf/public/${coverLetter.fileName}`
      );
    }
  }, [coverLetter]);
  if (isLoading) {
    return (
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cover Letter Preview
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary-600" />
            <span className="text-sm text-gray-600">
              Generating cover letter...
            </span>
          </div>
        </div>
      </Card>
    );
  }

  if (!coverLetter) {
    return (
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cover Letter Preview
            </h3>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No cover letter generated yet</p>
          <p className="text-xs mt-1">
            Generate a cover letter to see the preview here
          </p>
        </div>
      </Card>
    );
  }

  if (!coverLetter.success) {
    return (
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-error-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cover Letter Preview
            </h3>
          </div>
        </div>
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">
            {coverLetter.errorMessage || "Failed to generate cover letter"}
          </p>
          {onRegenerate && (
            <Button
              onClick={onRegenerate}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 h-[80vh]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Cover Letter Preview
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {onRegenerate && (
            <Button
              onClick={onRegenerate}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate</span>
            </Button>
          )}
          {onDownload && (
            <Button
              onClick={onDownload}
              variant="primary"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white">
        <iframe
          src={`${api.defaults.baseURL}/resume/pdf/public/${coverLetter.fileName}`}
          className="w-full h-[70vh] border-0"
          title="Cover Letter Preview"
          onLoad={() => {
            console.log(
              "Cover letter PDF loaded successfully:",
              coverLetter.fileName
            );
          }}
          onError={(e) => {
            console.error("Failed to load cover letter PDF:", e);
            console.error(
              "PDF URL:",
              `${api.defaults.baseURL}/resume/pdf/public/${coverLetter.fileName}`
            );
          }}
        />
        <div className="p-4 text-center text-sm text-gray-500">
          <p>
            If the PDF doesn't load, you can
            <a
              href={`${api.defaults.baseURL}/resume/pdf/public/${coverLetter.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline ml-1"
            >
              view it in a new tab
            </a>
            or download it using the button above.
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>Generated cover letter will be saved as: {coverLetter.fileName}</p>
      </div>
    </Card>
  );
};

export default CoverLetterPreview;
