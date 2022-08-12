import { nanoid } from '@reduxjs/toolkit';

import { EssentialLink } from './link';
import { useStore } from './main';
import { EssentialStore } from './store';

describe('> Gobal store', () => {
  let store: EssentialStore;

  beforeEach(() => {
    store = useStore({ devTools: true });
  });

  test('It should add a essential link to global store', () => {
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

    store.addLink(new FooLink(FooLinkID));

    const dispacther = store.getDispatchers<FooDispatchers>(FooLinkID);
    store.subscribe(FooLinkID, state => {
      expect(state).toEqual({ count: 1 });
    });

    dispacther.increment(1);
  });
});
