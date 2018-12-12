import React from 'react';
import PropTypes from 'prop-types';
import 'babel-polyfill';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TesterConfig } from '../src';

enzyme.configure({ adapter: new Adapter() });

//Tester.setEnzyme(enzyme);
//global.Tester = Tester;

const TestHookComponent = ({ propOne, propTwo, ...rest}) => {
  console.log('TestHookComponent.render()', rest);
  return (<div id='test-hook-unique' ><div className='test-hook-component' {...rest} /></div>);
};

TestHookComponent.propTypes = {
  propOne: PropTypes.string,
  propTwo: PropTypes.string,
};

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
      name: 'TestProfile',
      testHook: true,
    },
  ],
});
