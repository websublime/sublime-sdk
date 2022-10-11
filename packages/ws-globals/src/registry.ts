/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import {
  EssentialLink,
  PayloadAction,
  createSymbolID
} from '@websublime/ws-essential';

/**
 * Registry link ID
 * @public
 */
export const RegistryLinkID = createSymbolID('REGISTRY');

type RegistryLinkState = {
  [key: string]: {
    id: string;
  };
};

const SET_REGISTRY = 'SET_REGISTRY';

/**
 * Registry dispatchers
 * @public
 */
export type RegistryDispatchers = {
  add: (value: Record<string, { id: string }>) => void;
};

export class RegistryLink extends EssentialLink<RegistryLinkState> {
  get initialState() {
    return {};
  }

  getDispatchers() {
    return {
      add: (value: Record<string, { id: string }>) => {
        this.dispatch(this.getActionType(SET_REGISTRY), value);
      }
    };
  }

  protected getReducers() {
    return {
      [SET_REGISTRY]: (
        state: RegistryLinkState,
        action: PayloadAction<Record<string, { id: string }>>
      ) => {
        state = {
          ...state,
          ...action.payload
        };
        return state;
      }
    };
  }
}
