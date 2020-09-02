import { IConfig, IHook, ITesterClass } from './interfaces';
declare class ConfigurationClass {
    enzyme: any;
    hooks: {
        [key: string]: IHook;
    };
    Tester: ITesterClass;
    constructor(argTester: ITesterClass);
    configure(enzyme: any, config: IConfig): ITesterClass;
    registerHook(hook: IHook): void;
    getValidHooks(hookProp: string): IHook[];
}
export default ConfigurationClass;
