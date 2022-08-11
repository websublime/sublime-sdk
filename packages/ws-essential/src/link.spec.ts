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

      bootstrap() {
        // eslint-disable-next-line no-console
        console.log('BOOTSTRAP');
        const poc = this.createAction<number>('POC', this.poc);

        this.actions = {
          poc
        };
      }

      private poc() {
        return (state: FooState, action) => {
          debugger;
          state.count = action.payload;
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

    const { store: reduxStore } = useRedux();
    //reduxStore.dispatch(dispacther.poc(1));
    dispacther.poc(1);

    console.log(reduxStore.getState());

    expect(true).toBeTruthy();
  });
});
