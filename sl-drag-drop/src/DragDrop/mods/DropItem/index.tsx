import React, { useRef, forwardRef } from 'react';
import useDrop, { IDropConfig } from '../../../lib/useDrop';
import { StyledContainer } from './styles';

export interface IDropitemProps {
  heading: string;
  onDrop: IDropConfig['onDrop']
}
export const DropItem: React.FunctionComponent<IDropitemProps> = props => {
  const { onDrop, children, heading } = props;
  const dropRef = useRef<HTMLDivElement>();
  const { dropState } = useDrop({
    ref: dropRef,
    onDrop
  });
  return (
    <StyledContainer ref={dropRef}>
      <h3>{heading}</h3>
      <div className="body">{children}</div>
    </StyledContainer>
  );
};
