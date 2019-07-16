import { useState, useEffect } from 'react';


export enum EDropState {
  ABLE = 'droppable',
  OVER = 'dragging-over',
  DONE = 'dropped'
}

export interface IDropConfig {
  ref: React.RefObject<any>;
  onDrop?: (id?: string) => void;
}

const useDrop = ({ ref, onDrop }: IDropConfig) => {
  const [dropState, updateDropState] = useState(EDropState.ABLE);
  const dropOverCb = (ev: React.DragEvent) => {
    ev.preventDefault();
    updateDropState(EDropState.OVER);
  };

  const dropCb = (ev: React.DragEvent) => {
    ev.preventDefault();
    onDrop && onDrop(ev.dataTransfer.getData('source'));
    console.log(1111, ev);
    updateDropState(EDropState.DONE);
  };
  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.addEventListener('dragover', dropOverCb);
      elem.addEventListener('drop', dropCb);
      return () => {
        elem.removeEventListener('dragover', dropOverCb);
        elem.removeEventListener('drop', dropCb);
      };
    }
  });
  return {
    dropState
  };
};

export default useDrop;
