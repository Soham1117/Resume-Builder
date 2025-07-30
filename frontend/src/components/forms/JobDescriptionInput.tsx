import React, { useState } from "react";
import { FileText, Sparkles, Copy, Trash2, Wifi, WifiOff } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { cn } from "../../utils/cn";
import { useApi } from "../../hooks/useApi";
import type { JobAnalysisResponse } from "../../services/api";

interface JobDescriptionInputProps {
  onAnalyze?: (description: string) => void;
  onClear?: () => void;
  onAnalysisComplete?: (result: JobAnalysisResponse) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onAnalyze,
  onClear,
  onAnalysisComplete,
}) => {
  const [jobDescription, setJobDescription] = useState(() => {
    // Initialize from localStorage if available
    try {
      const saved = localStorage.getItem("jobDescriptionText");
      return saved || "";
    } catch (error) {
      console.error("Error loading job description:", error);
      return "";
    }
  });
  const {
    analyzeJobDescription,
    checkConnection,
    isConnected,
    isAutoChecking,
    isLoading,
    error,
  } = useApi();

  // Save job description to localStorage
  const saveJobDescription = (text: string) => {
    try {
      localStorage.setItem("jobDescriptionText", text);
    } catch (error) {
      console.error("Error saving job description:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    try {
      // Save job description to localStorage
      saveJobDescription(jobDescription);

      // Call the parent callback if provided
      onAnalyze?.(jobDescription);

      // Call the real API
      const result = await analyzeJobDescription(jobDescription);

      if (result) {
        onAnalysisComplete?.(result);
      }
    } catch (error) {
      console.error("Error analyzing job description:", error);
    }
  };

  const handleClear = () => {
    setJobDescription("");
    // Clear job description from localStorage
    try {
      localStorage.removeItem("jobDescriptionText");
    } catch (error) {
      console.error("Error clearing job description:", error);
    }
    onClear?.();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
      // Save pasted text to localStorage
      saveJobDescription(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const wordCount = jobDescription
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Job Description Analysis
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Connection status indicator */}
          <div className="flex items-center space-x-1">
            {isConnected === true ? (
              <>
                <Wifi className="h-4 w-4 text-success-600" />
                <span className="text-xs text-success-600">
                  {isAutoChecking ? "Connected (Auto-monitoring)" : "Connected"}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-error-600" />
                <span className="text-xs text-error-600">Disconnected</span>
              </>
            )}
          </div>

          {/* Only show Check Now button when not connected or not auto-checking */}
          {(isConnected !== true || !isAutoChecking) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={checkConnection}
              className="flex items-center space-x-1"
            >
              <span>Check Now</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            className="flex items-center space-x-1"
          >
            <Copy className="h-4 w-4" />
            <span>Paste</span>
          </Button>
          {jobDescription && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="flex items-center space-x-1 text-error-600 hover:text-error-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Paste the job description here
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => {
            const text = e.target.value;
            setJobDescription(text);
            // Save text to localStorage as user types
            saveJobDescription(text);
          }}
          placeholder="Paste the job description, requirements, and responsibilities here. We'll analyze it and suggest relevant content for your resume."
          className={cn(
            "w-full h-48 px-3 py-2 border border-gray-300 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "resize-none text-sm leading-relaxed"
          )}
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{wordCount} words</span>
          <span>
            Paste job description to get AI-powered content suggestions
          </span>
        </div>
      </div>

      {jobDescription && (
        <div className="space-y-3">
          <Button
            onClick={handleAnalyze}
            loading={isLoading}
            disabled={
              !jobDescription.trim() || isLoading || isConnected === false
            }
            className="w-full flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {isLoading ? "Analyzing..." : "Analyze & Suggest Content"}
            </span>
          </Button>

          <div className="text-xs text-gray-600 space-y-1">
            <p>✨ We'll analyze the job description and suggest:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Relevant experience templates</li>
              <li>Matching project examples</li>
              <li>Key skills and technologies</li>
              <li>Action verbs and achievements</li>
            </ul>
          </div>
        </div>
      )}

      {!jobDescription && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            Paste a job description to get AI-powered content suggestions
          </p>
          <p className="text-xs mt-1">
            We'll analyze the requirements and suggest relevant resume content
          </p>
        </div>
      )}
    </Card>
  );
};

export default JobDescriptionInput;
