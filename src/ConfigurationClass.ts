import Tester from './tester';
import { capitalize } from './utils';
import { ComponentClass, IConfig, IHook, IProfile, TesterClass } from './interfaces';

/*
  Tester Configuration Class
*/
class ConfigurationClass {
  enzyme: any;
  hooks: { [key: string]: IHook } = {};
  profiles: { [key: string]: IProfile } = {
    // Default profile, each of it's properties can be overwritten.
    Default: {} as IProfile,
  };
  Tester: TesterClass;

  constructor (Tester: TesterClass) {
    this.Tester = Tester;
    Tester.Configuration = this;
  }

  configure (enzyme: any, config: IConfig) {
    this.enzyme = enzyme;

    if (config.hooks) {
      config.hooks.forEach((hook: IHook) => {
        this.registerHook(hook);
      });
    }

    if (config.profiles) {
      config.profiles.forEach((profile) => {
        this.registerProfile(profile);
      });
    }

    this.createShortcuts();

    return this.Tester;
  }

  /*
    Create shortcuts for each global profiles
    Tester shortcuts allows you to use a specific global profile without having to pass it in in the options.

    E.g.
    Using a new Tester.Light(MyComponent) allows you to skip the initialization of Transport, localStorage + Session and AppState.
  */
  createShortcuts () {
    Object.keys(this.profiles).forEach((profileKey) => {
      this.Tester[profileKey] = (TestedComponent: ComponentClass, opts = {}) => {
        return new this.Tester(TestedComponent, {...opts, profile: this.profiles[profileKey]});
      };
    });
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
  registerHook (hook: IHook) {
    if (!hook.name) { throw new Error('Tester.registerHook() : A hooks must have a name.'); }
    if (this.hooks[hook.name]) { throw new Error(`Tester.registerHook() : A hook named "${hook.name}" already exist.`); }

    // Validate hook properties here.

    this.hooks[hook.name] = hook;
  }

  /*
    Profiles,
    {
      // Profile keys must be hook names.
    }
  */
  registerProfile (profile: IProfile) {
    if (!profile.name) { throw new Error('Tester.registerHook() : A hooks must have a name.'); }

    const capitalizedName = capitalize(profile.name);

    if (this.profiles[capitalizedName] && capitalizedName !== 'Default') {
      throw new Error(`Tester.registerProfile() : A profile named "${capitalizedName}" already exist.`);
    }

    // Validate profile properties here.
    //  - Does every key or the profile is a hook ?

    this.profiles[capitalizedName] = profile;
  }

  getValidHooks (tester: Tester, hookProp: string): IHook[] {
    const hooks: IHook[] = [];

    Object.values(this.hooks).forEach((hook) => {
      let valid = true;
      if (!tester.profile[hook.name]) { valid = false; }
      if (hookProp && !hook[hookProp]) { valid = false; }

      if (valid) {
        hooks.push(hook);
      }
    });

    return hooks;
  }

}

export default ConfigurationClass;
