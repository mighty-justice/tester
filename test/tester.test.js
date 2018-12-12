/* global it, describe, expect, Tester */
import React from 'react';

const COMPONENT_ID = 'testing-component';

const MyTestingComponent = (props) => <div id={COMPONENT_ID} {...props} />;


describe('Tester', () => {

  it('Init tests', async () => {
    const tester = await new Tester(MyTestingComponent).mount();
    expect(tester.wrapper).toBeTruthy();
    expect(tester.html()).toContain(COMPONENT_ID);
  });

  it('Init tests TestHook', async () => {
    const tester = await new Tester.TestProfile(MyTestingComponent).mount();
    expect(tester.wrapper).toBeTruthy();
    expect(tester.wrapper.html()).toContain('test-hook-component');
  });
});
