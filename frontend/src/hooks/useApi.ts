import { useState, useCallback, useEffect, useRef } from "react";
import { apiService } from "../services/api";
import type {
  JobAnalysisResponse,
  CacheStats,
  GenerateResumeRequest,
  GenerateResumeResponse,
  CoverLetterRequest,
  CoverLetterResponse,
} from "../services/api";
import type { ResumeBlock } from "../utils/dataTransform";
import toast from "react-hot-toast";

// Backend response interface
interface BackendResumeData {
  experiences: ResumeBlock[];
  projects: ResumeBlock[];
}

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(() => {
    // Initialize from localStorage if available
    try {
      const saved = localStorage.getItem('connectionState');
      if (saved) {
        const state = JSON.parse(saved);
        return state.isConnected;
      }
    } catch (error) {
      console.error('Error loading connection state:', error);
    }
    return null;
  });
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save connection state to localStorage
  const saveConnectionState = useCallback((connected: boolean, autoChecking: boolean) => {
    try {
      const state = { isConnected: connected, isAutoChecking: autoChecking };
      localStorage.setItem('connectionState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving connection state:', error);
    }
  }, []);

  // Check backend connection (silent version for periodic checks)
  const checkConnectionSilent = useCallback(async () => {
    try {
      const connected = await apiService.healthCheck();
      setIsConnected(connected);
      saveConnectionState(connected, isAutoChecking);
      if (!connected) {
        // Stop periodic checks if disconnected
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsAutoChecking(false);
        saveConnectionState(false, false);
      }
      return connected;
    } catch {
      setIsConnected(false);
      saveConnectionState(false, isAutoChecking);
      // Stop periodic checks on error
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAutoChecking(false);
      saveConnectionState(false, false);
      return false;
    }
  }, [isAutoChecking, saveConnectionState]);

  // Check backend connection (with notifications and auto-start periodic checks)
  const checkConnection = useCallback(async () => {
    try {
      const connected = await apiService.healthCheck();
      setIsConnected(connected);
      if (connected) {
        toast.success("Connected to backend successfully");
        // Auto-start periodic checks on successful connection
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsAutoChecking(true);
        saveConnectionState(connected, true);
        intervalRef.current = setInterval(() => {
          checkConnectionSilent();
        }, 30000);
      } else {
        toast.error("Backend connection failed");
        saveConnectionState(connected, false);
        // Stop periodic checks on failure
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsAutoChecking(false);
      }
      return connected;
    } catch {
      setIsConnected(false);
      toast.error("Backend connection failed");
      saveConnectionState(false, false);
      // Stop periodic checks on error
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAutoChecking(false);
      return false;
    }
  }, [checkConnectionSilent, saveConnectionState]);



  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Analyze job description
  const analyzeJobDescription = useCallback(
    async (jobDescription: string): Promise<JobAnalysisResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiService.analyzeJobDescription(jobDescription);
        toast.success("Job description analyzed successfully!");
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to analyze job description";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get resume blocks
  const getResumeBlocks =
    useCallback(async (): Promise<BackendResumeData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiService.getResumeBlocks();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch resume blocks";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  // Generate resume (PDF/LaTeX)
  const generateResume = useCallback(
    async (
      request: GenerateResumeRequest
    ): Promise<GenerateResumeResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiService.generateResume(request);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate resume";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Generate cover letter
  const generateCoverLetter = useCallback(
    async (
      request: CoverLetterRequest
    ): Promise<CoverLetterResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiService.generateCoverLetter(request);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate cover letter";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Test LaTeX generation
  const testLatexGeneration = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.testLatexGeneration();
      toast.success("LaTeX generation test successful!");
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to test LaTeX generation";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get cache stats
  const getCacheStats = useCallback(async (): Promise<CacheStats | null> => {
    try {
      const result = await apiService.getCacheStats();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get cache stats";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(async (): Promise<boolean> => {
    try {
      await apiService.clearCache();
      toast.success("Cache cleared successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear cache";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    isConnected,
    isAutoChecking,

    // Actions
    checkConnection,
    analyzeJobDescription,
    getResumeBlocks,
    generateResume,
    generateCoverLetter,
    testLatexGeneration,
    getCacheStats,
    clearCache,
    clearError,
  };
};
