import {validatePIN} from '../PINProcessor';

beforeEach(() => {
  fetch.resetMocks();
});

it('rejects non-numerical PINs', async () => {
  await expect(validatePIN('abcd')).rejects.toThrowError('Input is invalid');
});

it('rejects alpha-numerical PINs', async () => {
  await expect(validatePIN('12ab')).rejects.toThrowError('Input is invalid');
});

it('accepts numerical PIN and returns balance, if valid', async () => {
  fetch.mockResponseOnce(JSON.stringify({ currentBalance: 220 }));

  await expect(validatePIN('1234')).resolves.toBe(220);
});

it('throws error if response body invalid', async () => {
  fetch.mockResponseOnce(JSON.stringify({ yellowFruit: 'Banana' }));

  await expect(validatePIN('1234')).rejects.toThrowError(new Error('500'));
});

it('throws error if currentBalance invalid', async () => {
  fetch.mockResponseOnce(JSON.stringify({ currentBalance: 'Banana' }));

  await expect(validatePIN('1234')).rejects.toThrowError('500');
});

it('throws error if PIN invalid', async () => {
  fetch.mockResponseOnce('{}', { status: '403'});

  await expect(validatePIN('1234')).rejects.toThrowError('403');
});

it('throws on fetch error', async () => {
  fetch.mockReject(new Error('error message'))

  await expect(validatePIN('1234')).rejects.toThrowError('error message');
});
