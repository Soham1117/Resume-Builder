import React from "react";
import { Briefcase, FolderOpen, GripVertical } from "lucide-react";
import Card from "../ui/Card";
import type { ContentItem } from "../../types";

interface DraggableItemProps {
  item: ContentItem;
  onSelect?: (item: ContentItem) => void;
  isDragging?: boolean;
  onDragStart?: (item: ContentItem) => void;
  onDragEnd?: () => void;
  sourceDropZone?: string;
  "data-draggable-item"?: number;
  targetIndex?: number;
  isDragOver?: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  onSelect,
  isDragging = false,
  onDragStart,
  onDragEnd,
  sourceDropZone,
  "data-draggable-item": draggableItemId,
  targetIndex = -1,
  isDragOver = false,
}) => {
  const isReplaceTarget =
    isDragOver && targetIndex !== -1 && Number(draggableItemId) === targetIndex;
  const handleClick = () => {
    onSelect?.(item);
  };

  const handleDragStart = (e: React.DragEvent) => {
    // Starting drag for item
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify(item));

    // Set the source drop zone for reordering
    if (sourceDropZone) {
      e.dataTransfer.setData("text/plain", sourceDropZone);
    }

    // Create a simple drag image instead of cloning the entire element
    const dragImage = document.createElement("div");
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.left = "-1000px";
    dragImage.style.width = "200px";
    dragImage.style.padding = "8px";
    dragImage.style.background = "white";
    dragImage.style.border = "1px solid #e5e7eb";
    dragImage.style.borderRadius = "8px";
    dragImage.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    dragImage.style.fontSize = "12px";
    dragImage.style.color = "#374151";
    dragImage.textContent = `${item.title}${
      item.company ? ` at ${item.company}` : ""
    }`;

    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 100, 20); // Center the drag image

    // Remove the drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);

    // Drag data set
    onDragStart?.(item);
  };

  const handleDragEnd = () => {
    // Clean up any drag state if needed
    onDragEnd?.();
  };

  const getIcon = () => {
    switch (item.type) {
      case "experience":
        return <Briefcase className="h-4 w-4" />;
      case "project":
        return <FolderOpen className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  // Ensure technologies is an array and has content
  const technologies = Array.isArray(item.technologies)
    ? item.technologies
    : [];

  return (
    <div
      draggable
      className={`group cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95 shadow-lg" : "hover:shadow-md"
      }`}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      data-draggable-item={draggableItemId}
    >
      <Card
        className={`p-3 transition-all duration-200 ${
          isDragging ? "border-primary-400 bg-primary-50" : ""
        } ${
          isReplaceTarget ? "border-red-400 bg-red-50 ring-2 ring-red-200" : ""
        }`}
      >
        <div className="flex items-start space-x-2">
          <div className="text-gray-400 mt-0.5 group-hover:text-primary-600 transition-colors">
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="text-primary-600 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {item.title}
            </h4>
            {item.company && (
              <p className="text-xs text-gray-600 truncate">{item.company}</p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {item.bulletPoints && item.bulletPoints.length > 0 ? (
                <ul className="space-y-0.5 list-disc list-inside">
                  {item.bulletPoints.slice(0, 2).map((point, index) => (
                    <li key={index} className="line-clamp-1">
                      {point}
                    </li>
                  ))}
                  {item.bulletPoints.length > 2 && (
                    <li className="text-gray-400">
                      +{item.bulletPoints.length - 2} more...
                    </li>
                  )}
                </ul>
              ) : (
                <p className="line-clamp-2">{item.description}</p>
              )}
            </div>
            {isReplaceTarget && (
              <div className="mt-1 text-xs text-red-600 font-medium">
                ⚠️ Will be replaced
              </div>
            )}
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 3 && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    +{technologies.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DraggableItem;
