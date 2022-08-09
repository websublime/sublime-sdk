import { isEmpty, isNil, isSsr, uniqueID } from './helpers';

describe('> Helpers', () => {
  test('Should test platform', () => {
    expect(isSsr()).toBe(true);
  });

  test('Should test id generation', () => {
    const id = uniqueID();

    expect(typeof id).toBe('string');
  });

  test('Should test value is empty', () => {
    // eslint-disable-next-line unicorn/no-null
    const isNull = isEmpty(null);
    // eslint-disable-next-line unicorn/no-useless-undefined
    const isUndefined = isEmpty(undefined);
    const isValid = isEmpty(1);

    expect(isNull).toBeTruthy();
    expect(isUndefined).toBeTruthy();
    expect(isValid).toBeFalsy();
  });

  test('Should test is null or undefined', () => {
    // eslint-disable-next-line unicorn/no-null
    const isNull = isNil(null);
    // eslint-disable-next-line unicorn/no-useless-undefined
    const isUndefined = isNil(undefined);
    const isNotValid = isNil(1);

    expect(isNull).toBeTruthy();
    expect(isUndefined).toBeTruthy();
    expect(isNotValid).toBeFalsy();
  });
});
