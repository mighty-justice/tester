import React, { Component } from 'react';

import Tester from './tester';
import ConfigurationClass from './ConfigurationClass';

export type ComponentClass = React.FC | (new (props: any) => Component<any>);

export interface IMountOps {
  async?: boolean;
}

export type IOnBeforeMount = (tester: Tester, mountOpts?: IMountOps) => void | Promise<void>;
export type IOnInit = (tester: Tester) => void;

export interface IBaseHook {
  [key: string]: any;
  name: string;
  onBeforeMount?: IOnBeforeMount;
  onInit?: IOnInit;
  shortCuts?: { [shortCutName: string]: () => void };
}

export interface IWrapper extends IBaseHook {
  component: ComponentClass;
  props?: object | (() => void); // fn() allows this.AppState to be set for e.g
  renderChildren?: boolean;
}

export type IHook = IBaseHook | IWrapper;

export interface IProfile {
  [key: string]: boolean | string;
  name: string;
}

export interface IConfig {
  hooks: IHook[];
  profiles: IProfile[];
}

export interface ITesterOpts {
  mount?: React.ReactNode;
  onBeforeMount?: (tester: Tester) => Promise<void>;
  profile?: IProfile;
  props?: object;
  shallow?: boolean;
  TestedComponent?: ComponentClass;
}

export type IBaseTesterClass = typeof Tester;

export interface ITesterClass extends IBaseTesterClass {
  [key: string]: any;
  Configuration: ConfigurationClass;
}
