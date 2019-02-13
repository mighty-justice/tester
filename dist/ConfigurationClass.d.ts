import Tester from './tester';
import { IConfig, IHook, IProfile, TesterClass } from './interfaces';
declare class ConfigurationClass {
    enzyme: any;
    hooks: {
        [key: string]: IHook;
    };
    profiles: {
        [key: string]: IProfile;
    };
    Tester: TesterClass;
    constructor(Tester: TesterClass);
    configure(enzyme: any, config: IConfig): TesterClass;
    createShortcuts(): void;
    registerHook(hook: IHook): void;
    registerProfile(profile: IProfile): void;
    getValidHooks(tester: Tester, hookProp: string): IHook[];
}
export default ConfigurationClass;
