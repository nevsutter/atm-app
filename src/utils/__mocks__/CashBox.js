/**
 * Mock methods for CashBox
 */

export default class CashBox {
  /**
   * This is the only method currently called externally
   */
  dispenseCash = (requestedAmount, balance) => {
    if (requestedAmount === 70) {
      return [20,20,10,10,5,5];
    } else {
      throw new Error("An Error");
    }
  };
}
