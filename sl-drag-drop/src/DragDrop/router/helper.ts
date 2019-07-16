import { IContext as IEtteContext } from 'ette';
import { IStoresModel } from 'ide-lib-engine';
export interface IContext extends IEtteContext{
  stores: IStoresModel;
  [propName: string]: any;
}


