import React from 'react';
import '@babel/polyfill';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { TesterConfig } from '../src';

enzyme.configure({ adapter: new Adapter() });

const TestHookComponent = ({ propOne, propTwo, ...rest}: any) => (
  <div id='test-hook-unique' ><div className='test-hook-component' {...rest} /></div>
);

TesterConfig.configure(enzyme, {
  hooks: [
    {
      component: TestHookComponent,
      name: 'testHook',
      onBeforeMount: (tester) => { (tester as any).testHookOnBeforeMount = true; },
      onInit: (tester) => { (tester as any).testHookOnInit = true; },
      props: {
        propOne: 'un',
        propTwo: 'deux',
      },
    },
  ],
});
