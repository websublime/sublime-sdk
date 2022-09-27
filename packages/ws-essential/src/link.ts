/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import {
  ActionCreatorWithPayload,
  AnyAction,
  Dispatch,
  Slice,
  createSlice
} from '@reduxjs/toolkit';

// eslint-disable-next-line prettier/prettier
import type { AnyState, Essential, ReducerFunction, SymbolID } from './types';

/**
 * Essential link is a link slcie constructor to expose dispatcher on slice state
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
   * Slice descriptor properties
   * @internal
   */
  protected sliceProps = new WeakMap<SymbolID, Slice<State>>();

  private _dispatch!: Dispatch<AnyAction>;

  /**
   * Public main reducer
   * @readonly
   */
  get reducer() {
    const properties = this.sliceProps.get(this.namespace) as Slice<State>;

    return properties.reducer;
  }

  /**
   * Public actions
   * @readonly
   */
  get actions() {
    const properties = this.sliceProps.get(this.namespace) as Slice<State>;

    return properties.actions;
  }

  constructor(key: SymbolID) {
    this.namespace = key;

    if (this.onCreate) {
      this.onCreate();
    }
  }

  public async initialize() {
    await this.initSlice();
  }

  /**
   * Hook on any slice state change
   */
  public async onChange?(
    oldState: State,
    newState: State,
    action: AnyAction
  ): Promise<void>;

  protected getActionType(key: string) {
    const id = `${this.namespace.key.toString()}/${key}`;
    const properties = this.sliceProps.get(this.namespace) as Slice<State>;

    const action = Object.entries(properties.actions).find(
      ([_key, property]) => property.toString() === id
    );

    if (!action) {
      throw new Error(`Action type: ${key} invalid.`);
    }

    const [_actionKey, actionType] = action;
    return actionType;
  }

  /**
   * Dispatch actions
   * @internal
   */
  protected dispatch<Payload = any>(
    action: ActionCreatorWithPayload<any, string>,
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
      name: namespace.key.toString(),
      reducers
    });

    sliceProps.set(namespace, slice);
  }
}
