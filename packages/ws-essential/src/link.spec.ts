import { createAction, createReducer } from '@reduxjs/toolkit';

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
        const increment = createAction<number | undefined>(
          `${this.namespace.key.toString()}/INCREMENT`
        );

        createReducer(this.initial, {
          [increment.type]: (state, { payload }) =>
            this.increment({ payload, state })
        });

        return {
          increment
        };
      }

      increment(arguments_: { state: FooState; payload: number }) {
        arguments_.state.count = arguments_.payload;

        return arguments_.state;
      }
    }

    // BARLINK
    class BarLink extends EssentialLink<BarState> {
      get initial() {
        return { message: '' };
      }

      get actions() {
        return {
          init: () => this.initialize({})
        };
      }

      initialize(options: any) {
        return options;
      }
    }

    const fooLink = new FooLink(FooLinkID);
    const barLink = new BarLink(BarLinkID);

    const store = new EssentialStore({ devTools: true });

    fooLink.actions.increment(2);

    store.addLink(fooLink);
    store.addLink(barLink);

    expect(true).toBeTruthy();
  });
});
