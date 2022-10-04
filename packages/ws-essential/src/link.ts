/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import {
  ActionCreatorWithPayload,
  //ActionCreatorWithoutPayload,
  AnyAction,
  Dispatch,
  Slice,
  createSlice
} from '@reduxjs/toolkit';

// eslint-disable-next-line prettier/prettier
import type { AnyState, Essential, ReducerFunction, SymbolID } from './types';

/**
 * Essential link is a link slice constructor to expose dispatcher on slice state
 * @public
 */
export abstract class EssentialLink<State extends AnyState = any>
  implements Essential<State>
{
  /**
   * Slice initial state
   * @public
   */
  abstract readonly initialState: State;

  /**
   * Slice namespace
   * @public
   */
  public namespace: SymbolID;

  /**
   * Public functions to mutate state
   * @public
   */
  public abstract getDispatchers(): Record<string, Function>;

  /**
   * Define public reducers
   * @internal
   */
  protected abstract getReducers(): Record<string, ReducerFunction>;

  /**
   * Lifecycle hook on creating new instance
   * @internal
   */
  protected onCreate?(): void;

  /**
   * Define selectors to use on pipe
   * @public
   */
  public getSelectors?(): Record<string, (state: State) => unknown>;

  /**
   * Slice descriptor properties
   * @internal
   */
  protected sliceProps = new WeakMap<SymbolID, Slice<State>>();

  /**
   * Reference to original store.dispatch
   * @public
   */
  private _dispatch!: Dispatch<AnyAction>;
  /*
  protected dispatch<Payload = any>(
    action:
      | ActionCreatorWithPayload<Payload, string>
      | ActionCreatorWithoutPayload,
    payload: Payload
  ): void {
    console.error(action, payload);
    throw new Error(
      'Dispatch is only available when class is added to the store'
    );
  }
  */

  /**
   * Public main reducer
   * @readonly
   * @internal
   */
  get reducer() {
    const properties = this.sliceProps.get(this.namespace) as Slice<State>;

    return properties.reducer;
  }

  constructor(key: SymbolID) {
    this.namespace = key;
  }

  /**
   * Create redux slice and call hook
   * @internal
   */
  public async initialize() {
    if (this.onCreate) {
      this.onCreate();
    }

    await this.initSlice();
  }

  /**
   * Hook on any slice state change
   * @public
   */
  public async onChange?(
    oldState: State,
    newState: State,
    action: AnyAction
  ): Promise<void>;

  /**
   * Verify if action key exists
   * @public
   */
  public hasActionType(key: string) {
    const hasNamespace = key.includes(this.namespace.key.description as string);
    const properties = this.sliceProps.get(this.namespace) as Slice<State>;
    const actionKey = hasNamespace
      ? key
      : `${this.namespace.key.description}/${key}`;

    return Object.entries(properties.actions).some(
      ([_key, property]) => property.type === actionKey
    );
  }

  /**
   * Get action reference for the reducer
   * @public
   */
  protected getActionType(key: string) {
    const id = `${this.namespace.key.description}/${key}`;
    const properties = this.sliceProps.get(this.namespace) as Slice<State>;

    const action = Object.entries(properties.actions).find(
      ([_key, property]) => property.type === id
    );

    if (!action) {
      throw new Error(`Action type: ${key} invalid.`);
    }

    const [_actionKey, actionType] = action;
    return actionType;
  }

  /**
   * Dispatch actions
   * @public
   */
  protected dispatch<Payload = any>(
    action: ActionCreatorWithPayload<Payload, string>,
    payload: Payload
  ) {
    this._dispatch(action(payload));
  }

  /**
   * Creates and initialize state slice
   * @internal
   */
  protected async initSlice() {
    const { initialState, namespace, sliceProps } = this;
    const reducers = this.getReducers();

    const slice = createSlice({
      extraReducers: (builder) => {
        builder.addDefaultCase((state) => {
          return state;
        });
      },
      initialState,
      name: namespace.key.description as string,
      reducers: {
        ...reducers,
        '@ACTION_INIT': (state) => state
      }
    });

    sliceProps.set(namespace, slice);
  }
}
