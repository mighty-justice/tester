import React from 'react';
import PropTypes from 'prop-types';
import 'babel-polyfill';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TesterConfig } from '../src';

enzyme.configure({ adapter: new Adapter() });

//Tester.setEnzyme(enzyme);
//global.Tester = Tester;

const TestHookComponent = ({ propOne, propTwo, ...props}) => <div className='test-hook-component' {...props} />;
TestHookComponent.propTypes = {
  propOne: PropTypes.string,
  propTwo: PropTypes.string,
}

TesterConfig.configure(enzyme, {
  hooks: [
    {
      name: 'testHook',
      component: TestHookComponent,
      props: {
        propOne: 'un',
        propTwo: 'deux',
      },
      onInit: (tester) => { tester.testHookOnInit = true; },
      onBeforeMount: (tester) => { tester.testHookOnBeforeMount = true; },
      //shortCuts: { shortCutName: fn() },
    },
  ],
  profiles: [
    {
      name: 'TestHook',
      testHook: true,
    },
  ],
});
