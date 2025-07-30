import { useState, useCallback } from 'react';
import type { ContentItem } from '../types';

export interface DragState {
  isDragging: boolean;
  draggedItem: ContentItem | null;
  dragSource: string | null;
}

export interface DropZone {
  id: string;
  type: 'experience' | 'project';
  accepts: ('experience' | 'project')[];
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragSource: null
  });

  const [dropZones, setDropZones] = useState<DropZone[]>([]);

  // Start dragging an item
  const startDrag = useCallback((item: ContentItem, sourceId: string) => {
    setDragState({
      isDragging: true,
      draggedItem: item,
      dragSource: sourceId
    });
  }, []);

  // End dragging
  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragSource: null
    });
  }, []);

  // Register a drop zone
  const registerDropZone = useCallback((dropZone: DropZone) => {
    setDropZones(prev => {
      const exists = prev.find(zone => zone.id === dropZone.id);
      if (exists) {
        return prev.map(zone => zone.id === dropZone.id ? dropZone : zone);
      }
      return [...prev, dropZone];
    });
  }, []);

  // Unregister a drop zone
  const unregisterDropZone = useCallback((dropZoneId: string) => {
    setDropZones(prev => prev.filter(zone => zone.id !== dropZoneId));
  }, []);

  // Check if an item can be dropped on a zone
  const canDrop = useCallback((item: ContentItem, dropZone: DropZone): boolean => {
    return dropZone.accepts.includes(item.type);
  }, []);

  // Handle drop operation
  const handleDrop = useCallback((dropZoneId: string, onDrop?: (item: ContentItem, dropZoneId: string) => void) => {
    if (dragState.draggedItem && onDrop) {
      const dropZone = dropZones.find(zone => zone.id === dropZoneId);
      if (dropZone && canDrop(dragState.draggedItem, dropZone)) {
        onDrop(dragState.draggedItem, dropZoneId);
      }
    }
    endDrag();
  }, [dragState.draggedItem, dropZones, canDrop, endDrag]);

  return {
    dragState,
    dropZones,
    startDrag,
    endDrag,
    registerDropZone,
    unregisterDropZone,
    canDrop,
    handleDrop
  };
}; 