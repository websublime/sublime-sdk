import { PayloadAction } from '@reduxjs/toolkit';

import { createSymbolID } from './helpers';
import { EssentialLinkStorage } from './storage';
import { EssentialStore } from './store';
import { EssentialStorage } from './types';

describe('> Link to EssentialLinkStorage', () => {
  let store: EssentialStore;

  beforeEach(() => {
    store = new EssentialStore({
      devTools: true
    });

    globalThis.localStorage.clear();
  });

  test('# It should create a essential storage with persisted state', async () => {
    const spyGetItem = jest.spyOn(globalThis.localStorage, 'getItem');

    const FooLinkID = createSymbolID('FOO-LINK');
    const ACTION_DECREMENT = 'ACTION_DECREMENT';
    const ACTION_INCREMENT = 'ACTION_INCREMENT';

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

      getDispatchers() {
        return {
          decrement: (value: number) => {
            this.dispatch(this.getActionType(ACTION_DECREMENT), value);
          },
          increment: (value: number) => {
            this.dispatch(this.getActionType(ACTION_INCREMENT), value);
          }
        };
      }

      protected getReducers() {
        return {
          [ACTION_DECREMENT]: (
            state: FooState,
            action: PayloadAction<number>
          ) => {
            state.count = state.count - action.payload;
          },
          [ACTION_INCREMENT]: (
            state: FooState,
            action: PayloadAction<number>
          ) => {
            state.count = state.count + action.payload;
          }
        };
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
    const FooLinkID = createSymbolID('FOO-LINK');
    const ACTION_DECREMENT = 'ACTION_DECREMENT';
    const ACTION_INCREMENT = 'ACTION_INCREMENT';

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

      getDispatchers() {
        return {
          decrement: (value: number) => {
            this.dispatch(this.getActionType(ACTION_DECREMENT), value);
          },
          increment: (value: number) => {
            this.dispatch(this.getActionType(ACTION_INCREMENT), value);
          }
        };
      }

      protected getReducers() {
        return {
          [ACTION_DECREMENT]: (
            state: FooState,
            action: PayloadAction<number>
          ) => {
            state.count = state.count - action.payload;
          },
          [ACTION_INCREMENT]: (
            state: FooState,
            action: PayloadAction<number>
          ) => {
            state.count = state.count + action.payload;
          }
        };
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
    const FooLinkID = createSymbolID('FOO-LINK');
    const ACTION_DECREMENT = 'ACTION_DECREMENT';
    const ACTION_INCREMENT = 'ACTION_INCREMENT';

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

      getDispatchers() {
        return {
          decrement: (value: number) => {
            this.dispatch(this.getActionType(ACTION_DECREMENT), value);
          },
          increment: (value: number) => {
            this.dispatch(this.getActionType(ACTION_INCREMENT), value);
          }
        };
      }

      protected getReducers() {
        return {
          [ACTION_DECREMENT]: (
            state: FooState,
            action: PayloadAction<number>
          ) => {
            state.count = state.count - action.payload;
          },
          [ACTION_INCREMENT]: (
            state: FooState,
            action: PayloadAction<number>
          ) => {
            state.count = state.count + action.payload;
          }
        };
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
