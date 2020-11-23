/**
 * Simple CashBox
 * Handles checking and dispensing of withdrawl requests
 */
const MAX_OVERDRAFT = 100;

// Ideally all of these resource strings should be retrieved from the resource
// bundle for the user's locale
const invalidInputText = "Input is invalid";
const invalidAmountText = "Amount requested is invalid";
const insufficientFundsText = "Insufficient account funds to fulfil request";
const cashBoxFundsText = "This ATM is currently unable to fulfil your request";

export default class CashBox {
  twenties = {
    value: 20,
    quantity: 0
  };

  tens = {
    value: 10,
    quantity: 0
  };

  fives = {
    value: 5,
    quantity: 0
  };

  constructor(numTwenties, numTens, numFives) {
    if (!isNaN(numTwenties)) this.twenties.quantity = parseInt(numTwenties);
    if (!isNaN(numTens)) this.tens.quantity = parseInt(numTens);
    if (!isNaN(numFives)) this.fives.quantity = parseInt(numFives);
  };

  // Helper methods to total note values
  totalTwenties = () => {
    return (this.twenties.value * this.twenties.quantity);
  };

  totalTens = () => {
    return (this.tens.value * this.tens.quantity);
  };

  totalFives = () => {
    return (this.fives.value * this.fives.quantity);
  };

  total = () => {
    return (this.totalTwenties() + this.totalTens() + this.totalFives());
  };

  /**
   * Perform validation checks on withdrawl amount
   * 
   * @param {*} requestedAmount Amount of cash requested
   * @param {*} balance Current user's balance
   */
  canDispense = (requestedAmount, balance) => {
    // check input is valid
    if (isNaN(requestedAmount) || isNaN(balance)) {
      throw new Error(invalidInputText);
    }

    requestedAmount = parseInt(requestedAmount);
    balance = parseInt(balance);

    // check amount is a multiple of 10 and not zero or negative
    if ((requestedAmount % 10 > 0) || (requestedAmount <= 0)) {
      throw new Error(invalidAmountText);
    }

    // check user allowed requested amount
    if (requestedAmount > (balance + MAX_OVERDRAFT)) {
      throw new Error(insufficientFundsText);
    }

    // check enough cash in box to fulfil request
    if (requestedAmount > this.total()) {
      throw new Error(cashBoxFundsText);
    }

    // Try to check the right notes available
    // e.g. request is £70 and cashbox has only 4x£20
    if ((requestedAmount % 20 === 10) 
      && ((this.totalTens() + this.totalFives()) < 10)) {
      throw new Error(cashBoxFundsText);
    }

    return true;
  };

  /**
   * Avoid some edge cases with £10 notes, which
   * could leave the total unreachable
   * 
   * @param {*} outstandingAmount Amount still to dispense
   */
  shouldDispenseTen = (outstandingAmount) => {
    // Don't add last ten if it gives a non-multiple of 20
    // and there isn't at least £10 in fives
    if ((this.tens.quantity === 1) 
      && (this.totalFives() < 10)
      && (outstandingAmount % 20 !== this.tens.value)) {
      return false;
    }

    return true;
  };

  /**
   * Avoid some edge cases with £5 notes, which
   * could leave the total unreachable
   * 
   * @param {*} outstandingAmount Amount still to dispense
   */
  shouldDispenseFive = (outstandingAmount) => {
    // If tens have run low but twenties haven't,
    // pause adding fives whilst can still add twenties
    if ((this.tens.quantity <= 1) 
      && (this.twenties.quantity > 0)
      && (outstandingAmount >= this.twenties.value)) {
      return false;
    }

    // Don't add last five if it gives a non-multiple of 10
    if ((this.fives.quantity === 1) 
      && (outstandingAmount % 10 !== this.fives.value)) {
      return false;
    }

    return true;
  };

  /**
   * Dispenses Cash after validating the withdrawl
   * 
   * @param {*} requestedAmount Amount of cash requested
   * @param {*} balance Current user's balance
   */
  dispenseCash = (requestedAmount, balance) => {
    // check first if this amount can be dispensed
    if (this.canDispense(requestedAmount, balance)) {
    
      requestedAmount = parseInt(requestedAmount);

      let countedCash = 0;
      let dispensedNotes = [];

      // helper method to dispense one note from a bundle
      // if any notes are available and don't exceed desired amount
      const dispenseNote = (bundle) => { 
        if ((bundle.quantity > 0)
          && (requestedAmount - countedCash) >= bundle.value) {
          countedCash += bundle.value;
          bundle.quantity--;
          dispensedNotes.push(bundle.value);
          //console.log(`Counted Cash : ${countedCash}, dispensedNotes : ${dispensedNotes}`);
        }
      };

      // loop through the bundles of note denominations
      // to try to get as even a spread as possible
      while (countedCash !== requestedAmount) {
        let numDispensed = dispensedNotes.length;

        dispenseNote(this.twenties);
        
        if (this.shouldDispenseTen(requestedAmount-countedCash)) {
          dispenseNote(this.tens);
        }

        if (this.shouldDispenseFive(requestedAmount-countedCash)) {
          dispenseNote(this.fives);
        }

        if (numDispensed === dispensedNotes.length) {
          // No notes dispensed this cycle!
          // Avoid inifite loop
          throw new Error(cashBoxFundsText);
        }
      }

      // return array of dispensedNotes in decreasing numerical order
      return dispensedNotes.sort((a,b) => b-a);
    } 
  };
}
