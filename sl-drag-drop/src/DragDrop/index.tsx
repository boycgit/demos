import React, { useCallback, useState } from 'react';
import { Button } from 'antd';
import { IBaseTheme, IBaseComponentProps } from 'ide-lib-base-component';

import { TComponentCurrying } from 'ide-lib-engine';

import { StyledContainer, StyledDropArea } from './styles';
import { ISubProps } from './subs';

import { ToDoList } from './example-todo';

export interface IDragDropEvent {
  /**
   * 点击回调函数
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

// export interface IDragDropStyles extends IBaseStyles {
//   container?: React.CSSProperties;
// }

export interface IDragDropTheme extends IBaseTheme {
  main: string;
}

export interface IDragDropProps
  extends IDragDropEvent,
    ISubProps,
    IBaseComponentProps {
  /**
   * 是否展现
   */
  visible?: boolean;

  /**
   * 文案
   */
  text?: string;
}

export const DEFAULT_PROPS: IDragDropProps = {
  visible: true,
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {}
  }
};

export const DragDropCurrying: TComponentCurrying<
  IDragDropProps,
  ISubProps
> = subComponents => props => {
  const { visible, text, styles, onClick } = props;

  const onClickButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick && onClick(e);
    },
    [onClick]
  );

  return (
    <StyledContainer
      style={styles.container}
      visible={visible}
      // ref={this.root}
      className="sl-drag-drop-container"
    >
      <ToDoList />

      <Button onClick={onClickButton}>{text || '点我试试'}</Button>
    </StyledContainer>
  );
};
