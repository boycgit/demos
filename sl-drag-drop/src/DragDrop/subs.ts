import { ValueOf, getSubRouterPrefix } from 'ide-lib-base-component';
import { IComponentConfig } from 'ide-lib-engine';



export interface ISubProps {
}

// component: 子组件属性列表
export const subComponents: Record<
  keyof ISubProps,
  IComponentConfig<ValueOf<ISubProps>, any>
> = {
};




