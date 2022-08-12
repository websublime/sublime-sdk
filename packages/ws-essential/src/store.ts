import {
  AnyAction,
  ConfigureStoreOptions,
  UnsubscribeListener,
  combineReducers,
  createAction,
  createReducer,
  nanoid
} from '@reduxjs/toolkit';
import { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';

import { EssentialLink } from './link';
import { setOptions, useRedux } from './redux';
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

  constructor(options: Partial<ConfigureStoreOptions>) {
    setOptions(options);
  }

  public addLink<Link extends EssentialLink>(link: InstanceType<Class<Link>>) {
    if (!this.links.has(link.namespace)) {
      const reducers = link.getProperties();
      const { store } = useRedux();

      const reducer = createReducer(link.initial, builder => {
        if (reducers) {
          for (const item of reducers) {
            builder.addCase(item.action, item.reducer);
          }
        }

        builder.addDefaultCase(state => state);
      });

      const linkReducer = { [link.namespace.key.toString()]: reducer };
      store.replaceReducer(combineReducers(linkReducer));

      const subscription = this.initMiddleware(link);

      this.links.set(link.namespace, {
        link,
        listeners: [],
        reducer,
        subscription
      });
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
    const { middleware } = useRedux();
    const properties = link.getProperties() || [];
    const actions = properties.map(property => property.action);

    actions.push(createAction(link.namespace.key.toString()));

    return middleware.startListening({
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

  private removeListener(linkID: SymbolID, id?: string) {
    const linkEntries = this.links.get(linkID);

    if (linkEntries) {
      linkEntries.listeners = id
        ? linkEntries.listeners.filter(listener => listener.id === id)
        : linkEntries.listeners.filter(listener => listener.once === false);

      this.links.set(linkID, linkEntries);
    }
  }
}
