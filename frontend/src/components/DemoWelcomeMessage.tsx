import React, { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import { useDemo } from "../context/DemoContext";
import Button from "./ui/Button";

const DemoWelcomeMessage: React.FC = () => {
  const { isDemoUser, hasCompletedDemo, startDemo, isDemoActive } = useDemo();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isDemoUser && !hasCompletedDemo && !isDemoActive) {
      // Show welcome message after a short delay
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isDemoUser, hasCompletedDemo, isDemoActive]);

  if (!showWelcome) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to your Resume Builder! 🎉
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Hi Test User! We've prepared a comprehensive demo to help you
            understand all the features of your resume builder. Your account is
            pre-populated with sample data to showcase the full potential of the
            application.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              What you'll learn:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• How to navigate different resume sections</li>
              <li>• Using the AI job analysis feature</li>
              <li>• Generating professional PDF resumes</li>
              <li>• Managing your content effectively</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowWelcome(false)}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Skip Demo
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setShowWelcome(false);
                startDemo();
              }}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoWelcomeMessage;
