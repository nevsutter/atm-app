/**
 * Display Component
 * Handles no user input
 * Simply responds to supplied props
 */
import React from 'react';
import './index.css';

// Ideally all of these resource strings should be retrieved from the resource
// bundle for the user's locale
const currencySymbol = '£';
const welcomeText = 'Welcome';
const enterPINText = 'Please enter your 4 digit PIN:';
const invalidPINText = 'PIN is incorrect';
const tryAgainText = 'Try again';
const sorryText = 'Sorry, too many incorrect PIN attempts';
const cashWithdrawlText = 'Withdraw Cash';
const currentBalanceText = 'Current Balance:';
const enterAmountText = `Please enter amount to withdraw, in multiples of ${currencySymbol}10, then press "Enter"`;
const pressEnterToRetryText = 'Please press "Enter" to retry or "Cancel" to finish';
const pressEnterORCancelText = 'Press "Enter" to withdraw more cash or "Cancel" to finish';
const dispensingCashText = 'Dispensing Cash';
const dispensingText = 'Dispensing';
const overdrawnText = '*** You are now overdrawn ***';
const thanksText = 'Thank You';

/**
 * Helper method to pretty print note totals
 * 
 * @param {*} value Value of notes to count
 * @param {*} allNotes Array of all notes by value
 * @param {*} currencySymbol current currency symbol
 */
const countNotesOfValue = (value, allNotes, currencySymbol) =>  {
  const numNotes = allNotes.filter(note => note === value).length;
  return (numNotes > 0) ? `${numNotes}x${currencySymbol}${value}` : '';
}

export default class Display extends React.Component {
  render() {
    const keyLog = this.props.keyLog;
    const pinAttempts = this.props.pinAttempts;
    const balance = this.props.balance;
    const isAuthenticated = this.props.isAuthenticated;
    const isCardLocked = this.props.isCardLocked;
    const dispensedNotes = this.props.dispensedNotes.slice();
    const done = this.props.done;
    const error = this.props.error;

    let heading = '', 
      prompt = '', 
      action = '',
      info = '';

    if (done) {
      // Transaction complete
      heading = thanksText;
    } else if (!isAuthenticated) {
      if (isCardLocked) {
        // Too many invalid PIN attempts
        heading = invalidPINText;
        prompt = sorryText;
      } else {
        // Enter PIN
        heading = (pinAttempts === 0) ? welcomeText : invalidPINText;
        info  = (pinAttempts === 0) ? '' : tryAgainText;
        prompt = enterPINText;
        action = keyLog.replaceAll(/\d/g, '* '); 
        // Alternative if replaceAll not supported
        //action = keyLog.split('').map(() => '*').join(' ');
      }
    } else if (error.length) {
      // Withdrawl Error
      heading = cashWithdrawlText;
      info = error;
      prompt = pressEnterToRetryText;
    } else if (dispensedNotes.length === 0) {
      // Enter Amount / Withdraw
      heading = cashWithdrawlText;
      info = `${currentBalanceText} ${currencySymbol}${balance}`;
      prompt = enterAmountText;
      action = `${currencySymbol}${keyLog}`;
    } else {
      // Dispensing
      const twenties = countNotesOfValue(20, dispensedNotes, currencySymbol);
      const tens = countNotesOfValue(10, dispensedNotes, currencySymbol);
      const fives = countNotesOfValue(5, dispensedNotes, currencySymbol);

      heading = dispensingCashText;
      info = (balance < 0) ? `${overdrawnText}` : '';
      prompt = pressEnterORCancelText;
      action = `${dispensingText} ${currencySymbol}${keyLog}: ${twenties} ${tens} ${fives}`;
    }

    return (
      <div className="display">
        <h1 className="heading">{heading}</h1>
        <div className="info">{info}</div>
        <div className="prompt">{prompt}</div>
        <div className="action">{action}</div>
      </div>
    );
  }
}