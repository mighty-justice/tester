import { ComponentType } from 'react';
import ConfigurationClass from './ConfigurationClass';
import { ITesterOpts, IWrapper, IProps } from './interfaces';
declare type ISelectArg = string | {
    simulate: (event: string) => void;
};
/**
 * Testing utility class to mount a specific component with it's required wrappers.
 */
declare class Tester {
    static Configuration: ConfigurationClass;
    opts: ITesterOpts;
    config: ConfigurationClass;
    onBeforeMount?: (tester: Tester) => Promise<void>;
    props: IProps;
    TestedComponent: ComponentType<any>;
    wrapper: any;
    constructor(TestedComponent: ComponentType<any>, opts?: ITesterOpts);
    getWrappers(): IWrapper[];
    get instance(): any;
    get component(): any;
    debug(): void;
    html(): any;
    text(): any;
    find(selector: string | ComponentType<any>): any;
    update(): any;
    sleep(ms?: number): Promise<void>;
    refresh(ms?: number): Promise<void>;
    private getComponent;
    changeInput(selector: ISelectArg, value: string): Promise<void>;
    checkBox(selector: ISelectArg, checked?: boolean): Promise<void>;
    click(selector: ISelectArg): Promise<void>;
    submit(selector?: ISelectArg): Promise<void>;
    mount(mountOpts?: {
        async?: boolean;
    }): Promise<this>;
}
export default Tester;
