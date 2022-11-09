/* eslint-disable import/extensions */
/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { AnyAction, createSlice } from '@reduxjs/toolkit';
import { Storage, createStorage } from 'unstorage';
// import localStorageDriver from 'unstorage/drivers/localstorage';
// import memoryDriver from 'unstorage/drivers/memory';

import { EssentialLink } from './link';
import {
  AnyState,
  Essential,
  EssentialStorage,
  EssentialStorageType
} from './types';

async function drivers() {
  const localStorageDriver = await import(
    'https://cdn.skypack.dev/unstorage/drivers/localstorage'
  );
  const memoryDriver = await import(
    'https://cdn.skypack.dev/unstorage/drivers/memory'
  );

  return {
    localStorageDriver: localStorageDriver.default as (
      ...arguments_: any
    ) => any,
    memoryDriver: memoryDriver.default as (...arguments_: any) => any
  };
}

export abstract class EssentialLinkStorage<State extends AnyState = any>
  extends EssentialLink<State>
  implements Essential<State>
{
  /**
   * Define the type of persistence
   */
  abstract readonly storage: EssentialStorageType;

  /**
   * Storage driver
   */
  private persistence!: Storage;

  /**
   * Storage key name
   */
  get storageName() {
    return `ws:${this.namespace.key.description}`;
  }

  /**
   * Any change on links are persisted
   */
  public async onChange(
    _oldState: State,
    newState: State,
    _action: AnyAction
  ): Promise<void> {
    return await this.persistence.setItem(this.storageName, newState as any);
  }

  /**
   * Retrieve the actual persisted state
   */
  public async getPersistedState(): Promise<State> {
    return (await this.persistence.getItem(this.storageName)) as State;
  }

  /**
   * Defines the type of driver to use for
   * persisting data.
   */
  protected async setupDriver() {
    const { localStorageDriver, memoryDriver } = await drivers();

    let driver: any;

    switch (this.storage) {
      case EssentialStorage.LOCAL: {
        driver = localStorageDriver();

        break;
      }
      case EssentialStorage.SESSION: {
        driver = localStorageDriver({
          localStorage: window.sessionStorage
        });

        break;
      }
      default: {
        driver = memoryDriver();
      }
    }

    this.persistence = createStorage({
      driver
    });
  }

  public async initialize() {
    await this.setupDriver();

    return this.initSlice();
  }

  /**
   * Creates and initialize state slice
   * @internal
   */
  protected async initSlice() {
    const persistedState = await this.getPersistedState();
    const actionInit = `@ACTION_INIT`;

    const { initialState, namespace, sliceProps } = this;
    const reducers = this.getReducers();

    const slice = createSlice({
      extraReducers: (builder) => {
        builder.addDefaultCase((state) => {
          return state;
        });
      },
      initialState: persistedState || initialState,
      name: namespace.key.description as string,
      reducers: {
        ...reducers,
        [actionInit]: (state) => state
      }
    });

    sliceProps.set(namespace, slice);
  }
}
