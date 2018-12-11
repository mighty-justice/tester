import 'babel-polyfill';
//import { configure } from 'enzyme';
//import Adapter from 'enzyme-adapter-react-16';
import Tester from '../src/tester';

//configure({ adapter: new Adapter() });

global.Tester = Tester;
