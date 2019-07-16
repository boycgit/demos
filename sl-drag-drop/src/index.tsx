import { Instance } from 'mobx-state-tree';
import { initSuitsFromConfig } from 'ide-lib-engine';

export * from './DragDrop/config';
export * from './DragDrop/';

import { DragDropCurrying } from './DragDrop/';
import { configDragDrop } from './DragDrop/config';

const {
    ComponentModel: DragDropModel,
    StoresModel: DragDropStoresModel,
    NormalComponent: DragDrop,
    ComponentHOC: DragDropHOC,
    ComponentAddStore: DragDropAddStore,
    ComponentFactory: DragDropFactory
} = initSuitsFromConfig(DragDropCurrying,configDragDrop);

export {
    DragDropModel,
    DragDropStoresModel,
    DragDrop,
    DragDropHOC,
    DragDropAddStore,
    DragDropFactory
};

export interface IDragDropModel extends Instance<typeof DragDropModel> { }
