import React, { Fragment, ComponentType } from 'react';

import { flushPromises, getInstance, getValue, isString, sleep } from './utils';
import ConfigurationClass from './ConfigurationClass';
import { IHook, ITesterOpts, IWrapper, IOnInit, IOnBeforeMount, IProps } from './interfaces';

type ISelectArg = string | { simulate: (event: string) => void };

const NullComponent: React.FC<any> = (props: any) => <Fragment {...props} />;

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
*/

/**
 * Testing utility class to mount a specific component with it's required wrappers.
 */
class Tester {
  public static Configuration: ConfigurationClass;

  public opts: ITesterOpts;

  public config: ConfigurationClass;
  public initialMount: React.ReactNode;
  public onBeforeMount?: (tester: Tester) => Promise<void>;
  public props: IProps;
  public TestedComponent: ComponentType<any>;

  public wrapper: any;

  public constructor(TestedComponent: ComponentType<any>, opts: ITesterOpts = {}) {
    this.config = Tester.Configuration;
    this.initialMount = opts.mount;
    this.onBeforeMount = opts.onBeforeMount;
    this.opts = opts;
    this.props = opts.props || {};
    this.TestedComponent = TestedComponent;

    // Allow testing without a main TestedComponent. This require an initialMount.
    if (!this.TestedComponent && this.initialMount) {
      this.TestedComponent = NullComponent;
      this.initialMount = <this.TestedComponent>{this.initialMount}</this.TestedComponent>;
    }

    // Loop through hooks onInit(),
    const validHooks = this.config.getValidHooks('onInit') as Array<IHook & { onInit: IOnInit }>;
    validHooks.forEach(hook => hook.onInit(this));
  }

  public getWrappers(): IWrapper[] {
    const wrappers: IWrapper[] = [];

    this.config.getValidHooks('component').forEach((hook: IHook) => {
      wrappers.push({
        component: hook.component,
        name: hook.name,
        props: getValue(this, hook.props),
      });
    });

    return wrappers;
  }

  public get instance() {
    return getInstance(this.component);
  }

  public get component() {
    return this.wrapper.find(this.TestedComponent);
  }

  public debug() {
    // tslint:disable-next-line:no-console
    console.log(this.wrapper.debug());
  }

  public html() {
    return this.component.html();
  }

  public text() {
    return this.component.text();
  }

  public find(selector: string | ComponentType<any>) {
    return this.wrapper.find(selector);
  }

  public update() {
    return this.wrapper.update();
  }

  public async sleep(ms?: number) {
    await sleep(ms);
  }

  public async refresh(ms?: number) {
    await sleep(ms);
    this.update();
  }

  private getComponent(selector: ISelectArg) {
    return isString(selector) ? this.find(selector).first() : selector;
  }

  public changeInput(selector: ISelectArg, value: string) {
    const component = this.getComponent(selector);
    component.simulate('focus');
    component.simulate('change', { target: { value } });
    component.simulate('blur');
  }

  public checkBox(selector: ISelectArg, checked = true) {
    const component = this.getComponent(selector);
    component.simulate('change', { target: { checked } });
  }

  public click(selector: ISelectArg) {
    const component = this.getComponent(selector);
    component.simulate('click');
  }

  public async submit(selector: ISelectArg = 'form') {
    const component = this.getComponent(selector);
    component.simulate('submit');
    await this.refresh();
  }

  public async mount(mountOpts: { async?: boolean } = {}) {
    // Loop through hooks onBeforeMount(),
    // This MUST be a regular for () loop to not throw the promise away. (forEach won't work)
    type IValidHook = IHook & { onBeforeMount: IOnBeforeMount };
    const validHooks = this.config.getValidHooks('onBeforeMount') as IValidHook[];
    for (const hook of validHooks) {
      await hook.onBeforeMount(this, mountOpts);
    }

    // Allows you to fetch data to set as props, prepare extra stores, etc.
    if (this.onBeforeMount) {
      await this.onBeforeMount(this);
    }

    const props = await getValue(this, this.props);
    const initialMount = this.initialMount || <this.TestedComponent {...props} />;

    const WrapperTree = this.getWrappers().reduce<any>((Tree, wrapper) => {
      const wrapperChildren = wrapper.renderChildren !== false && Tree;
      if (wrapper.props) {
        return <wrapper.component {...wrapper.props}>{wrapperChildren}</wrapper.component>;
      }
      return Tree;
    }, initialMount);

    this.wrapper = await this.config.enzyme.mount(WrapperTree);

    if (mountOpts.async !== false) {
      if (this.instance) {
        await this.instance.componentDidMount();
      }

      // See https://github.com/enzymejs/enzyme/issues/1587
      await flushPromises();
      await this.refresh();
    }

    return this;
  }
}

export default Tester;
