/* global it, describe, expect */
import React, { Component } from 'react';
import { Tester } from '../src';
import { sleep } from '../src/utils';

const COMPONENT_ID = 'testing-component';

const MyTestingComponent = (props: any) => <div id={COMPONENT_ID} {...props} />;

class AsyncComponent extends Component {
  public constructor (props: object) {
    super(props);
    this.state = { status: 'loading' };
  }

  public async componentDidMount () {
    await sleep(10);
    this.setState({
      status: 'done',
    });
  }

  public render () {
    return (
      <div>
        {this.state.status}
      </div>
    );
  }
}

describe('Tester', () => {
  it('Init tests', async () => {
    const tester = await new Tester(MyTestingComponent).mount();
    expect(tester.wrapper).toBeTruthy();
    expect(tester.html()).toContain(COMPONENT_ID);
  });

  it('Init tests TestHook', async () => {
    const tester = await new Tester(MyTestingComponent).mount();
    expect(tester.wrapper).toBeTruthy();
    expect(tester.wrapper.html()).toContain('test-hook-component');
  });

  it('Awaits async componentDidMount', async () => {
    const tester = await new Tester(AsyncComponent).mount();
    expect(tester.text()).toContain('done');
  });

});
