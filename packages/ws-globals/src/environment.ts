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

import { version } from './version';

/**
 * Environment link ID
 * @public
 */
export const EnvironmentLinkID = createSymbolID('ENVIRONMENT');

type EnvironmentLinkState = {
  env: string;
  api: string | undefined;
  version: string;
  [key: string]: unknown;
};

const SET_OPTION = 'SET_OPTION';
const RESET = 'RESET';

/**
 * Environment dispatchers
 * @public
 */
export type EnvironmentDispatchers = {
  add: <AnyValue = Record<string, unknown>>(value: AnyValue) => void;
  reset: () => void;
};

export class EnvironmentLink extends EssentialLink<EnvironmentLinkState> {
  get initialState() {
    return {
      api: undefined,
      env: 'production',
      version
    };
  }

  getDispatchers() {
    return {
      add: (value: Record<string, { id: string }>) => {
        this.dispatch(this.getActionType(SET_OPTION), value);
      },
      reset: () => {
        this.dispatch(this.getActionType(RESET), {});
      }
    };
  }

  protected getReducers() {
    return {
      [RESET]: (_state: EnvironmentLinkState, action: PayloadAction<any>) => {
        _state = action.payload;
      },
      [SET_OPTION]: (
        state: EnvironmentLinkState,
        action: PayloadAction<Record<string, any>>
      ) => {
        state = {
          ...state,
          ...action.payload
        };
      }
    };
  }
}
