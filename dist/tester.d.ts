import React from 'react';
import ConfigurationClass from './ConfigurationClass';
import { IProfile, ITesterOpts, IWrapper, ComponentClass } from './interfaces';
/**
 * Testing utility class to mount a specific component with it's required wrappers.
 *
 * @param {ReactComponent} TestedComponent
 * @param {Object} options
 * @returns {Tester}
 */
declare class Tester {
    static Configuration: ConfigurationClass;
    opts: ITesterOpts;
    config: ConfigurationClass;
    initialMount: React.ReactNode;
    onBeforeMount?: (tester: Tester) => Promise<void>;
    profile: IProfile;
    props: object;
    TestedComponent: ComponentClass;
    AppState: any;
    shallow: any;
    wrapper: any;
    constructor(TestedComponent: ComponentClass, opts?: ITesterOpts);
    getWrappers(): IWrapper[];
    readonly instance: any;
    readonly component: any;
    debug(): void;
    html(): any;
    text(): any;
    find(selector: string): any;
    update(): any;
    sleep(ms?: number): Promise<void>;
    refresh(ms?: number): Promise<void>;
    createShallowWrapper(): void;
    mount(mountOpts?: {
        async?: boolean;
    }): Promise<this>;
}
export default Tester;
