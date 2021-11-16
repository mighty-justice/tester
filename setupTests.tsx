import React from 'react';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { TesterConfig } from './src';

enzyme.configure({ adapter: new Adapter() });

const TestHookComponent = ({ propOne, propTwo, ...rest }: any) => (
  <div id="test-hook-unique" className={`${propOne} ${propTwo}`}>
    <div className="test-hook-component" {...rest} />
  </div>
);

TesterConfig.configure(enzyme, {
  testHook: {
    component: TestHookComponent,
    onBeforeMount: tester => {
      (tester as any).testHookOnBeforeMount = true;
    },
    onInit: tester => {
      (tester as any).testHookOnInit = true;
    },
    props: (_tester: any) => ({
      propOne: 'un',
      propTwo: 'deux',
    }),
  },
});
