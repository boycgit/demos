import React, { useCallback, useState } from 'react';
import { DragItem } from './mods/DragItem';
import { DropItem } from './mods/DropItem';
import { StyledDropArea } from './styles';

const todos: Record<string, any> = {
  1: {
    text: 'First thing',
    state: 'todo'
  },
  2: {
    text: 'Second thing',
    state: 'todo'
  },
  3: {
    text: 'Third thing',
    state: 'todo'
  },
  4: {
    text: 'Fourth thing',
    state: 'todo'
  }
};

export const ToDoList: React.FC<{}> = props => {
  const [todoValues, setValue] = useState(todos);

  return (
    <StyledDropArea>
      <DropItem
        heading="Todos"
        onDrop={(id: string) => {
          const currentTodo = { ...todoValues[id] };
          currentTodo.state = 'todo';
          setValue({ ...todoValues, ...{ [id]: currentTodo } });
        }}
      >
        {Object.keys(todoValues)
          .map(key => ({ id: key, ...todoValues[key] }))
          .filter(todo => todo.state === 'todo')
          .map(todo => (
            <DragItem id={todo.id} text={todo.text} key={todo.id} />
          ))}
      </DropItem>
      <DropItem
        heading="WIP"
        onDrop={id => {
          const currentTodo = { ...todoValues[id] };
          currentTodo.state = 'wip';
          setValue({ ...todoValues, ...{ [id]: currentTodo } });
        }}
      >
        {Object.keys(todoValues)
          .map(key => ({ id: key, ...todoValues[key] }))
          .filter(todo => todo.state === 'wip')
          .map(todo => (
            <DragItem id={todo.id} text={todo.text} key={todo.id} />
          ))}
      </DropItem>
      <DropItem
        heading="Done"
        onDrop={id => {
          const currentTodo = { ...todoValues[id] };
          currentTodo.state = 'done';
          setValue({ ...todoValues, ...{ [id]: currentTodo } });
        }}
      >
        {Object.keys(todoValues)
          .map(key => ({ id: key, ...todoValues[key] }))
          .filter(todo => todo.state === 'done')
          .map(todo => (
            <DragItem id={todo.id} text={todo.text} key={todo.id} />
          ))}
      </DropItem>
    </StyledDropArea>
  );
};
