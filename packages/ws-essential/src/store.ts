import {
  ConfigureStoreOptions,
  UnsubscribeListener,
  combineReducers,
  createAction,
  createReducer,
  isAnyOf
} from '@reduxjs/toolkit';
import { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';

import { EssentialLink } from './link';
import { setOptions, useRedux } from './redux';
import { Action, Class, SymbolID } from './types';

type LinkEntries = {
  link: InstanceType<Class<EssentialLink>>;
  reducer: ReducerWithInitialState<any>;
  listeners: any[];
  subscription: UnsubscribeListener;
};

export class EssentialStore {
  private links = new WeakMap<SymbolID, LinkEntries>();

  constructor(options: Partial<ConfigureStoreOptions>) {
    setOptions(options);
  }

  public addLink<Link extends EssentialLink>(link: InstanceType<Class<Link>>) {
    if (!this.links.has(link.namespace)) {
      const reducers = link.getReducers();
      const { store } = useRedux();

      const reducer = createReducer(link.initial, builder => {
        if (reducers) {
          for (const item of reducers) {
            builder.addCase(item.action, item.reducer);
          }
        }

        builder.addDefaultCase(state => state);
      });

      const subscription = this.initMiddleware(link);

      store.replaceReducer(
        combineReducers({ [link.namespace.key.toString()]: reducer })
      );

      this.links.set(link.namespace, {
        link,
        listeners: [],
        reducer,
        subscription
      });
    }
  }

  public getDispatchers(linkID: SymbolID) {
    const { link } = this.links.get(linkID) || {};

    if (link) {
      return link.actions as Record<string, Action>;
    }

    throw new Error('Link not found');
  }

  private initMiddleware<Link extends EssentialLink>(
    link: InstanceType<Class<Link>>
  ) {
    const { middleware } = useRedux();

    return middleware.startListening({
      effect: async (action, _listenerApi) => {
        // eslint-disable-next-line no-console
        console.log(action);
      },
      matcher: isAnyOf(
        createAction('@INIT'),
        ...Object.values(link.actions as Record<string, Action>)
      )
    });
  }
}
