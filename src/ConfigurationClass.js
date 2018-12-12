import { capitalize } from './utils';

/*
  Tester Configuration Class
*/
class ConfigurationClass {
  enzyme;
  hooks = {};
  profiles = {
    // Default profile, each of it's properties can be overwritten.
    Default: {},
  };
  Tester;

  constructor (Tester) {
    this.Tester = Tester;
    Tester.Configuration = this;
  }

  configure (enzyme, config) {
    this.enzyme = enzyme;

    if (config.hooks) {
      config.hooks.forEach((hook) => {
        this.registerHook(hook);
      });
    }

    if (config.profiles) {
      config.profiles.forEach((profile) => {
        this.registerProfile(profile);
      });
    }

    this.createShortcuts();

    // Make it globally accessible
    global.Tester = this.Tester;

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
      this.Tester[profileKey] = (TestedComponent, opts = {}) => {
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
  registerHook (hook) {
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
  registerProfile (profile) {
    if (!profile.name) { throw new Error('Tester.registerHook() : A hooks must have a name.'); }

    const capitalizedName = capitalize(profile.name);

    if (this.profiles[capitalizedName] && capitalizedName !== 'Default') {
      throw new Error(`Tester.registerProfile() : A profile named "${capitalizedName}" already exist.`);
    }

    // Validate profile properties here.
    //  - Does every key or the profile is a hook ?

    this.profiles[capitalizedName] = profile;
  }

  getValidHooks (tester, hookProp) {
    const hooks = [];

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
