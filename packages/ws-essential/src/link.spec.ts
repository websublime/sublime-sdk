import { EssentialLink } from './link';

describe('> EssentialLink', () => {
  test('It should create a essential link class', () => {
    class MyLink extends EssentialLink {}

    const link = new MyLink();

    expect(true).toBeTruthy();
  });
});
