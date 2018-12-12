/* global it, describe, expect, Tester */
import React from 'react';


const MyTestingComponent = (props) => <div {...props} />;

describe('Tester', () => {
  it('Init tests', () => {
    expect(1).toEqual(1);
  });

  it('Init tests', async () => {
    const tester = await new Tester(MyTestingComponent).mount();
    tester.debug();
    expect(tester.wrapper).toBeTruthy();
  });

  it('Init tests TestHook', async () => {
    const tester = await new Tester.TestHook(MyTestingComponent).mount();
    tester.debug();
    expect(tester.wrapper).toBeTruthy();
  });
});
