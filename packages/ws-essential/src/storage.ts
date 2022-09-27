/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { AnyAction, createSlice } from '@reduxjs/toolkit';
import { Storage, createStorage } from 'unstorage';
import localStorageDriver from 'unstorage/drivers/localstorage';
import memoryDriver from 'unstorage/drivers/memory';

import { EssentialLink } from './link';
import {
  AnyState,
  Essential,
  EssentialStorage,
  EssentialStorageType
} from './types';

export abstract class EssentialLinkStorage<State extends AnyState = any>
  extends EssentialLink<State>
  implements Essential<State>
{
  abstract readonly storage: EssentialStorageType;

  private persistence!: Storage;

  get storageName() {
    return `ws:${this.namespace.key.description}`;
  }

  public async onChange(
    _oldState: State,
    newState: State,
    _action: AnyAction
  ): Promise<void> {
    return await this.persistence.setItem(this.storageName, newState as any);
  }

  protected setupDriver() {
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

  protected onCreate(): void {
    this.setupDriver();
  }

  /**
   * Creates and initialize state slice
   * @internal
   */
  protected async initSlice() {
    const persistedState = (await this.persistence.getItem(
      this.storageName
    )) as State;

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
      reducers
    });

    sliceProps.set(namespace, slice);
  }
}
