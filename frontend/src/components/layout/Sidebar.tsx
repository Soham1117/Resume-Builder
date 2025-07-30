import React from 'react';
import { cn } from '../../utils/cn';

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  count?: number;
}

interface SidebarProps {
  sections: SidebarSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  onSectionChange
}) => {
  return (
    <aside className="w-16 bg-white border-r border-gray-200 p-2 flex flex-col items-center">
      <div className="space-y-2 w-full">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center leading-tight">
          Menu
        </h2>
        
        {sections.map((section) => (
          <div key={section.id} className="relative group">
            <button
              onClick={() => onSectionChange(section.id)}
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 relative',
                activeSection === section.id
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={section.title}
            >
              <div className={cn(
                'h-5 w-5',
                activeSection === section.id ? 'text-primary-600' : 'text-gray-400'
              )}>
                {section.icon}
              </div>
              
              {section.count !== undefined && section.count > 0 && (
                <span className={cn(
                  'absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full min-w-[18px] text-center',
                  activeSection === section.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {section.count}
                </span>
              )}
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {section.title}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar; 