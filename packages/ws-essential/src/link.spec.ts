import { Draft } from '@reduxjs/toolkit';

import { uniqueID } from './helpers';
import { EssentialLink } from './link';
import { EssentialStore } from './store';

describe('> EssentialLink', () => {
  test('It should create a essential link class', () => {
    debugger;
    const FooLinkID = { key: Symbol(uniqueID()) };
    const BarLinkID = { key: Symbol(uniqueID()) };

    type FooState = { count: number };
    type BarState = { message: string };

    // FOOLINK
    class FooLink extends EssentialLink<FooState> {
      get initial() {
        return { count: 0 };
      }

      get actions() {
        const increment = this.createAction<number | undefined>('INCREMENT');
        const decrement = this.createAction<number | undefined>('DECREMENT');

        this.registerReducer(increment, this.increment);
        this.registerReducer(decrement, this.decrement);

        return {
          decrement,
          increment
        };
      }

      bootstrap() {
        // eslint-disable-next-line no-console
        console.log('BOOTSTRAP');
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

    // BARLINK
    class BarLink extends EssentialLink<BarState> {
      get initial() {
        return { message: '' };
      }

      get actions() {
        const message = this.createAction<string | undefined>('MESSAGE');

        this.createReducer(message, this.message);

        return {
          message
        };
      }

      private message(parameters: { state: Draft<BarState>; payload: string }) {
        parameters.state.message = parameters.payload;

        return parameters.state;
      }
    }

    const fooLink = new FooLink(FooLinkID);
    const barLink = new BarLink(BarLinkID);

    const store = new EssentialStore({ devTools: true });

    store.addLink(fooLink);
    store.addLink(barLink);

    expect(true).toBeTruthy();
  });
});
