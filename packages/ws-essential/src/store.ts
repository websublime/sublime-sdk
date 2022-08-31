/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import {
  AnyAction,
  ConfigureStoreOptions,
  Store,
  UnsubscribeListener,
  combineReducers,
  configureStore,
  createAction,
  createListenerMiddleware,
  createReducer,
  nanoid
} from '@reduxjs/toolkit';
import { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';

import { EssentialLink } from './link';
// import { setOptions, useRedux } from './redux';
import { Class, SymbolID } from './types';

type LinkEntries = {
  link: InstanceType<Class<EssentialLink>>;
  reducer: ReducerWithInitialState<any>;
  listeners: {
    callback: (state, action: AnyAction) => void;
    priority: number;
    once: boolean;
    id: string;
  }[];
  subscription: UnsubscribeListener;
};

export class EssentialStore {
  private links = new WeakMap<SymbolID, LinkEntries>();

  private ids: Array<SymbolID> = [];

  private store: Store;

  private listenerMiddleware: ReturnType<typeof createListenerMiddleware>;

  constructor(options: Partial<ConfigureStoreOptions>) {
    //setOptions(options);
    const rootReducer = createReducer<Record<string, unknown>>({}, builder => {
      builder.addDefaultCase(state => {
        return state;
      });
    });

    this.listenerMiddleware = createListenerMiddleware();

    this.store = configureStore({
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false
        }).prepend(this.listenerMiddleware.middleware),
      reducer: rootReducer,
      ...options
    });
  }

  public addLink<Link extends EssentialLink>(link: InstanceType<Class<Link>>) {
    if (!this.links.has(link.namespace)) {
      link.setStore(this.store);

      const reducers = link.getProperties();
      //const { store } = useRedux();

      const reducer = createReducer(link.initial, builder => {
        if (reducers) {
          for (const item of reducers) {
            builder.addCase(item.action, item.reducer);
          }
        }

        builder.addDefaultCase(state => state);
      });

      const linkReducer = { [link.namespace.key.toString()]: reducer };
      const cachedEntries = this.getLinkReducers();
      this.store.replaceReducer(
        combineReducers({ ...cachedEntries, ...linkReducer })
      );

      const subscription = this.initMiddleware(link);

      this.links.set(link.namespace, {
        link,
        listeners: [],
        reducer,
        subscription
      });

      this.ids.push(link.namespace);
    }
  }

  public getDispatchers<A = any>(linkID: SymbolID) {
    const { link } = this.links.get(linkID) || {};

    if (link) {
      const properties = link.getProperties();
      // eslint-disable-next-line unicorn/no-array-reduce
      return properties.reduce(
        (accumulator, item) => ({ ...accumulator, ...item.dispatcher }),
        {}
      ) as A;
    }

    throw new Error('Link not found');
  }

  public subscribe(
    linkID: SymbolID,
    callback: (state, action: AnyAction) => void,
    priority = 1
  ) {
    const { listeners } = this.links.get(linkID) || {};
    const id = nanoid();

    listeners?.push({ callback, id, once: false, priority });

    return () => this.removeListener(linkID, id);
  }

  private initMiddleware<Link extends EssentialLink>(
    link: InstanceType<Class<Link>>
  ) {
    //const { middleware } = useRedux();
    const properties = link.getProperties() || [];
    const actions = properties.map(property => property.action);

    actions.push(createAction(link.namespace.key.toString()));

    return this.listenerMiddleware.startListening({
      effect: async (action, listenerApi) => {
        const { listeners } = this.links.get(link.namespace) || {};
        const stateName: string = link.namespace.key.toString();
        const { [stateName]: state } = listenerApi.getState() as any;

        const callbacks = listeners
          ?.sort((before, after) => after.priority - before.priority)
          // eslint-disable-next-line unicorn/no-array-reduce
          .reduce(
            (accumulator, item) => [...accumulator, item.callback],
            [] as Array<(state, action: AnyAction) => void>
          );

        if (callbacks) {
          for (const callback of callbacks) {
            callback(state, action);
          }
        }

        this.removeListener(link.namespace);
      },
      predicate: (action, _currentState: unknown) => {
        return actions.some(item => item.type === action.type);
      }
    });
  }

  private getLinkReducers(): Record<string, ReducerWithInitialState<any>> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return this.ids.reduce((accumulator, item) => {
      const entry = this.links.get(item) as LinkEntries;

      return {
        ...accumulator,
        [entry.link.namespace.key.toString()]: entry?.reducer
      };
    }, {});
  }

  private removeListener(linkID: SymbolID, id?: string) {
    const linkEntries = this.links.get(linkID);

    if (linkEntries) {
      linkEntries.listeners = id
        ? linkEntries.listeners.filter(listener => listener.id !== id)
        : linkEntries.listeners.filter(listener => listener.once === false);

      this.links.set(linkID, linkEntries);
    }
  }
}
