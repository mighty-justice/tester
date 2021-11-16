import { IHooks, IHook, ITesterClass } from './interfaces';

class ConfigurationClass {
  public enzyme: any;
  public hooks: { [key: string]: IHook } = {};
  public Tester: ITesterClass;

  public constructor(argTester: ITesterClass) {
    this.Tester = argTester;
    argTester.Configuration = this;
  }

  public configure(enzyme: any, hooks: IHooks) {
    this.enzyme = enzyme;
    this.hooks = hooks;

    return this.Tester;
  }

  public getValidHooks(hookProp: keyof IHook): IHook[] {
    return Object.values(this.hooks).filter(hook => !hookProp || hook[hookProp]);
  }
}

export default ConfigurationClass;
