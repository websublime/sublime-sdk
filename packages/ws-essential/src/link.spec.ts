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
      expect(state).toEqual({ count: 1 });
      unsubscribe();
    });

    dispacther.increment(1);
  });

  test('It should manage multiple links', async () => {
    expect.assertions(2);

    const FooLinkID = { key: Symbol(nanoid()) };
    const BarLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type FooDispatchers = {
      increment: (payload: number) => void;
      decrement: (payload: number) => void;
    };

    type BarState = { message: string };
    type BarDispatchers = {
      publish: (payload: string) => void;
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

    // BARLINK
    class BarLink extends EssentialLink<BarState> {
      get initial() {
        return { message: '' };
      }

      bootstrap() {
        this.createAction<string>('PUBLISH', this.publish);
      }

      private publish() {
        return (state: BarState, action) => {
          state.message = action.payload;
        };
      }
    }

    const fooLink = new FooLink(FooLinkID);
    const barLink = new BarLink(BarLinkID);

    const store = new EssentialStore({ devTools: true });

    store.addLink(fooLink);
    store.addLink(barLink);

    const { increment } = store.getDispatchers<FooDispatchers>(FooLinkID);
    const { publish } = store.getDispatchers<BarDispatchers>(BarLinkID);

    store.subscribe(FooLinkID, state => {
      expect(state).toEqual({ count: 1 });
    });

    store.subscribe(BarLinkID, state => {
      expect(state).toEqual({ message: 'Hello World' });
    });

    increment(1);
    publish('Hello World');
  });
});
