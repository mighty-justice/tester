import React, { Component } from 'react';
import Tester from './tester';
import ConfigurationClass from './ConfigurationClass';
export declare type ComponentClass = React.FC | {
    new (): Component<any>;
};
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
    onBeforeMount: (tester: Tester, mountOpts: IMountOps) => Promise<void>;
    onInit: (tester: Tester) => void;
    props: object | (() => void);
    shortCuts: {
        [shortCutName: string]: () => void;
    };
    wrapper: () => {
        Component: ComponentClass;
        name: string;
        props: object;
    };
}
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
export declare type IBaseTesterClass = typeof Tester;
export interface TesterClass extends IBaseTesterClass {
    [key: string]: any;
    Configuration: ConfigurationClass;
}
