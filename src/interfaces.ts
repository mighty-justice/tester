import React, { ComponentType } from 'react';

import Tester from './tester';
import ConfigurationClass from './ConfigurationClass';

export interface IMountOps {
  async?: boolean;
}

export type IOnBeforeMount = (tester: Tester, mountOpts?: IMountOps) => void | Promise<void>;
export type IOnInit = (tester: Tester) => void;
export type IProps = object | ((tester: Tester) => Promise<object>);

export interface IBaseHook {
  [key: string]: any;
  name: string;
  onBeforeMount?: IOnBeforeMount;
  onInit?: IOnInit;
  shortCuts?: { [shortCutName: string]: () => void };
}

export interface IWrapper extends IBaseHook {
  component: ComponentType<any>;
  props?: IProps;
  renderChildren?: boolean;
}

export type IHook = IBaseHook | IWrapper;

export interface IConfig {
  hooks: IHook[];
}

export interface ITesterOpts {
  mount?: React.ReactNode;
  onBeforeMount?: (tester: Tester) => Promise<void>;
  props?: IProps;
  TestedComponent?: ComponentType<any>;
}

export type IBaseTesterClass = typeof Tester;

export interface ITesterClass extends IBaseTesterClass {
  [key: string]: any;
  Configuration: ConfigurationClass;
}
