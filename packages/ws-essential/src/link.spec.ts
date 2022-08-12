import { nanoid } from '@reduxjs/toolkit';

import { EssentialLink } from './link';
import { EssentialStore } from './store';

describe('> EssentialLink', () => {
  test('It should create a essential link class', () => {
    const FooLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type FooDispatchers = {
      increment: (payload: number) => void;
      decrement: (payload: number) => void;
    };

    // FOOLINK
    class FooLink extends EssentialLink<FooState> {
      get initial() {
        return { count: 0 };
      }

      bootstrap() {
        this.createAction<number>('INCREMENT', this.increment);
        this.createAction<number>('DECREMENT', this.decrement);
      }

      private increment() {
        return (state: FooState, action) => {
          state.count = state.count + action.payload;
        };
      }

      private decrement() {
        return (state: FooState, action) => {
          state.count = state.count - action.payload;
        };
      }
    }

    const fooLink = new FooLink(FooLinkID);
    const store = new EssentialStore({ devTools: true });

    store.addLink(fooLink);

    const dispacther = store.getDispatchers<FooDispatchers>(FooLinkID);
    const unsubscribe = store.subscribe(FooLinkID, state => {
      // TODO. unsubscribe not working
      expect(state).toEqual({ count: 1 });
      unsubscribe();
    });

    dispacther.increment(1);
  });
});
