import styled from 'styled-components';
// import { desaturate } from 'polished';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { IDragItemProps } from './index';

interface IStyledProps extends IDragItemProps, IBaseStyledProps {}

export const StyledItem = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {} // 优先级会高一些，行内样式
})<IStyledProps>`
  background: white;
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  text-align: left;
  box-shadow: 0 1px 0 rgba(9, 45, 66, 0.25);
`;
