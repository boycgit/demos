import Router from 'ette-router';
import { buildNormalResponse } from 'ide-lib-base-component';
import { createModel } from 'ide-lib-engine';

import { IContext } from './helper';
import { DragDropModel } from '../../index';


export const router = new Router();

// 创新新的 model 
router.post('createModel', '/model', function (ctx: IContext) {
  const { stores, request } = ctx;
  const { model } = request.data;

  stores.setModel(createModel(DragDropModel, model));

  buildNormalResponse(ctx, 200, { success: true });
});