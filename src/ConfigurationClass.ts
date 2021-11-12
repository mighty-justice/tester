import { IConfig, IHook, ITesterClass } from './interfaces';

/*
  Tester Configuration Class
*/
class ConfigurationClass {
  public enzyme: any;
  public hooks: { [key: string]: IHook } = {};
  public Tester: ITesterClass;

  public constructor(argTester: ITesterClass) {
    this.Tester = argTester;
    argTester.Configuration = this;
  }

  public configure(enzyme: any, config: IConfig) {
    this.enzyme = enzyme;

    if (config.hooks) {
      config.hooks.forEach((hook: IHook) => {
        this.registerHook(hook);
      });
    }

    return this.Tester;
  }

  /*
    Hooks,
    {
      name: string,
      component: React.Component,
      props: object || fn(), // fn() allows this.AppState to be set for e.g
      onInit: fn(),
      onBeforeMount: fn(),
      shortCuts: {shortCutName: fn()},
      wrapper: fn() => { Component: React.Component, name: string, props: object }
    }

    Note: Order is important!
  */
  public registerHook(hook: IHook) {
    if (!hook.name) {
      throw new Error('Tester.registerHook() : A hooks must have a name.');
    }
    if (this.hooks[hook.name]) {
      throw new Error(`Tester.registerHook() : A hook named "${hook.name}" already exist.`);
    }

    this.hooks[hook.name] = hook;
  }

  public getValidHooks(hookProp: string): IHook[] {
    return Object.values(this.hooks).filter(hook => !hookProp || hook[hookProp]);
  }
}

export default ConfigurationClass;
