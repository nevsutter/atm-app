import CashBox from '../CashBox';

let cashBox;

beforeEach(() => {
  cashBox = new CashBox(5,5,5);
});

it('contains the expected notes', () => {
  expect(cashBox.twenties.quantity).toEqual(5);
  expect(cashBox.tens.quantity).toEqual(5);
  expect(cashBox.fives.quantity).toEqual(5);
});

it('calculates the correct totals', () => {
  expect(cashBox.totalTwenties()).toEqual(100);
  expect(cashBox.totalTens()).toEqual(50);
  expect(cashBox.totalFives()).toEqual(25);
  expect(cashBox.total()).toEqual(175);
  expect(cashBox.canDispense(170,200)).toEqual(true);
});

it('handles zeros', () => {
  cashBox = new CashBox(0,0,0);
  expect(cashBox.totalTwenties()).toEqual(0);
  expect(cashBox.totalTens()).toEqual(0);
  expect(cashBox.totalFives()).toEqual(0);
  expect(cashBox.total()).toEqual(0);
});

it('handles strings', () => {
  cashBox = new CashBox('5',"5",`5`);
  expect(cashBox.totalTwenties()).toEqual(100);
  expect(cashBox.totalTens()).toEqual(50);
  expect(cashBox.totalFives()).toEqual(25);
  expect(cashBox.total()).toEqual(175);
});

it('handles negatives', () => {
  // Should probably protect against this but
  // at least it doesn't break anything
  cashBox = new CashBox(-5,-5,-5);
  expect(cashBox.totalTwenties()).toEqual(-100);
  expect(cashBox.totalTens()).toEqual(-50);
  expect(cashBox.totalFives()).toEqual(-25);
  expect(cashBox.total()).toEqual(-175);
  expect(() => cashBox.canDispense(10,10)).toThrow();
});

it('ignores NaN values', () => {
  cashBox = new CashBox('a',"?",`test`);
  expect(cashBox.twenties.quantity).toEqual(0);
  expect(cashBox.tens.quantity).toEqual(0);
  expect(cashBox.fives.quantity).toEqual(0);
});

it('only can dispense valid amounts', () => {
  expect(() => cashBox.canDispense('a',100)).toThrow();
  expect(() => cashBox.canDispense(100,'?')).toThrow();

  // no negative withdrawls
  expect(() => cashBox.canDispense(-10,100)).toThrow();

  // but negative balance (within overdraft limit) ok
  expect(cashBox.canDispense(50,-10)).toEqual(true);

  // no non-multiples of 10
  expect(() => cashBox.canDispense(77,100)).toThrow();

  // but non-multiples of 10 in balance ok
  expect(cashBox.canDispense(50,77)).toEqual(true);
});

it('will limit overdraft to 100', () => {
  expect(cashBox.canDispense(50,-50)).toEqual(true);
  expect(cashBox.canDispense(20,-80)).toEqual(true);
  expect(cashBox.canDispense(160,60)).toEqual(true);

  expect(() => cashBox.canDispense(50,-51)).toThrow();
  expect(() => cashBox.canDispense(30,-80)).toThrow();
  expect(() => cashBox.canDispense(160,51)).toThrow();
});

it('will reject withdrawl greater than total its holding', () => {
  // Holding 175
  expect(cashBox.canDispense(170,200)).toEqual(true);

  expect(() => cashBox.canDispense(180, 200)).toThrow();
});

it('will reject non-multiples of 20 when only £20 notes left', () => {
  cashBox = new CashBox(4,0,0);
  expect(() => cashBox.canDispense(70, 200)).toThrow();

  cashBox = new CashBox(10,0,0);
  expect(() => cashBox.canDispense(130, 200)).toThrow();

  cashBox = new CashBox(4,1,0);
  expect(cashBox.canDispense(70,200)).toEqual(true);

  cashBox = new CashBox(4,0,2);
  expect(cashBox.canDispense(70,200)).toEqual(true);

  cashBox = new CashBox(4,1,2);
  expect(cashBox.canDispense(70,200)).toEqual(true);
});

