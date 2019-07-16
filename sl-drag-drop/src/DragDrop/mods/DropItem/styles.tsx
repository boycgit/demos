import styled from 'styled-components';
// import { desaturate } from 'polished';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { IDropitemProps } from './index';

interface IStyledProps extends IDropitemProps, IBaseStyledProps {}

export const StyledContainer = styled.div`
  width: 50%;
  background: #dfe3e6;
  border-radius: 5px;
  margin-right: 40px;
  padding: 0 10px;
`;
