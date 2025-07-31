import React from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import Button from './ui/Button';

const DemoRestartButton: React.FC = () => {
  const { isDemoUser, hasCompletedDemo, startDemo, isDemoActive } = useDemo();

  // Only show for demo user
  if (!isDemoUser) {
    return null;
  }

  // Don't show if demo is currently active
  if (isDemoActive) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        variant="primary"
        size="sm"
        onClick={startDemo}
        className="shadow-lg hover:shadow-xl transition-shadow"
        title={hasCompletedDemo ? "Restart demo walkthrough" : "Start demo walkthrough"}
      >
        {hasCompletedDemo ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Restart Demo
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start Demo
          </>
        )}
      </Button>
    </div>
  );
};

export default DemoRestartButton; 