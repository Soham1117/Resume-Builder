import React from 'react';
import { Download, Settings, Sun, Moon, Upload, Database, LogOut } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  onExport?: () => void;
  onSettings?: () => void;
  onLoadData?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  isSaving?: boolean;
  hasStoredData?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onExport,
  onSettings,
  onLoadData,
  onLogout,
  isDarkMode = false,
  onToggleTheme,
  isSaving = false,
  hasStoredData = false
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">
            Resume Builder
          </h1>
          <span className="text-sm text-gray-500">
            Professional Resume Creator
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Data Persistence Controls */}
          {onLoadData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadData}
              disabled={isSaving}
              className={`flex items-center space-x-2 ${hasStoredData ? 'text-green-600 border-green-600' : ''}`}
            >
              <Upload className="h-4 w-4" />
              <span>Load Data</span>
              {hasStoredData && <Database className="h-3 w-3" />}
            </Button>
          )}
          
          {onToggleTheme && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className="p-2"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
          
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
          )}
          
          {onSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="p-2"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          
          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center space-x-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 