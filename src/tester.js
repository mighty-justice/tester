import React, { Fragment } from 'react';

import { mount } from 'enzyme';
import { Provider } from 'mobx-react';

const NullComponent = (props) => <Fragment {...props} />;

function getInstance (component) {
  const instance = component.instance();
  return instance.wrappedInstance || instance;
}

function sleep (ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
  Name: Tester
  Description: Testing utility class to mount a specific component with it's required wrappers.

  Usage:
    // Bootstrap Transport, localStorage + Session and an AppState.
    const tester = new Tester(MyComponent);

    // Bootstrap nothing, use with light components that doesn't need any of the above.
    const tester = new TesterLight(MyComponent);

    // Mount the component
    await tester.mount();

    // Test component that requires more JSX than the component only :
    const new Tester(MyComponent, {mount: (<Form><MyComponent></Form>)});

    // You can mount right away if no Transport or AppState modification is needed.
    const tester = await new Tester(MyComponent).mount();

    // opts.shallow is an experimental feature that allows you to test the TestedComponent instance behaviors.
    // Please only use it when necessary.
    const tester = await new Tester(MyComponent, { shallow: true }).mount();
      tester.shallow.wrapper // equals to shallow(<TestedComponent {...this.props} {...this.AppState} />)
      tester.shallow.instance // equals to tester.shallow.instance()
*/

/**
 * Testing utility class to mount a specific component with it's required wrappers.
 *
 * @param {ReactComponent} TestedComponent
 * @param {Object} options
 * @returns {Tester}
 */
class Tester {
  initialMount;
  onBeforeMount;
  opts;
  profile;
  props;
  shallow;
  TestedComponent;
  wrapper;

  constructor (TestedComponent, opts = {}) {
    this.opts = opts;
    this.initialMount = opts.mount;
    this.onBeforeMount = opts.onBeforeMount;
    this.profile = {...this.constructor.profiles.Default, ...opts.profile};
    this.props = opts.props || {};
    this.TestedComponent = TestedComponent;

    // Allow testing without a main TestedComponent. This require an initialMount.
    if (!this.TestedComponent && this.initialMount) {
      this.TestedComponent = NullComponent;
      this.initialMount = <this.TestedComponent>{this.initialMount}</this.TestedComponent>;
    }

    // Loop through hooks onInit(),
    //for (const hookName of Object.keys(this.profile)) {
    for (const hookName of Object.keys(this.constructor.hooks)) {
      if (this.profile[hookName] && this.constructor.hooks[hookName] && typeof this.constructor.hooks[hookName].onInit === 'function') {
        this.constructor.hooks[hookName].onInit(this, opts);
      }
    }
  }

  get instance () {
    return getInstance(this.component);
  }

  get component () {
    return this.wrapper.find(this.TestedComponent);
  }

  debug () {
    console.log(this.wrapper.debug());
  }

  html () {
    return this.component.html();
  }

  text () {
    return this.component.text();
  }

  find (selector) {
    return this.wrapper.find(selector);
  }

  update () {
    return this.wrapper.update();
  }

  async sleep (ms) {
    await sleep(ms);
  }

  async refresh (ms) {
    await sleep(ms);
    this.update();
  }

  createShallowWrapper () {
    this.shallow = {};
    this.shallow.wrapper = mount(<this.TestedComponent.wrappedComponent {...this.props} { ...this.AppState } />);
    this.shallow.instance = getInstance(this.shallow.wrapper);
  }

  async mount (mountOpts = {}) {

    // Loop through hooks onBeforeMount(),
    for (const hookName of Object.keys(this.profile)) {
      if (this.profile[hookName] && this.constructor.hooks[hookName] && typeof this.constructor.hooks[hookName].onBeforeMount === 'function') {
        await this.constructor.hooks[hookName].onBeforeMount(this, mountOpts);
      }
    }

    // Allows you to fetch data to set as props, prepare extra stores, etc.
    if (this.onBeforeMount) {
      await this.onBeforeMount(this);
    }

    const wrappers = [
        {
          Component: Provider,
          name: 'Provider',
          props: this.AppState,
        },
      ]
      , initialMount = this.initialMount || <this.TestedComponent {...this.props} />;

    const WrapperTree = wrappers.reduce((Tree, wrapper) => {
      const wrapperChildren = wrapper.renderChildren !== false && Tree;
      if (wrapper.props) {
        return <wrapper.Component {...wrapper.props}>{wrapperChildren}</wrapper.Component>;
      }
      return Tree;
    }, initialMount);

    this.wrapper = await mount(WrapperTree);

    if (this.opts.shallow) {
      this.createShallowWrapper();
    }

    if (mountOpts.async) {
      await this.sleep();
      this.update();
    }

    return this;
  }
}

/*
  Profiles,
  {
    // Profile keys must be hook names.
  }
*/
Tester.profiles = {
  // Default profile, each of it's properties can be overwritten.
  Default: {},
};
Tester.registerProfile = (name, profile) => {
  const capitalizedName = capitalize(name);
  if (Tester.profiles[capitalizedName] && capitalizedName !== 'Default') {
    throw new Error(`Tester.registerProfile() : A profile named "${capitalizedName}" already exist.`);
  }

  Tester.profiles[capitalizedName] = profile;
};

/*
  Hooks,
  {
    name: string,
    component: React.Component,
    props: object || fn(), // fn() allows this.AppState to be set for e.g
    onInit: fn(),
    onBeforeMount: fn(),
    shortCuts: {shortCutName: fn()},
  }

  Note: Order is important!
*/
Tester.hooks = {};
Tester.registerHook = (hook) => {
  if (!hook.name) { throw new Error('Tester.registerHook() : A hooks must have a name.'); }
  if (Tester.hooks[hook.name]) { throw new Error(`Tester.registerHook() : A hook named "${hook.name}" already exist.`); }

  Tester.hooks[hook.name] = hook;
};

/*
  Create shortcuts for each global profiles
  Tester shortcuts allows you to use a specific global profile without having to pass it in in the options.

  E.g.
  Using a new Tester.Light(MyComponent) allows you to skip the initialization of Transport, localStorage + Session and AppState.
*/
Object.keys(Tester.profiles).forEach((profileKey) => {
  Tester[profileKey] = function (TestedComponent, opts = {}) {
    return new Tester(TestedComponent, {...opts, profile: Tester.profiles[profileKey]});
  };
});

export default Tester;