it('will determine whether or not a £10 note should be dispensed', () => {
  // with just one ten, can't add it and hit a target
  // that's a multiple of 20 unless there's at least
  // 2 fives.
  cashBox = new CashBox(4,1,0);
  expect(cashBox.shouldDispenseTen(80)).toEqual(false);
  expect(cashBox.shouldDispenseTen(60)).toEqual(false);
  expect(cashBox.shouldDispenseTen(90)).toEqual(true);
  expect(cashBox.shouldDispenseTen(70)).toEqual(true);

  cashBox = new CashBox(4,1,1);
  expect(cashBox.shouldDispenseTen(80)).toEqual(false);
  expect(cashBox.shouldDispenseTen(60)).toEqual(false);
  expect(cashBox.shouldDispenseTen(90)).toEqual(true);
  expect(cashBox.shouldDispenseTen(70)).toEqual(true);

  // with at least 2 fives, can dispense a single 10, 
  // even if target is multiple of 20
  cashBox = new CashBox(4,1,2);
  expect(cashBox.shouldDispenseTen(80)).toEqual(true);
  expect(cashBox.shouldDispenseTen(60)).toEqual(true);
  expect(cashBox.shouldDispenseTen(90)).toEqual(true);
  expect(cashBox.shouldDispenseTen(70)).toEqual(true);

  cashBox = new CashBox(4,1,3);
  expect(cashBox.shouldDispenseTen(80)).toEqual(true);
  expect(cashBox.shouldDispenseTen(60)).toEqual(true);
  expect(cashBox.shouldDispenseTen(90)).toEqual(true);
  expect(cashBox.shouldDispenseTen(70)).toEqual(true);

  // can dispense if more than one ten left
  cashBox = new CashBox(4,2,0);
  expect(cashBox.shouldDispenseTen(80)).toEqual(true);
  expect(cashBox.shouldDispenseTen(60)).toEqual(true);
  expect(cashBox.shouldDispenseTen(90)).toEqual(true);
  expect(cashBox.shouldDispenseTen(70)).toEqual(true);

  cashBox = new CashBox(4,3,0);
  expect(cashBox.shouldDispenseTen(80)).toEqual(true);
  expect(cashBox.shouldDispenseTen(60)).toEqual(true);
  expect(cashBox.shouldDispenseTen(90)).toEqual(true);
  expect(cashBox.shouldDispenseTen(70)).toEqual(true);
});

it('will determine whether or not a £5 note should be dispensed', () => {
  // Still twenties and tens plus more than one five
  cashBox = new CashBox(4,2,2);
  expect(cashBox.shouldDispenseFive(80)).toEqual(true);
  expect(cashBox.shouldDispenseFive(90)).toEqual(true);
  expect(cashBox.shouldDispenseFive(75)).toEqual(true);
  expect(cashBox.shouldDispenseFive(70)).toEqual(true);

  // with just one five, can't add it and hit a target
  // that's a multiple of 10.
  cashBox = new CashBox(4,2,1);
  expect(cashBox.shouldDispenseFive(80)).toEqual(false);
  expect(cashBox.shouldDispenseFive(90)).toEqual(false);
  expect(cashBox.shouldDispenseFive(75)).toEqual(true);
  expect(cashBox.shouldDispenseFive(70)).toEqual(false);

  // when tens run out, adding a five, when twenty can 
  // still be added, could prevent target being hit
  // Fives will be available again if/when outstanding
  // amount is less than 20
  cashBox = new CashBox(4,0,2);
  expect(cashBox.shouldDispenseFive(80)).toEqual(false);
  expect(cashBox.shouldDispenseFive(90)).toEqual(false);
  expect(cashBox.shouldDispenseFive(75)).toEqual(false);
  expect(cashBox.shouldDispenseFive(10)).toEqual(true);
  expect(cashBox.shouldDispenseFive(5)).toEqual(true);

  // number of fives checked elsewhere so this returns
  // true, ie a five *should* be returned but it just
  // happens that there isn't enough of them
  expect(cashBox.shouldDispenseFive(15)).toEqual(true);

  // if twenties and tens run out, always *should*
  // return a five
  cashBox = new CashBox(0,0,20);
  expect(cashBox.shouldDispenseFive(80)).toEqual(true);
  expect(cashBox.shouldDispenseFive(90)).toEqual(true);
  expect(cashBox.shouldDispenseFive(75)).toEqual(true);
  expect(cashBox.shouldDispenseFive(10)).toEqual(true);
  expect(cashBox.shouldDispenseFive(5)).toEqual(true);
  
});

it('will validate before dispensing', () => {
  // some of the above tests but calling dispenseCash 
  // NaN withdrawl
  expect(() => cashBox.dispenseCash('a',100)).toThrow();
  // NaN balance
  expect(() => cashBox.dispenseCash(100,'?')).toThrow();
  // negative withdrawl
  expect(() => cashBox.dispenseCash(-10,100)).toThrow();
  // non-multiple of 10
  expect(() => cashBox.dispenseCash(77,100)).toThrow();
  // exceeds overdraft
  expect(() => cashBox.dispenseCash(50,-51)).toThrow();
  // exceeds cash in box
  expect(() => cashBox.dispenseCash(180, 200)).toThrow();
  // only has twenties
  cashBox = new CashBox(10,0,0);
  expect(() => cashBox.dispenseCash(130, 200)).toThrow();
});

it('will dispense the correct amount', () => {
  expect(cashBox.dispenseCash(100,200)).toEqual([20,20,20,10,10,10,5,5]);

  cashBox = new CashBox(5,5,5);
  expect(cashBox.dispenseCash(90,200)).toEqual([20,20,20,10,10,5,5]);

  cashBox = new CashBox(5,5,5);
  expect(cashBox.dispenseCash(80,200)).toEqual([20,20,10,10,10,5,5]);

  cashBox = new CashBox(5,5,5);
  expect(cashBox.dispenseCash(40,200)).toEqual([20,10,5,5]);
});

