import { Draft } from '@reduxjs/toolkit';

import { uniqueID } from './helpers';
import { EssentialLink } from './link';
import { useRedux } from './redux';
import { EssentialStore } from './store';

describe('> EssentialLink', () => {
  test('It should create a essential link class', () => {
    debugger;
    const FooLinkID = { key: Symbol(uniqueID()) };

    type FooState = { count: number };

    // FOOLINK
    class FooLink extends EssentialLink<FooState> {
      get initial() {
        return { count: 0 };
      }

      get actions() {
        return {
          poc: this.createAction<number>('POC', this.poc)
        };
      }

      bootstrap() {
        // eslint-disable-next-line no-console
        console.log('BOOTSTRAP');
      }

      private poc(increment: number) {
        return (state: FooState) => {
          debugger;
          state.count = increment;
          return state;
        };
      }

      private increment(parameters: {
        state: Draft<FooState>;
        payload: number;
      }) {
        parameters.state.count = parameters.payload;

        return parameters.state;
      }

      private decrement(parameters: {
        state: Draft<FooState>;
        payload: number;
      }) {
        parameters.state.count = parameters.state.count - parameters.payload;

        return parameters.state;
      }
    }

    const fooLink = new FooLink(FooLinkID);

    const store = new EssentialStore({ devTools: true });

    store.addLink(fooLink);
    const dispacther = store.getDispatchers(FooLinkID);

    dispacther.poc(1);

    const { store: reduxStore } = useRedux();

    console.log(reduxStore.getState());

    expect(true).toBeTruthy();
  });
});
