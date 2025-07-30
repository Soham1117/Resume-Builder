import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, X, FolderOpen } from "lucide-react";
import type { ContentItem } from "../../types";
import DraggableItem from "./DraggableItem";
import Input from "../ui/Input";

interface ContentLibraryProps {
  items: ContentItem[];
  onItemSelect?: (item: ContentItem) => void;
  onDragStart?: (item: ContentItem) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  draggedItemId?: string;
  onCollapse?: () => void;
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({
  items,
  onItemSelect,
  onDragStart,
  onDragEnd,
  isDragging,
  draggedItemId,
  onCollapse,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["experiences", "projects"])
  );

  const categories = [
    { id: "all", name: "All Content", type: "all" },
    { id: "experiences", name: "Experience Templates", type: "experience" },
    { id: "projects", name: "Project Templates", type: "project" },
    { id: "skills", name: "Skill Sets", type: "skill" },
    { id: "achievements", name: "Achievements", type: "achievement" },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || item.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <FolderOpen className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Content Library</h3>
        </div>
        <button
          onClick={onCollapse}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          title="Hide content library"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Drag items to replace content in your resume
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Filter by:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.type}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content Items */}
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([type, typeItems]) => {
            const category = categories.find((c) => c.type === type);
            const isExpanded = expandedCategories.has(type);

            return (
              <div key={type} className="space-y-2">
                <button
                  onClick={() => toggleCategory(type)}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700">
                    {category?.name || type}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({typeItems.length})
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-2 pl-2">
                    {typeItems.map((item) => (
                      <DraggableItem
                        key={item.id}
                        item={item}
                        onSelect={onItemSelect}
                        onDragStart={(item) => {
                          // Starting drag for item
                          onDragStart?.(item);
                        }}
                        onDragEnd={onDragEnd}
                        isDragging={isDragging && draggedItemId === item.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No content found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;
