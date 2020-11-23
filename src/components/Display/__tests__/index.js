import Display from '../index';
import Enzyme,{shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

let displayWrapper;

beforeEach(() => {
  displayWrapper = shallow(<Display
    keyLog=""
    pinAttempts="0"
    balance="0"
    isAuthenticated="false"
    isCardLocked="false"
    dispensedNotes="[]"
    done="false"
    error=""
  />);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('should render render correctly', () => {
  expect(displayWrapper).toMatchSnapshot()
});

it('should render an outer div and 4 children', () => {
  expect(displayWrapper.find('div.display').length).toEqual(1);
  expect(displayWrapper.find('div.display h1.heading').length).toEqual(1);
  expect(displayWrapper.find('div.display div.info').length).toEqual(1);
  expect(displayWrapper.find('div.display div.prompt').length).toEqual(1);
  expect(displayWrapper.find('div.display div.action').length).toEqual(1);
});

/**
 * I'm sure more tests could be added here to check that the correct
 * information is displayed in each state of the app. However, I'd like to
 * know how that can be achieved without tying the tests to an individual
 * locale or making them directly dependent on resource strings.
 */
