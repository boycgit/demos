import * as React from 'react';
import { render } from 'react-dom';
import { DragDrop, DragDropFactory, IDragDropProps } from '../src/';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

const { ComponentWithStore: DragDropWithStore, client } = DragDropFactory();

function onClick(value) {
  console.log('当前点击：', value);
}
function onClickWithStore(value) {
  client.put(`/model`, {
    name: 'text',
    value: `gggg${Math.random()}`.slice(0, 8)
  });

}

const props: IDragDropProps = {
  visible: true
};

render(
  <DragDropWithStore onClick={onClickWithStore} />,
  document.getElementById('example') as HTMLElement
);

client.post('/model', {
  model: {
    visible: true,
    text: `text${Math.random()}`.slice(0, 8)
  }
});
