import Tester from './tester';
import { IConfig, IHook, IProfile, ITesterClass } from './interfaces';
declare class ConfigurationClass {
    enzyme: any;
    hooks: {
        [key: string]: IHook;
    };
    profiles: {
        [key: string]: IProfile;
    };
    Tester: ITesterClass;
    constructor(argTester: ITesterClass);
    configure(enzyme: any, config: IConfig): ITesterClass;
    createShortcuts(): void;
    registerHook(hook: IHook): void;
    registerProfile(profile: IProfile): void;
    getValidHooks(tester: Tester, hookProp: string): IHook[];
}
export default ConfigurationClass;
