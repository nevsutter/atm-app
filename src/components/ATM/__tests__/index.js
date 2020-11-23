import ATM from '../index';
import Enzyme,{shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

jest.mock('../../../services/PINProcessor');
jest.mock('../../../utils/CashBox');

Enzyme.configure({ adapter: new Adapter() });

let atmWrapper;

beforeEach(() => {
  atmWrapper = shallow(<ATM />);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('should render render correctly', () => {
  expect(atmWrapper).toMatchSnapshot()
});

it('should render a <div />', () => {
  expect(atmWrapper.find('div.atm').length).toEqual(1);
});

it('should initialise state correctly', () => {
  const initialState = {
    keyLog: '',
    balance: 0,
    pinAttempts: 0,
    isAuthenticated: false,
    isCardLocked: false,
    dispensedNotes: [],
    done: false,
    error: '',
  };

  expect(atmWrapper.state()).toEqual(initialState);
});

it('should handle number click events - Valid PIN entry', async () => {
  //const handlePINSuccessSpy = jest.spyOn(atmWrapper.instance(), 'handlePINSuccess');
  
  atmWrapper.instance().handleNumberClick(1);

  expect(atmWrapper.state().keyLog).toEqual('1');
  expect(atmWrapper.state().pinAttempts).toEqual(0);
  expect(atmWrapper.state().isAuthenticated).toEqual(false);

  atmWrapper.instance().handleNumberClick(1);

  expect(atmWrapper.state().keyLog).toEqual('11');
  expect(atmWrapper.state().pinAttempts).toEqual(0);
  expect(atmWrapper.state().isAuthenticated).toEqual(false);

  atmWrapper.instance().handleNumberClick(1);

  expect(atmWrapper.state().keyLog).toEqual('111');
  expect(atmWrapper.state().pinAttempts).toEqual(0);
  expect(atmWrapper.state().isAuthenticated).toEqual(false);

  atmWrapper.instance().handleNumberClick(1);

  expect(atmWrapper.state().keyLog).toEqual('1111');
  expect(atmWrapper.state().pinAttempts).toEqual(0);
  expect(atmWrapper.state().isAuthenticated).toEqual(false);

  // Given that the async validatePIN method is handled
  // within handleNumberClick, I've not yet found the 
  // correct way to ensure that handlePINSuccess is 
  // called after validatePIN's promise completes.

});

// it('should handle number click events - inalid PIN entry', () => {
// });

it('should handle clear click events for PIN and Amount entry', () => {

  atmWrapper.instance().setState({
    keyLog: '123',
    isAuthenticated: false,
    dispensedNotes: [],
    error: '',
  });

  atmWrapper.instance().handleClear();

  expect(atmWrapper.state().keyLog).toEqual('12');

  atmWrapper.instance().setState({
    keyLog: '123',
    isAuthenticated: true,
  });

  atmWrapper.instance().handleClear();

  expect(atmWrapper.state().keyLog).toEqual('12');

  // Should ignore clear when an error is display
  atmWrapper.instance().setState({
    keyLog: '123',
    isAuthenticated: false,
    dispensedNotes: [],
    error: 'This is an error',
  });

  atmWrapper.instance().handleClear();

  expect(atmWrapper.state().keyLog).toEqual('123');

  // Should ignore clear when notes are dispensed
  atmWrapper.instance().setState({
    keyLog: '123',
    isAuthenticated: false,
    dispensedNotes: [20,10,5],
    error: '',
  });

  atmWrapper.instance().handleClear();

  expect(atmWrapper.state().keyLog).toEqual('123');
});

it('should handle cancel click events', () => {
  atmWrapper.instance().setState ({
    keyLog: '123',
    error: 'This is an error',
    done: false,
  });

  atmWrapper.instance().handleCancel();

  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().error).toEqual('');
  expect(atmWrapper.state().done).toEqual(true);
});

it('should ignore Enter click events when not authenticated', () => {
  const resetToWithdrawStateSpy = jest.spyOn(atmWrapper.instance(), 'resetToWithdrawState');
  const handleWithdrawlSuccessSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlSuccess');
  const handleWithdrawlErrorSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlError');

  atmWrapper.instance().setState ({
    isAuthenticated: false,
    keyLog: '123',
    error: 'This is an error',
    dispensedNotes: [],
    done: false,
  });

  atmWrapper.instance().handleEnter();

  // enter should have no effect when isAuthenticated is false
  expect(resetToWithdrawStateSpy).toBeCalledTimes(0);
  expect(handleWithdrawlSuccessSpy).toBeCalledTimes(0);
  expect(handleWithdrawlErrorSpy).toBeCalledTimes(0);
});

it('should handle Enter click events when authenticated - Error Case', () => {
  const resetToWithdrawStateSpy = jest.spyOn(atmWrapper.instance(), 'resetToWithdrawState');
  const handleWithdrawlSuccessSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlSuccess');
  const handleWithdrawlErrorSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlError');

  atmWrapper.instance().setState ({
    isAuthenticated: true,
    keyLog: '123',
    error: 'This is an error',
    dispensedNotes: [],
    done: false,
  });

  atmWrapper.instance().handleEnter();

  expect(resetToWithdrawStateSpy).toBeCalledTimes(1);
  expect(handleWithdrawlSuccessSpy).toBeCalledTimes(0);
  expect(handleWithdrawlErrorSpy).toBeCalledTimes(0);
});

it('should handle Enter click events when authenticated - Dispensed Case', () => {
  const resetToWithdrawStateSpy = jest.spyOn(atmWrapper.instance(), 'resetToWithdrawState');
  const handleWithdrawlSuccessSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlSuccess');
  const handleWithdrawlErrorSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlError');

  atmWrapper.instance().setState ({
    isAuthenticated: true,
    keyLog: '123',
    error: '',
    dispensedNotes: [20,10,5],
    done: false,
  });

  atmWrapper.instance().handleEnter();

  expect(resetToWithdrawStateSpy).toBeCalledTimes(1);
  expect(handleWithdrawlSuccessSpy).toBeCalledTimes(0);
  expect(handleWithdrawlErrorSpy).toBeCalledTimes(0);
});

it('should handle Enter click events when authenticated - Valid Amount Case', () => {
  const resetToWithdrawStateSpy = jest.spyOn(atmWrapper.instance(), 'resetToWithdrawState');
  const handleWithdrawlSuccessSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlSuccess');
  const handleWithdrawlErrorSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlError');

  // no error or dispensed notes
  // 70 is the magic number for the mock dispenseCash method
  atmWrapper.instance().setState ({
    isAuthenticated: true,
    keyLog: '70',
    error: '',
    dispensedNotes: [],
    done: false,
  });

  atmWrapper.instance().handleEnter();

  expect(resetToWithdrawStateSpy).toBeCalledTimes(0);
  expect(handleWithdrawlSuccessSpy).toBeCalledTimes(1);
  expect(handleWithdrawlErrorSpy).toBeCalledTimes(0);
});

it('should handle Enter click events when authenticated - Invalid Amount Case', () => {
  const resetToWithdrawStateSpy = jest.spyOn(atmWrapper.instance(), 'resetToWithdrawState');
  const handleWithdrawlSuccessSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlSuccess');
  const handleWithdrawlErrorSpy = jest.spyOn(atmWrapper.instance(), 'handleWithdrawlError');

  // non-70
  atmWrapper.instance().setState ({
    isAuthenticated: true,
    keyLog: '90',
    error: '',
    dispensedNotes: [],
    done: false,
  });

  atmWrapper.instance().handleEnter();

  expect(resetToWithdrawStateSpy).toBeCalledTimes(0);
  expect(handleWithdrawlSuccessSpy).toBeCalledTimes(0);
  expect(handleWithdrawlErrorSpy).toBeCalledTimes(1);
});

it('should handle PIN Success', () => {
  atmWrapper.instance().setState ({
    isAuthenticated: false,
    keyLog: '1111',
    balance: 0,
  });

  atmWrapper.instance().handlePINSuccess(120);

  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().isAuthenticated).toEqual(true);
  expect(atmWrapper.state().balance).toEqual(120);
});

it('should handle PIN Error', () => {
  atmWrapper.instance().setState ({
    isAuthenticated: false,
    isCardLocked: false,
    keyLog: '1111',
    balance: 0,
    pinAttempts: 0,
  });

  atmWrapper.instance().handlePINError(new Error('403'));

  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().isAuthenticated).toEqual(false);
  expect(atmWrapper.state().isCardLocked).toEqual(false);
  expect(atmWrapper.state().balance).toEqual(0);
  expect(atmWrapper.state().pinAttempts).toEqual(1);

  // Check MAX_PIN_ATTEMPTS
  atmWrapper.instance().setState ({
    isAuthenticated: false,
    isCardLocked: false,
    keyLog: '1111',
    balance: 0,
    pinAttempts: 2,
  });

  atmWrapper.instance().handlePINError(new Error('403'));

  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().isAuthenticated).toEqual(false);
  expect(atmWrapper.state().isCardLocked).toEqual(true);
  expect(atmWrapper.state().balance).toEqual(0);
  expect(atmWrapper.state().pinAttempts).toEqual(3);

  // Only a 403 should increase pinAttempts
  atmWrapper.instance().setState ({
    isAuthenticated: false,
    isCardLocked: false,
    keyLog: '1111',
    balance: 0,
    pinAttempts: 2,
  });

  atmWrapper.instance().handlePINError(new Error('500'));

  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().isAuthenticated).toEqual(false);
  expect(atmWrapper.state().isCardLocked).toEqual(false);
  expect(atmWrapper.state().balance).toEqual(0);
  expect(atmWrapper.state().pinAttempts).toEqual(2);
});

