/* global it, describe, expect, Tester */
import React from 'react';


const MyTestingComponent = (props) => <div {...props} />;

describe('Tester', () => {
  it('Init tests', () => {
    expect(1).toEqual(1);
  });

  it('Init tests', async () => {
    const tester = await new Tester(MyTestingComponent).mount();
    expect(tester.wrapper).toBeTruthy();
  });
});
