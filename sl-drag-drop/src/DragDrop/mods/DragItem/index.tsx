import React, { useRef, forwardRef, useState } from 'react';
import useDrag from '../../../lib/useDrag';
import { StyledItem } from './styles';

export interface IDragItemProps {
  dragEffect?: string;
  id?: string;
  text?: string;
  onDrag?: () => void;
}
export const DragItem: React.FunctionComponent<IDragItemProps> = props => {
  const { dragEffect, text, id } = props;
  const [classValue, setClassValue] = useState('grab');
  const dragRef = useRef();
  const { dragState } = useDrag({
    id,
    effect: dragEffect,
    ref: dragRef,
    onDragStart: () => setClassValue('grabbing'),
    onDragEnd: () => {
      setClassValue('grab');
    }
  });
  return (
    <StyledItem ref={dragRef} type={classValue}>
      {text}
    </StyledItem>
  );
};
