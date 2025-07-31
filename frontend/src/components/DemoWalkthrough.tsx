import React, { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from "lucide-react";
import { useDemo } from "../context/DemoContext";
import Button from "./ui/Button";

const DemoWalkthrough: React.FC = () => {
  const {
    isDemoActive,
    currentStep,
    totalSteps,
    demoSteps,
    nextStep,
    previousStep,
    skipDemo,
    stopDemo,
  } = useDemo();

  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDemoActive) return;

      switch (event.key) {
        case "Escape":
          skipDemo();
          break;
        case "ArrowRight":
        case " ":
          event.preventDefault();
          nextStep();
          break;
        case "ArrowLeft":
          event.preventDefault();
          previousStep();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDemoActive, nextStep, previousStep, skipDemo]);

  // Handle clicks outside the demo overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        // Don't close on outside clicks to prevent accidental dismissal
        // Only allow closing via explicit buttons
      }
    };

    if (isDemoActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDemoActive]);

  if (!isDemoActive) {
    return null;
  }

  const currentDemoStep = demoSteps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" />

      {/* Demo Overlay */}
      <div
        ref={overlayRef}
        className={`fixed z-50 max-w-md bg-white rounded-lg shadow-2xl border border-gray-200 ${
          currentDemoStep.position === "top"
            ? "top-4 left-1/2 transform -translate-x-1/2"
            : currentDemoStep.position === "bottom"
            ? "bottom-4 left-1/2 transform -translate-x-1/2"
            : currentDemoStep.position === "left"
            ? "left-4 top-1/2 transform -translate-y-1/2 translate-x-1/2"
            : "right-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {currentDemoStep.title}
              </h3>
              <p className="text-xs text-gray-500">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
          </div>
          <button
            onClick={skipDemo}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Skip demo"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {currentDemoStep.content}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-primary-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousStep}
              disabled={currentStep === 0}
              className="text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipDemo}
              className="text-gray-600 hover:text-gray-800"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Skip
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={currentStep === totalSteps - 1 ? stopDemo : nextStep}
            >
              {currentStep === totalSteps - 1 ? "Finish" : "Next"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Arrow pointing to target section */}
        {currentDemoStep.targetSection && (
          <div
            className={`absolute w-0 h-0 border-8 border-transparent ${
              currentDemoStep.position === "right"
                ? "border-r-white -left-2 top-1/2 transform -translate-y-1/2"
                : currentDemoStep.position === "left"
                ? "border-l-white -right-2 top-1/2 transform -translate-y-1/2"
                : currentDemoStep.position === "top"
                ? "border-t-white -bottom-2 left-1/2 transform -translate-x-1/2"
                : "border-b-white -top-2 left-1/2 transform -translate-x-1/2"
            }`}
          />
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs">
        <div className="flex items-center space-x-4">
          <span>← → Navigate</span>
          <span>Space Next</span>
          <span>Esc Skip</span>
        </div>
      </div>
    </>
  );
};

export default DemoWalkthrough;
