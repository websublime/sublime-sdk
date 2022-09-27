import { PayloadAction, nanoid } from '@reduxjs/toolkit';

import { EssentialLinkStorage } from './storage';
import { EssentialStore } from './store';
import { EssentialStorage } from './types';

/*
describe('> Link to EssentialLinkStorage', () => {
  let store: EssentialStore;

  beforeEach(() => {
    store = new EssentialStore({
      devTools: true
    });
  });

  test('# It should create a essential storage with persisted state', async () => {
    const spyGetItem = jest.spyOn(global.localStorage, 'getItem');

    const FooLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type FooDispatchers = {
      increment: (value: number) => void;
      decrement: (value: number) => void;
    };

    class FooLink extends EssentialLinkStorage {
      get initialState(): FooState {
        return {
          count: 0
        };
      }

      get storage() {
        return EssentialStorage.LOCAL;
      }

      protected definedReducers() {
        return {
          decrement: this.decrement,
          increment: this.increment
        };
      }

      private increment(state: FooState, action: PayloadAction<number>) {
        state.count = state.count + action.payload;
      }

      private decrement(state: FooState, action: PayloadAction<number>) {
        state.count = state.count - action.payload;
      }
    }

    const fooLink = new FooLink(FooLinkID);

    spyGetItem.mockImplementationOnce(() => {
      return JSON.stringify({ count: 1 });
    });

    await store.addLink(fooLink);

    store.subscribe(FooLinkID, (state: FooState) => {
      expect(state).toEqual({ count: 2 });
    });

    const { increment } = store.getDispatchers<FooDispatchers>(FooLinkID);

    increment(1);

    spyGetItem.mockClear();
  });

  test('# It should update and use localStorage on link change', async () => {
    const FooLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type FooDispatchers = {
      increment: (value: number) => void;
      decrement: (value: number) => void;
    };

    class FooLink extends EssentialLinkStorage {
      get initialState(): FooState {
        return {
          count: 0
        };
      }

      get storage() {
        return EssentialStorage.LOCAL;
      }

      protected definedReducers() {
        return {
          decrement: this.decrement,
          increment: this.increment
        };
      }

      private increment(state: FooState, action: PayloadAction<number>) {
        state.count = state.count + action.payload;
      }

      private decrement(state: FooState, action: PayloadAction<number>) {
        state.count = state.count - action.payload;
      }
    }

    const fooLink = new FooLink(FooLinkID);

    await store.addLink(fooLink);

    store.subscribe(FooLinkID, (state: FooState) => {
      expect(state.count).toEqual(1);

      setTimeout(() => {
        const local = JSON.parse(
          localStorage.getItem(fooLink.storageName) as any
        );
        expect(local['count']).toEqual(state.count);
      });
    });

    const { increment } = store.getDispatchers<FooDispatchers>(FooLinkID);

    increment(1);
  });

  test('# It should update and use sessionStorage on link change', async () => {
    const FooLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type FooDispatchers = {
      increment: (value: number) => void;
      decrement: (value: number) => void;
    };

    class FooLink extends EssentialLinkStorage {
      get initialState(): FooState {
        return {
          count: 0
        };
      }

      get storage() {
        return EssentialStorage.SESSION;
      }

      protected definedReducers() {
        return {
          decrement: this.decrement,
          increment: this.increment
        };
      }

      private increment(state: FooState, action: PayloadAction<number>) {
        state.count = state.count + action.payload;
      }

      private decrement(state: FooState, action: PayloadAction<number>) {
        state.count = state.count - action.payload;
      }
    }

    const fooLink = new FooLink(FooLinkID);

    await store.addLink(fooLink);

    store.subscribe(FooLinkID, (state: FooState) => {
      expect(state.count).toEqual(1);

      setTimeout(() => {
        const local = JSON.parse(
          sessionStorage.getItem(fooLink.storageName) as any
        );
        expect(local['count']).toEqual(state.count);
      });
    });

    const { increment } = store.getDispatchers<FooDispatchers>(FooLinkID);

    increment(1);
  });
});
*/
