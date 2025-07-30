import React, { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import type { ContentItem } from "../../types";

interface DropZoneProps {
  id: string;
  type: "experience" | "project";
  accepts: ("experience" | "project")[];
  onDrop?: (
    item: ContentItem,
    dropZoneId: string,
    dropEvent?: React.DragEvent
  ) => void;
  onReorder?: (
    item: ContentItem,
    dropZoneId: string,
    targetIndex: number
  ) => void;
  children: React.ReactNode;
  className?: string;
  isFull?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({
  id,
  type,
  accepts,
  onDrop,
  onReorder,
  children,
  className,
  isFull = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);

    // Calculate which item would be replaced
    if (isFull) {
      const index = findDropIndex(e);
      setTargetIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dropRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setTargetIndex(-1);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setTargetIndex(-1);

    const draggedItemType = e.dataTransfer.getData("application/json");
    const draggedItemSource = e.dataTransfer.getData("text/plain"); // Source drop zone

    if (draggedItemType) {
      try {
        const item = JSON.parse(draggedItemType) as ContentItem;

        // If item is from the same drop zone, handle reordering
        if (draggedItemSource === id && onReorder) {
          const targetIndex = findDropIndex(e);

          if (targetIndex !== -1) {
            onReorder(item, id, targetIndex);
            return;
          }
        }

        // Otherwise handle normal drop
        if (accepts.includes(item.type)) {
          onDrop?.(item, id, e);
        }
      } catch (error) {
        console.error("Error parsing dragged item:", error);
      }
    }
  };

  // Helper function to find the index where the item should be dropped
  const findDropIndex = (e: React.DragEvent): number => {
    const rect = dropRef.current?.getBoundingClientRect();
    if (!rect) return -1;

    const mouseY = e.clientY - rect.top;
    const items = dropRef.current?.querySelectorAll("[data-draggable-item]");

    if (!items || items.length === 0) return 0;

    for (let i = 0; i < items.length; i++) {
      const itemRect = items[i].getBoundingClientRect();
      const itemTop = itemRect.top - rect.top;
      // const itemBottom = itemTop + itemRect.height; // Unused variable
      const itemCenter = itemTop + itemRect.height / 2;

      // If mouse is above the center of this item, replace this item
      if (mouseY <= itemCenter) {
        return i;
      }
    }

    // If mouse is below all items, replace the last item
    return items.length - 1;
  };

  return (
    <div
      id={id}
      ref={dropRef}
      className={cn(
        "relative min-h-[100px] rounded-lg border-2 border-dashed transition-all duration-200",
        isDragOver && !isFull
          ? "border-blue-400 bg-blue-50"
          : isFull
          ? "border-gray-300 bg-gray-50"
          : "border-gray-300 bg-gray-50/50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Render children with target highlighting */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Only pass targetIndex and isDragOver to DraggableItem components
          if (
            child.type &&
            typeof child.type === "function" &&
            child.type.name === "DraggableItem"
          ) {
            return React.cloneElement(child, {
              targetIndex,
              isDragOver: isDragOver && isFull,
            } as Record<string, unknown>);
          }
          // For other components, just pass through without the drag props
          return child;
        }
        return child;
      })}

      {/* Drop overlay */}
      {isDragOver && !isFull && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-blue-500/10">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-600">
              Drop {type} here
            </div>
          </div>
        </div>
      )}

      {/* Replacement indicator */}
      {isDragOver && isFull && targetIndex !== -1 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded absolute top-2 right-2">
            Will replace item #{targetIndex + 1}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
