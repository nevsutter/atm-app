import Keypad from '../index';
import Enzyme,{mount} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

let keypadWrapper;

beforeEach(() => {
  keypadWrapper = mount(<Keypad
    onNumberClick={(i) => {}}
    onClearClick={() => {}}
    onCancelClick={() => {}}
    onEnterClick={() => {}}
  />);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('should render render correctly', () => {
  expect(keypadWrapper).toMatchSnapshot()
});

it('should render an outer div and 2 children', () => {
  expect(keypadWrapper.find('div.keypad').length).toEqual(1);
  expect(keypadWrapper.find('div.keypad div.numericButtons').length).toEqual(1);
  expect(keypadWrapper.find('div.keypad div.actionButtons').length).toEqual(1);
});

it('should render 10 numerical buttons', () => {
  expect(keypadWrapper.find('div.numericButtons button').length).toEqual(10);

  expect(keypadWrapper.find('div.numericButtons button.numeral1').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral2').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral3').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral4').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral5').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral6').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral7').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral8').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral9').length).toEqual(1);
  expect(keypadWrapper.find('div.numericButtons button.numeral0').length).toEqual(1);
});

it('should render 3 action buttons', () => {
  expect(keypadWrapper.find('div.actionButtons button').length).toEqual(3);

  expect(keypadWrapper.find('div.actionButtons button.actionClear').length).toEqual(1);
  expect(keypadWrapper.find('div.actionButtons button.actionCancel').length).toEqual(1);
  expect(keypadWrapper.find('div.actionButtons button.actionEnter').length).toEqual(1);
});

it('should call correct handler for numerical buttons', () => {
  const myFunc = jest.fn();

  keypadWrapper.setProps({
    onNumberClick: myFunc,
  });

  keypadWrapper.find('button.numeral1').simulate('click');
  keypadWrapper.find('button.numeral2').simulate('click');
  keypadWrapper.find('button.numeral3').simulate('click');
  keypadWrapper.find('button.numeral4').simulate('click');
  keypadWrapper.find('button.numeral5').simulate('click');
  keypadWrapper.find('button.numeral6').simulate('click');
  keypadWrapper.find('button.numeral7').simulate('click');
  keypadWrapper.find('button.numeral8').simulate('click');
  keypadWrapper.find('button.numeral9').simulate('click');
  keypadWrapper.find('button.numeral0').simulate('click');

  expect(myFunc).toBeCalledTimes(10);
  
  expect(myFunc).toBeCalledWith(1);
  expect(myFunc).toBeCalledWith(2);
  expect(myFunc).toBeCalledWith(3);
  expect(myFunc).toBeCalledWith(4);
  expect(myFunc).toBeCalledWith(5);
  expect(myFunc).toBeCalledWith(6);
  expect(myFunc).toBeCalledWith(7);
  expect(myFunc).toBeCalledWith(8);
  expect(myFunc).toBeCalledWith(9);
  expect(myFunc).toBeCalledWith(0);
});

it('should call correct handler for clear button', () => {
  const myFunc = jest.fn();

  keypadWrapper.setProps({
    onClearClick: myFunc,
  });

  keypadWrapper.find('button.actionClear').simulate('click');

  expect(myFunc).toBeCalled();
});

it('should call correct handler for cancel button', () => {
  const myFunc = jest.fn();

  keypadWrapper.setProps({
    onCancelClick: myFunc,
  });

  keypadWrapper.find('button.actionCancel').simulate('click');

  expect(myFunc).toBeCalled();
});

it('should call correct handler for enter button', () => {
  const myFunc = jest.fn();

  keypadWrapper.setProps({
    onEnterClick: myFunc,
  });

  keypadWrapper.find('button.actionEnter').simulate('click');

  expect(myFunc).toBeCalled();
});
