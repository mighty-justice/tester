import React, { ComponentType } from 'react';
import Tester from './tester';
import ConfigurationClass from './ConfigurationClass';
export interface IMountOps {
    async?: boolean;
}
export declare type IOnBeforeMount = (tester: Tester, mountOpts?: IMountOps) => void | Promise<void>;
export declare type IOnInit = (tester: Tester) => Promise<void>;
export interface IBaseHook {
    [key: string]: any;
    name: string;
    onBeforeMount?: IOnBeforeMount;
    onInit?: IOnInit;
    shortCuts?: {
        [shortCutName: string]: () => void;
    };
}
export interface IWrapper extends IBaseHook {
    component: ComponentType;
    props?: object | ((tester: Tester) => Promise<object>);
    renderChildren?: boolean;
}
export declare type IHook = IBaseHook | IWrapper;
export interface IConfig {
    hooks: IHook[];
}
export interface ITesterOpts {
    mount?: React.ReactNode;
    onBeforeMount?: (tester: Tester) => Promise<void>;
    props?: object | ((tester: Tester) => Promise<object>);
    TestedComponent?: ComponentType;
}
export declare type IBaseTesterClass = typeof Tester;
export interface ITesterClass extends IBaseTesterClass {
    [key: string]: any;
    Configuration: ConfigurationClass;
}
