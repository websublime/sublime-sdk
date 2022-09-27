import { PayloadAction, nanoid } from '@reduxjs/toolkit';

import { EssentialLink } from './link';
import { EssentialStore } from './store';

describe('> Link to EssentialStore', () => {
  let store: EssentialStore;

  beforeEach(() => {
    store = new EssentialStore({
      devTools: true
    });
  });

  test('# It should create a essential link class', async () => {
    const FooLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type FooDispatchers = {
      increment: (value: number) => void;
      decrement: (value: number) => void;
    };

    class FooLink extends EssentialLink {
      get initialState(): FooState {
        return {
          count: 0
        };
      }

      getDispatchers() {
        return {
          decrement: (value: number) => {
            this.dispatch(this.getActionType('decrement'), value);
          },
          increment: (value: number) => {
            this.dispatch(this.getActionType('increment'), value);
          }
        };
      }

      protected getReducers() {
        return {
          decrement: (state: FooState, action: PayloadAction<number>) => {
            state.count = state.count - action.payload;
          },
          increment: (state: FooState, action: PayloadAction<number>) => {
            state.count = state.count + action.payload;
          }
        };
      }
    }

    const fooLink = new FooLink(FooLinkID);

    await store.addLink(fooLink);
    store.subscribe(FooLinkID, (state: FooState) => {
      expect(state).toEqual({ count: 1 });
    });

    const { increment } = store.getDispatchers<FooDispatchers>(FooLinkID);

    increment(1);
  });

  /*
  test('# It should call onChange', async () => {
    expect.assertions(4);

    const FooLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type FooDispatchers = {
      increment: (value: number) => void;
      decrement: (value: number) => void;
    };

    class FooLink extends EssentialLink {
      get initialState(): FooState {
        return {
          count: 0
        };
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

      public async onChange(
        oldState: FooState,
        newState: FooState,
        action: PayloadAction<any>
      ) {
        expect(oldState).toEqual(this.initialState);
        expect(newState).toEqual({ count: -1 });
        expect(action).toEqual({
          payload: 1,
          type: `${FooLinkID.key.toString()}/decrement`
        });
      }
    }

    const spyChange = jest.spyOn(FooLink.prototype, 'onChange');
    const fooLink = new FooLink(FooLinkID);

    await store.addLink(fooLink);
    const { decrement } = store.getDispatchers<FooDispatchers>(FooLinkID);

    decrement(1);

    expect(spyChange).toHaveBeenCalledTimes(1);

    spyChange.mockClear();
  });

  test('# It should create multiple links', async () => {
    expect.assertions(2);

    const FooLinkID = { key: Symbol(nanoid()) };
    const BarLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };
    type BarState = { message: string };

    type FooDispatchers = {
      increment: (value: number) => void;
      decrement: (value: number) => void;
    };

    type BarDispatchers = {
      publish: (value: string) => void;
    };

    class FooLink extends EssentialLink {
      get initialState(): FooState {
        return {
          count: 0
        };
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

    class BarLink extends EssentialLink {
      get initialState(): BarState {
        return {
          message: ''
        };
      }

      protected definedReducers() {
        return {
          publish: this.publish
        };
      }

      private publish(state: BarState, action: PayloadAction<string>) {
        state.message = action.payload;
      }
    }

    const fooLink = new FooLink(FooLinkID);
    const barLink = new BarLink(BarLinkID);

    await store.addLink(fooLink);
    await store.addLink(barLink);

    store.subscribe(FooLinkID, (state: FooState) => {
      expect(state).toEqual({ count: 1 });
    });

    store.subscribe(BarLinkID, (state: BarState) => {
      expect(state).toEqual({ message: 'Hello World' });
    });

    const { increment } = store.getDispatchers<FooDispatchers>(FooLinkID);
    const { publish } = store.getDispatchers<BarDispatchers>(BarLinkID);

    increment(1);
    publish('Hello World');
  });

  test('# It should call onCreate', async () => {
    expect.assertions(2);

    const FooLinkID = { key: Symbol(nanoid()) };

    type FooState = { count: number };

    class FooLink extends EssentialLink {
      get initialState(): FooState {
        return {
          count: 0
        };
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

      public onCreate() {
        expect(true).toBeTruthy();
      }
    }

    const spyBootstrap = jest.spyOn(FooLink.prototype, 'onCreate');
    new FooLink(FooLinkID);

    expect(spyBootstrap).toHaveBeenCalledTimes(1);

    spyBootstrap.mockClear();
  });
  */
});