it('will dispense evenly when possible', () => {
  expect(cashBox.dispenseCash(140,200)).toEqual([20,20,20,20,10,10,10,10,5,5,5,5]);
});

it('will cope when some notes run out', () => {
  // simple cases
  cashBox = new CashBox(1,5,5);
  expect(cashBox.dispenseCash(50,200)).toEqual([20,10,10,5,5]);

  cashBox = new CashBox(5,0,5);
  expect(cashBox.dispenseCash(50,200)).toEqual([20,20,5,5]);

  cashBox = new CashBox(0,0,10);
  expect(cashBox.dispenseCash(50,200)).toEqual([5,5,5,5,5,5,5,5,5,5]);

  // when tens run low, should avoid using fives whilst can 
  // still use twenties, otherwise would get stuck after
  // sequence 20,10,5,20,5,5 = 65 even though £70 was possible
  cashBox = new CashBox(4,1,3);
  expect(cashBox.dispenseCash(70,200)).toEqual([20,20,20,10]);

  // check return to using fives when twenty won't fit
  cashBox = new CashBox(4,1,3);
  expect(cashBox.dispenseCash(60,200)).toEqual([20,20,10,5,5]);

  cashBox = new CashBox(4,2,3);
  expect(cashBox.dispenseCash(110,200)).toEqual([20,20,20,20,10,10,5,5]);

  // check won't use odd number of fives for multiples of 10
  cashBox = new CashBox(2,5,3);
  expect(cashBox.dispenseCash(90,200)).toEqual([20,20,10,10,10,10,5,5]);

  // check won't use last ten, when <£10 in fives, if it 
  // would make outstanding amount not a multiple of 20
  cashBox = new CashBox(4,2,0);
  expect(cashBox.dispenseCash(70,200)).toEqual([20,20,20,10]);

  cashBox = new CashBox(4,2,1);
  expect(cashBox.dispenseCash(70,200)).toEqual([20,20,20,10]);

  // £10 of fives unlocks the 'last' ten
  cashBox = new CashBox(4,2,2);
  expect(cashBox.dispenseCash(70,200)).toEqual([20,20,10,10,5,5]);

  // more test cases of lower value notes running out
  cashBox = new CashBox(4,2,0);
  expect(cashBox.dispenseCash(80,200)).toEqual([20,20,20,10,10]);

  cashBox = new CashBox(4,2,1);
  expect(cashBox.dispenseCash(80,200)).toEqual([20,20,20,10,10]);

  cashBox = new CashBox(4,2,2);
  expect(cashBox.dispenseCash(80,200)).toEqual([20,20,20,10,10]);

  cashBox = new CashBox(4,3,0);
  expect(cashBox.dispenseCash(80,200)).toEqual([20,20,20,10,10]);

  cashBox = new CashBox(4,3,1);
  expect(cashBox.dispenseCash(80,200)).toEqual([20,20,20,10,10]);

  cashBox = new CashBox(4,3,2);
  expect(cashBox.dispenseCash(80,200)).toEqual([20,20,10,10,10,5,5]);
});

it('will correctly adjust note quantities & totals', () => {
  expect(cashBox.dispenseCash(140,200)).toEqual([20,20,20,20,10,10,10,10,5,5,5,5]);

  expect(cashBox.twenties.quantity).toEqual(1);
  expect(cashBox.tens.quantity).toEqual(1);
  expect(cashBox.fives.quantity).toEqual(1);

  expect(cashBox.totalTwenties()).toEqual(20);
  expect(cashBox.totalTens()).toEqual(10);
  expect(cashBox.totalFives()).toEqual(5);
  expect(cashBox.total()).toEqual(35);

  expect(cashBox.canDispense(30,200)).toEqual(true);
  expect(() => cashBox.canDispense(40, 200)).toThrow();
});

it('will dispense the challenge amounts correctly', () => {
  cashBox = new CashBox(7,15,4);

  expect(cashBox.dispenseCash(140,220)).toEqual([20,20,20,20,10,10,10,10,5,5,5,5]);
  expect(cashBox.dispenseCash(50,80)).toEqual([20,20,10]);
  expect(cashBox.dispenseCash(90,30)).toEqual([20,10,10,10,10,10,10,10]);

  expect(cashBox.twenties.quantity).toEqual(0);
  expect(cashBox.tens.quantity).toEqual(3);
  expect(cashBox.fives.quantity).toEqual(0);

  expect(cashBox.totalTwenties()).toEqual(0);
  expect(cashBox.totalTens()).toEqual(30);
  expect(cashBox.totalFives()).toEqual(0);
  expect(cashBox.total()).toEqual(30);
});

