/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import {
  AnyAction,
  ConfigureStoreOptions,
  Reducer,
  Store,
  combineReducers,
  configureStore,
  createListenerMiddleware,
  createReducer,
  nanoid
} from '@reduxjs/toolkit';

// eslint-disable-next-line prettier/prettier
import type { EssentialLink } from './link';
import type { Class, LinkEntries, SymbolID } from './types';

/**
 * Essential store is the redux context
 * @public
 */
export class EssentialStore {
  /**
   * Redux store
   * @internal
   */
  private store: Store;

  /**
   * Links registry
   * @internal
   */
  private links = new WeakMap<SymbolID, LinkEntries<EssentialLink>>();

  /**
   * Links cache
   * @internal
   */
  private ids: Array<SymbolID> = [];

  /**
   * Redux middleware listener
   * @internal
   */
  private listenerMiddleware: ReturnType<typeof createListenerMiddleware>;

  constructor(options: Partial<ConfigureStoreOptions>) {
    const rootReducer = createReducer<Record<string, unknown>>(
      {},
      (builder) => {
        builder.addDefaultCase((state) => {
          return state;
        });
      }
    );

    this.listenerMiddleware = createListenerMiddleware();

    this.store = configureStore({
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false
        }).prepend(this.listenerMiddleware.middleware),
      reducer: rootReducer,
      ...options
    });
  }

  /**
   * Check if link is registered
   *
   * @public
   */
  public linkExists(linkID: SymbolID): boolean {
    return this.links.has(linkID);
  }

  /**
   * Add links to registry and patch dispatch
   * from redux store.
   * @public
   */
  public async addLink<Link extends EssentialLink>(
    link: InstanceType<Class<Link>>
  ) {
    const { dispatch } = this.store;

    Object.defineProperty(link, 'dispatch', {
      value: dispatch,
      writable: false
    });

    await link.initialize();

    const linkReducer = { [link.namespace.key.toString()]: link.reducer };
    const cachedEntries = this.getLinkReducers();

    this.store.replaceReducer(
      combineReducers({ ...cachedEntries, ...linkReducer })
    );

    this.addListener(link);

    this.links.set(link.namespace, {
      link,
      listeners: []
    });

    this.ids.push(link.namespace);
  }

  /**
   * Get Link api dispatchers to trigger.
   * @public
   */
  public getDispatchers<Dispatchers>(linkID: SymbolID): Dispatchers {
    const entry = this.links.get(linkID) as LinkEntries<EssentialLink>;
    return entry.link.dispatchers as Dispatchers;
  }

  /**
   * Subscribe to slice changes.
   * @public
   */
  public subscribe(
    linkID: SymbolID,
    callback: (state: any, action: AnyAction) => void,
    priority = 1
  ) {
    const { listeners } = this.links.get(linkID) as LinkEntries<EssentialLink>;
    const id = nanoid();

    listeners.push({ callback, id, once: false, priority });

    return () => this.removeListener(linkID, id);
  }

  /**
   * Subscribe only once to slice changes.
   * @public
   */
  public async once(
    linkID: SymbolID,
    callback: (state: any, action: AnyAction) => void,
    priority = 1
  ) {
    const { listeners } = this.links.get(linkID) as LinkEntries<EssentialLink>;
    const id = nanoid();

    listeners.push({ callback, id, once: true, priority });
  }

  /**
   * Add callback to redux middleware
   * @internal
   */
  private addListener<Link extends EssentialLink>(
    link: InstanceType<Class<Link>>
  ) {
    this.listenerMiddleware.startListening({
      effect: async (action, listenerApi) => {
        const { listeners } = this.links.get(link.namespace) || {};
        const stateName: string = link.namespace.key.toString();
        const { [stateName]: state } = listenerApi.getState() as any;

        if (link.onChange) {
          const { [stateName]: oldState } =
            listenerApi.getOriginalState() as any;

          await link.onChange(oldState, state, action);
        }

        const callbacks = listeners
          ?.sort((before, after) => after.priority - before.priority)
          // eslint-disable-next-line unicorn/no-array-reduce
          .reduce(
            (accumulator, item) => [...accumulator, item.callback],
            [] as Array<(state: unknown, action: AnyAction) => void>
          );

        if (callbacks) {
          for (const callback of callbacks) {
            callback(state, action);
          }
        }

        this.removeListener(link.namespace);
      },
      predicate: (action, _currentState: unknown) => {
        const actions = Object.entries(link.actions);

        return actions.some(([_key, item]) => item.type === action.type);
      }
    });
  }

  /**
   * Get cached/registered links
   * @internal
   */
  private getLinkReducers(): Record<string, Reducer> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return this.ids.reduce((accumulator, id) => {
      const entry = this.links.get(id) as LinkEntries<EssentialLink>;

      return {
        ...accumulator,
        [entry.link.namespace.key.toString()]: entry.link.reducer
      };
    }, {});
  }

  /**
   * Remove listerners/callbacks
   * @internal
   */
  private removeListener(linkID: SymbolID, id?: string) {
    const linkEntries = this.links.get(linkID);
    //@TODO: remove ids from cache
    if (linkEntries) {
      linkEntries.listeners = id
        ? linkEntries.listeners.filter((listener) => listener.id !== id)
        : linkEntries.listeners.filter((listener) => listener.once === false);

      this.links.set(linkID, linkEntries);
    }
  }
}
