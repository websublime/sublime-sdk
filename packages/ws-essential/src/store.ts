/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import {
  ActionCreatorWithPayload,
  AnyAction,
  ConfigureStoreOptions,
  Reducer,
  Store,
  combineReducers,
  configureStore,
  createAction,
  createListenerMiddleware,
  createReducer,
  nanoid
} from '@reduxjs/toolkit';

import { executeGenerator } from './helpers';
import type { EssentialLink } from './link';
import type {
  Class,
  LinkEntries,
  LinkPipes,
  LinkSubscriptions,
  LinkUnsubscribe,
  SymbolID
} from './types';

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

  private subscriptions = new WeakMap<SymbolID, LinkSubscriptions>();

  private pipes = new WeakMap<SymbolID, LinkPipes>();

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

    // this.store.subscribe(() => {});
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
   * from redux store. Having emit parameter true
   * the namespace/init action will be trigger.
   * @public
   */
  public async addLink<Link extends EssentialLink>(
    link: InstanceType<Class<Link>>,
    emit = false
  ) {
    if (this.links.has(link.namespace)) {
      // eslint-disable-next-line no-console
      return console.warn('Link already registered');
    }

    const { dispatch } = this.store;

    Reflect.defineProperty(link, 'dispatch', {
      get() {
        return function <Payload = any>(
          action: ActionCreatorWithPayload<Payload, string>,
          payload: Payload
        ) {
          dispatch(action(payload));
        };
      }
    });

    await link.initialize();

    const linkReducer = {
      [link.namespace.key.description as string]: link.reducer
    };
    const cachedEntries = this.getLinkReducers();

    this.store.replaceReducer(
      combineReducers({ ...cachedEntries, ...linkReducer })
    );

    this.addListener(link);

    if (emit) {
      dispatch(createAction(`${link.namespace.key.description}/@ACTION_INIT`));
    }

    this.links.set(link.namespace, {
      link
    });

    this.ids.push(link.namespace);
  }

  /**
   * Get Link api dispatchers to trigger.
   * @public
   */
  public getDispatchers<Dispatchers>(linkID: SymbolID): Dispatchers {
    const entry = this.links.get(linkID) as LinkEntries<EssentialLink>;
    return entry.link.getDispatchers() as Dispatchers;
  }

  /**
   * Subscribe to slice changes.
   * @public
   */
  public subscribe(
    linkID: SymbolID,
    callback: (state: any, action: AnyAction) => void,
    priority = 1
  ): LinkUnsubscribe {
    if (!this.subscriptions.has(linkID)) {
      this.subscriptions.set(linkID, []);
    }

    const subscription = this.subscriptions.get(linkID) as LinkSubscriptions;
    const id = nanoid();

    subscription.push({ callback, id, once: false, priority });

    return () => this.removeListener(linkID, id);
  }

  // TODO: change to same signature as subscription (arrays)
  public pipe(
    linkID: SymbolID,
    callback: (results: Record<string, any>) => void
  ) {
    const { link } = this.links.get(linkID) as LinkEntries<EssentialLink>;

    if (link.getSelectors) {
      this.pipes.set(link.namespace, {
        callback,
        ...link.getSelectors()
      });
    }
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
    if (!this.subscriptions.has(linkID)) {
      this.subscriptions.set(linkID, []);
    }

    const subscription = this.subscriptions.get(linkID) as LinkSubscriptions;
    const id = nanoid();

    subscription.push({ callback, id, once: true, priority });
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
        debugger;
        const subscriptions = this.subscriptions.get(link.namespace) || [];
        const pipes = this.pipes.get(link.namespace);
        const stateName: string = link.namespace.key.description as string;
        const { [stateName]: state } = listenerApi.getState() as any;

        if (link.onChange) {
          const { [stateName]: oldState } =
            listenerApi.getOriginalState() as any;

          await link.onChange(oldState, state, action);
        }

        const callbacks = subscriptions
          ?.sort((before, after) => after.priority - before.priority)
          // eslint-disable-next-line unicorn/no-array-reduce
          .reduce(
            (accumulator, item) => [...accumulator, item.callback],
            [] as Array<(state: unknown, action: AnyAction) => void>
          );

        if (callbacks) {
          const executeSubscriptions = async () => {
            for (const subscriptionCallback of callbacks) {
              await Promise.resolve(subscriptionCallback(state, action));
            }
          };

          await executeSubscriptions();
        }

        if (pipes) {
          const { callback, ...rest } = pipes;

          const executePipe = async (accumulator: Record<string, any>) => {
            for (const [key, selector] of Object.entries(rest)) {
              const { value } = await executeGenerator(selector, state).next();
              accumulator[key] = value;
            }

            return accumulator;
          };

          const results = await executePipe({});

          callback(results);
        }

        this.removeListener(link.namespace);
      },
      predicate: (action, _currentState: unknown) => {
        return link.hasActionType(action.type);
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
        [entry.link.namespace.key.description as string]: entry.link.reducer
      };
    }, {});
  }

  /**
   * Remove listerners/callbacks
   * @internal
   */
  private removeListener(linkID: SymbolID, id?: string) {
    const subscriptions = this.subscriptions.get(linkID);

    if (subscriptions) {
      const subs = id
        ? subscriptions.filter((listener) => listener.id !== id)
        : subscriptions.filter((listener) => listener.once === false);

      this.subscriptions.set(linkID, subs);
    }
  }
}
