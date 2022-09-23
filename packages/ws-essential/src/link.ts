/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { AnyAction, Slice, createSlice } from '@reduxjs/toolkit';

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

  /**
   * Define public actions
   * @internal
   */
  protected abstract definedActions(): Record<string, ReducerFunction>;

  /**
   * Lifecycle hook on creating new instance
   * @internal
   */
  protected bootstrap?(): void;

  /**
   * Slice descriptor properties
   * @internal
   */
  protected sliceProps = new WeakMap<SymbolID, Slice<State>>();

  /**
   * Public dispatchers
   * @readonly
   */
  get dispatchers() {
    const dispatchers = {};

    for (const [key, property] of Object.entries(this.actions)) {
      dispatchers[key] = (payload?: any) =>
        this.dispatch(property.call(property, payload));
    }

    return dispatchers;
  }

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

    if (this.bootstrap) {
      this.bootstrap();
    }
  }

  public async initialize() {
    await this.initSlice();
  }

  /**
   * Hook on any sate change
   */
  public change?(oldState: State, newState: State, action: AnyAction): void;

  /**
   * Dispatch actions
   * @internal
   */
  protected dispatch(_action?: AnyAction) {
    console.error('Class must be registered thru EssentialLink store');
  }

  /**
   * Creates and initialize state slice
   * @internal
   */
  protected async initSlice() {
    const { initialState, namespace, sliceProps } = this;
    const reducers = this.definedActions();

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
