import React, { Fragment } from 'react';

import {
  getInstance,
  getValue,
  sleep,
} from './utils';

import ConfigurationClass from './ConfigurationClass';
import { IHook, IProfile, ITesterOpts, IWrapper, ComponentClass } from './interfaces';

const NullComponent: React.FC<any>  = (props: any) => (<Fragment {...props} />);


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
  static Configuration: ConfigurationClass;

  public opts: ITesterOpts;

  public config: ConfigurationClass;
  public initialMount: React.ReactNode;
  public onBeforeMount?: (tester: Tester) => Promise<void>;
  public profile: IProfile;
  public props: object;
  public TestedComponent: ComponentClass;

  public AppState: any;
  public shallow: any;
  public wrapper: any;

  constructor (TestedComponent: ComponentClass, opts: ITesterOpts = {}) {
    this.config = Tester.Configuration;
    this.initialMount = opts.mount;
    this.onBeforeMount = opts.onBeforeMount;
    this.opts = opts;
    this.profile = {...this.config.profiles.Default, ...opts.profile};
    this.props = opts.props || {};
    this.TestedComponent = TestedComponent;

    // Allow testing without a main TestedComponent. This require an initialMount.
    if (!this.TestedComponent && this.initialMount) {
      this.TestedComponent = NullComponent;
      this.initialMount = <this.TestedComponent>{this.initialMount}</this.TestedComponent>;
    }

    // Loop through hooks onInit(),
    this.config.getValidHooks(this, 'onInit').forEach((hook: IHook) => {
      hook.onInit(this);
    });
  }

  getWrappers () {
    const wrappers: IWrapper[] = [];

    this.config.getValidHooks(this, 'component').forEach((hook: IHook) => {
      wrappers.push({
        component: hook.component,
        name: hook.name,
        props: getValue(this, hook.props),
      });
    });

    return wrappers;
  }

  get instance () {
    return getInstance(this.component);
  }

  get component () {
    return this.wrapper.find(this.TestedComponent);
  }

  debug () {
    // eslint-disable-next-line no-console
    console.log(this.wrapper.debug());
  }

  html () {
    return this.component.html();
  }

  text () {
    return this.component.text();
  }

  find (selector: string) {
    return this.wrapper.find(selector);
  }

  update () {
    return this.wrapper.update();
  }

  async sleep (ms?: number) {
    await sleep(ms);
  }

  async refresh (ms?: number) {
    await sleep(ms);
    this.update();
  }

  createShallowWrapper () {
    this.shallow = {};
    const WrappedComponent = (this.TestedComponent as any).wrappedComponent as ComponentClass;

    this.shallow.wrapper = this.config.enzyme.mount(
      <WrappedComponent {...this.props} { ...this.AppState} />
    );
    this.shallow.instance = getInstance(this.shallow.wrapper);
  }

  async mount (mountOpts: { async?: boolean } = {}) {

    // Loop through hooks onBeforeMount(),
    // This MUST be a regular for () loop to not throw the promise away. (forEach won't work)
    for (const hook of this.config.getValidHooks(this, 'onBeforeMount')) {
      await hook.onBeforeMount(this, mountOpts);
    }

    // Allows you to fetch data to set as props, prepare extra stores, etc.
    if (this.onBeforeMount) {
      await this.onBeforeMount(this);
    }

    const initialMount = this.initialMount || <this.TestedComponent {...this.props} />;

    const WrapperTree = this.getWrappers().reduce((Tree, wrapper) => {
      const wrapperChildren = wrapper.renderChildren !== false && Tree;
      if (wrapper.props) {
        return <wrapper.component {...wrapper.props}>{wrapperChildren}</wrapper.component>;
      }
      return Tree;
    }, initialMount);

    this.wrapper = await this.config.enzyme.mount(WrapperTree);

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

export default Tester;