it('should handle Withdrawl Success', () => {
  atmWrapper.instance().setState ({
    keyLog: '70',
    balance: 80,
    dispensedNotes: []
  });

  atmWrapper.instance().handleWithdrawlSuccess([20,20,10,10,5,5]);

  expect(atmWrapper.state().dispensedNotes).toEqual([20,20,10,10,5,5]);
  expect(atmWrapper.state().balance).toEqual(10);
});

it('should handle Withdrawl Error', () => {
  atmWrapper.instance().setState ({
    keyLog: '70',
    balance: 80,
    dispensedNotes: [],
    error: '',
  });

  atmWrapper.instance().handleWithdrawlError(new Error('my error'));

  expect(atmWrapper.state().dispensedNotes).toEqual([]);
  expect(atmWrapper.state().balance).toEqual(80);
  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().error).toEqual('my error');
});

it('should handle reset to Withdrawl state', () => {
  // From Dispensing...
  atmWrapper.instance().setState ({
    keyLog: '70',
    balance: 80,
    dispensedNotes: [20,10,5],
    error: '',
  });

  atmWrapper.instance().resetToWithdrawState();

  expect(atmWrapper.state().dispensedNotes).toEqual([]);
  expect(atmWrapper.state().balance).toEqual(80);
  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().error).toEqual('');

  //From error...
  atmWrapper.instance().setState ({
    keyLog: '70',
    balance: 80,
    dispensedNotes: [],
    error: 'An error',
  });

  atmWrapper.instance().resetToWithdrawState();

  expect(atmWrapper.state().dispensedNotes).toEqual([]);
  expect(atmWrapper.state().balance).toEqual(80);
  expect(atmWrapper.state().keyLog).toEqual('');
  expect(atmWrapper.state().error).toEqual('');
});