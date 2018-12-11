import 'babel-polyfill';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tester from '../src/tester';

enzyme.configure({ adapter: new Adapter() });

Tester.setEnzyme(enzyme);
global.Tester = Tester;
