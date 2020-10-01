import React, { Component } from 'react';
import { Tester } from '../src';
import { isFunction, sleep } from '../src/utils';
import { IProps } from '../src/interfaces';

const COMPONENT_ID = 'testing-component';

const MyTestingComponent = (props: any) => <div id={COMPONENT_ID} {...props} />;

interface IAsyncComponentProps {
  label?: string;
}
class AsyncComponent extends Component<IAsyncComponentProps, { status: string }> {
  public constructor(props: IAsyncComponentProps) {
    super(props);
    this.state = { status: 'loading' };
  }

  public async componentDidMount() {
    await sleep(10);
    this.setState({
      status: 'done',
    });
  }

  public render() {
    return (
      <div>
        {this.props.label}
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

  const label = '7a30534a-62dc-42c6-a9e9-62be0e0a713c'; // Random uuid
  const propTypes: Array<[string, IProps]> = [
    ['object', { label }],
    ['function', jest.fn().mockImplementation(() => ({ label }))],
    ['promise', jest.fn().mockResolvedValue({ label })],
  ];
  propTypes.forEach(([type, props]) => {
    it(`Handles ${type} props`, async () => {
      const tester = await new Tester(AsyncComponent, { props });

      if (isFunction(props)) {
        expect(props).not.toBeCalled();
      }

      await tester.mount();

      if (isFunction(props)) {
        expect(props).toBeCalled();
      }
      expect(tester.text()).toContain(label);
    });
  });

  it('Properly calls hooks from setupTests.ts', async () => {
    const tester = await new Tester(AsyncComponent);

    expect(!!(tester as any).testHookOnInit).toBe(true);
    expect(!!(tester as any).testHookOnBeforeMount).toBe(false);

    await tester.mount();

    expect(!!(tester as any).testHookOnInit).toBe(true);
    expect(!!(tester as any).testHookOnBeforeMount).toBe(true);

    expect(tester.find('#test-hook-unique').length).toBe(1);
    expect(tester.find('.un.deux').length).toBe(1);
  });
});
