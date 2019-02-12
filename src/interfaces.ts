import React, { Component } from 'react';

import Tester from './tester';
import ConfigurationClass from './ConfigurationClass';

export type ComponentClass = React.FC | { new(): Component<any> };

export interface IMountOps {
  async?: boolean;
}

export interface IWrapper {
  component: ComponentClass;
  name: string;
  props: object;
  renderChildren?: boolean;
}

export interface IHook extends IWrapper {
  [key: string]: any;
  onBeforeMount: (tester: Tester, ops: IMountOps) => void;
  onInit: (tester: Tester) => void;
  props: object | (() => void); // fn() allows this.AppState to be set for e.g
  shortCuts: { [shortCutName: string]: () => void };
  wrapper: () => { Component: Component, name: string, props: object };
}

export interface IProfile {
  [key: string]: boolean | string;
  name: string;
}

export interface IConfig {
  hooks: IHook[];
  profiles: IProfile[];
}

export interface ITesterOps {
  mount?: React.ReactNode;
  onBeforeMount?: (tester: Tester) => Promise<void>;
  profile?: IProfile;
  props?: object;
  shallow?: boolean;
  TestedComponent?: Component;
}

export type IBaseTesterClass = typeof Tester;

export interface TesterClass extends IBaseTesterClass {
  [key: string]: any;
  Configuration: ConfigurationClass;
}
