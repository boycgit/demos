import { useState, useEffect } from 'react';

export interface IDrapConfig {
  id: string;
  ref: React.RefObject<any>;
  effect?: string;
  onDragStart?: (ev: React.DragEvent) => void;
  onDragOver?: (ev: React.DragEvent) => void;
  onDragEnd?: (ev: React.DragEvent) => void;
}

export enum EDragState {
  ABLE = 'draggable',
  START = 'dragStart',
  ING = 'dragging'
}

const useDrag = ({
  id,
  effect,
  ref,
  onDragStart,
  onDragOver,
  onDragEnd
}: IDrapConfig) => {
  const [dragState, updateDragState] = useState(EDragState.ABLE);
  const dragStartCb = (ev: React.DragEvent) => {
    updateDragState(EDragState.START);
    if (effect) {
      ev.dataTransfer.dropEffect = effect;
    }
    ev.dataTransfer.setData('source', id);
    onDragStart && onDragStart(ev);
  };
  const dragOverCb = (ev: React.DragEvent) => {
    updateDragState(EDragState.ING);
    onDragOver && onDragOver(ev);
  };

  const dragEndCb = (ev: React.DragEvent) => {
    updateDragState(EDragState.ABLE);
    // if (effect === "move") {
    //   updateDragState("moved");
    // }
    onDragEnd && onDragEnd(ev);
  };
  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.setAttribute('draggable', true);
      elem.addEventListener('dragstart', dragStartCb);
      elem.addEventListener('dragover', dragOverCb);
      elem.addEventListener('dragend', dragEndCb);
      return () => {
        elem.removeEventListener('dragstart', dragStartCb);
        elem.removeEventListener('dragover', dragOverCb);
        elem.removeEventListener('dragend', dragEndCb);
      };
    }
  }, []);
  return {
    dragState: dragState
  };
};

export default useDrag;
