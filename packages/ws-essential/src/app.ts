/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { EssentialLink } from './link';
import { EssentialLinkStorage } from './storage';

import {
  EssentialStorage,
  PayloadAction,
  createSymbolID,
  useStore
} from './index';

document.addEventListener('readystatechange', function () {
  const state = document.readyState;

  if (state == 'interactive') {
    // eslint-disable-next-line no-console
    console.log('INTERATIVE');
  } else if (state == 'complete') {
    init();
  }
});

async function init() {
  const store = useStore({
    devTools: true
  });

  const FooLinkID = createSymbolID('FOO-LINK');
  const ACTION_DECREMENT = 'ACTION_DECREMENT';
  const ACTION_INCREMENT = 'ACTION_INCREMENT';

  const BarLinkID = createSymbolID('BAR-LINK');
  const ACTION_PUBLISH = 'ACTION_PUBLISH';

  type FooState = { count: number };
  type FooDispatchers = {
    increment: (payload: number) => void;
    decrement: (payload: number) => void;
  };

  type BarState = { history: string[]; message: string };
  type BarDispatchers = {
    publish: (payload: string) => void;
  };

  // FOOLINK
  class FooLink extends EssentialLink<FooState> {
    get initialState() {
      return { count: 0 };
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

  // BARLINK
  class BarLink extends EssentialLinkStorage<BarState> {
    get initialState() {
      return { history: [], message: '' };
    }

    get storage() {
      return EssentialStorage.SESSION;
    }

    getDispatchers() {
      return {
        publish: (value: string) => {
          this.dispatch(this.getActionType(ACTION_PUBLISH), value);
        }
      };
    }

    protected getReducers() {
      return {
        [ACTION_PUBLISH]: (state: BarState, action: PayloadAction<string>) => {
          state.message = action.payload;
          state.history.push(action.payload);
        }
      };
    }
  }

  await store.addLink(new FooLink(FooLinkID));
  await store.addLink(new BarLink(BarLinkID));

  const { decrement, increment } =
    store.getDispatchers<FooDispatchers>(FooLinkID);
  const { publish } = store.getDispatchers<BarDispatchers>(BarLinkID);

  store.subscribe(FooLinkID, (state: FooState) => {
    const element = document.querySelector('#example') as HTMLDivElement;

    element.innerHTML = `<span>${state.count}</span>`;
  });

  store.subscribe(BarLinkID, (state: BarState) => {
    const element = document.querySelector('#messages') as HTMLDivElement;
    const message = document.createElement('p');
    message.textContent = state.message;

    element.append(message);
  });

  const buttonIncrement = document.querySelector(
    '#increment'
  ) as HTMLButtonElement;
  const buttonDecrement = document.querySelector(
    '#decrement'
  ) as HTMLButtonElement;
  const buttonPublish = document.querySelector('#publish') as HTMLButtonElement;

  buttonIncrement.addEventListener('click', () => {
    increment(1);
  });

  buttonDecrement.addEventListener('click', () => {
    decrement(1);
  });

  buttonPublish.addEventListener('click', () => {
    const input = document.querySelector('#message') as HTMLInputElement;

    if (input.value?.length) {
      publish(input.value);
      input.value = '';
    }
  });
}
