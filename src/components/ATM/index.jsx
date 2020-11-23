/**
 * Main component for ATM app
 */
import React from 'react';
import Display from '../Display';
import Keypad from '../Keypad';
import {validatePIN} from '../../services/PINProcessor';
import CashBox from '../../utils/CashBox';
import './index.css';

const PIN_DIGITS = 4;
const MAX_PIN_ATTEMPTS = 3;
const MAX_CASH_DIGITS = 4;

export default class ATM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyLog: '',
      balance: 0,
      pinAttempts: 0,
      isAuthenticated: false,
      isCardLocked: false,
      dispensedNotes: [],
      done: false,
      error: '',
    };

    // No state depends directly on CashBox
    this.cashBox = new CashBox(7, 15, 4);
  }

  /**
   * handleNumberClick
   * Number keys must handle both PIN and withdrawl amount entry.
   * This is toggled by the isAuthenticated state.
   * Number keys are disabled when an error occurs and when
   * cash is dispensed.
   * 
   * @param {*} i Value of number key pressed
   */
  handleNumberClick(i) {
    //console.log(`handleNumberClick(${i})`);

    const isAuthenticated = this.state.isAuthenticated;
    const pinAttempts = this.state.pinAttempts;
    const keyLog = this.state.keyLog;
    const error = this.state.error;
    const dispensedNotes = this.state.dispensedNotes.slice();

    let newKeyLog;

    if (!isAuthenticated) {
      // entering PIN
      if (pinAttempts < MAX_PIN_ATTEMPTS && keyLog.length < PIN_DIGITS) {
        newKeyLog = keyLog + i;

        this.setState ({
          keyLog: newKeyLog,
        });  

        if (newKeyLog.length === 4) {
          validatePIN(newKeyLog)
            .then(balance => this.handlePINSuccess(balance))
            .catch(error => this.handlePINError(error));
        } 
      }
    } else if (!error.length 
      && !dispensedNotes.length
      && keyLog.length < MAX_CASH_DIGITS) {
      // entering amount
      newKeyLog = keyLog + i;

      this.setState ({
        keyLog: newKeyLog,
      });  
    }
  }

  /**
   * handleClear
   * - backspaces the keyLog by one in PIN/Withdraw States
   */ 
  handleClear() {
    //console.log('handleClear'); 
    const keyLog = this.state.keyLog;
    const error = this.state.error;
    const dispensedNotes = this.state.dispensedNotes.slice();

    if (!error.length && !dispensedNotes.length) {
      let newKeyLog = keyLog.substr(0, keyLog.length-1);

      this.setState ({
        keyLog: newKeyLog,
      });
    }
  }

  /**
   * handleCancel
   * - finishes interaction on any state
   */
  handleCancel() {
    //console.log('handleCancel');
    
    this.setState ({
      keyLog: '',
      error: '',
      dispensedNotes: [],
      done: true,
    });
  }

  /**
   * handleEnter 
   * - has no function during PIN entry
   * - finishes amount entry
   * - clears withdrawl error for retry
   * - requests further transaction after withdrawl
   */
  handleEnter() {
    //console.log('handleEnter');
    const isAuthenticated = this.state.isAuthenticated;
    const dispensedNotes = this.state.dispensedNotes.slice();
    const amount = parseInt(this.state.keyLog);
    const balance = this.state.balance;
    const error = this.state.error;

    if (isAuthenticated) {
      if (error.length || dispensedNotes.length) {
        this.resetToWithdrawState();
      } else if (amount) {
        // only act if an amount has been entered
        try {
          // dispenseCash either succeeds or throws an error 
          const newlyDispensedNotes = this.cashBox.dispenseCash(amount, balance);
          this.handleWithdrawlSuccess(newlyDispensedNotes);
        }
        catch(e) {
          this.handleWithdrawlError(e);
        }
      } 
    }
  }

  /**
   * handlePINSuccess
   * moves app into Withdraw state 
   * 
   * @param {*} balance Current Balance returned by PIN service
   */
  handlePINSuccess(balance) {
    //console.log(`handlePINSuccess(${balance})`);

    // User now authenticated & has a balance
    // reset the keyLog for amount entry
    this.setState({
      balance: balance,
      keyLog: '',
      error: '',
      isAuthenticated: true,
      pinAttempts: 0,
    });
  }

  /**
   * handlePINError
   * Of all the errors the PIN service may return, 
   * its only the 403 that we count against the user
   * 
   * @param {*} error Error returned from PIN service
   */ 
  handlePINError(error) {
    //console.log(`handlePINError(${error})`);

    const pinAttempts = this.state.pinAttempts;

    if (error.message === '403') {
      let isCardLocked = (pinAttempts+1 === MAX_PIN_ATTEMPTS) ? true : false;

      this.setState({
        keyLog: '',
        pinAttempts: pinAttempts+1,
        isCardLocked: isCardLocked,
      });
    } else {
      this.setState({
        keyLog: '',
      });
    }
  }

  /**
   * handleWithdrawlSuccess
   * User has successfully withdrawn cash, so update balance
   * 
   * @param {*} dispensedNotes Array of dispensed note values
   */
  handleWithdrawlSuccess(dispensedNotes) {
    //console.log(`handleWithdrawlSuccess(${dispensedNotes})`);

    const amount = parseInt(this.state.keyLog);
    const balance = this.state.balance;

    this.setState({
      balance: balance - amount,
      dispensedNotes: dispensedNotes,
    });    
  }

  /**
    * handleWithdrawlError
    * Error thrown during withdrawl attempt
    * 
    * @param {*} error Error from the CashBox
    */
  handleWithdrawlError(error) {
    //console.log(`handleWithdrawlError(${error})`);

    this.setState ({
      keyLog: '',
      error: error.message,
    });
  }

  /**
   * resetToWithdrawState
   * Allow return to withdraw state after
   * an error or a previous transaction
   */
  resetToWithdrawState() {
    //console.log('resetToWithdrawState');

    this.setState({
      keyLog: '',
      error: '',
      dispensedNotes: [],
    });    
  }

  render() {
    return (
      <div className="atm">
        <Display
          keyLog={this.state.keyLog}
          pinAttempts={this.state.pinAttempts}
          balance={this.state.balance}
          isAuthenticated={this.state.isAuthenticated}
          isCardLocked={this.state.isCardLocked}
          dispensedNotes={this.state.dispensedNotes}
          done={this.state.done}
          error={this.state.error}
        />
        <Keypad 
          onNumberClick={(i) => this.handleNumberClick(i)}
          onClearClick={() => this.handleClear()}
          onCancelClick={() => this.handleCancel()}
          onEnterClick={() => this.handleEnter()}
        />
      </div>
    );
  }
}
