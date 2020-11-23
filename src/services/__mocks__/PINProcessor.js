/**
 * Mock methods for PINProcessor
 */

export function validatePIN(value) {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      value === '1111'
        ? resolve(220)
        : reject(new Error('403')),
    );
  });
}