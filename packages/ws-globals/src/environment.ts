/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { EssentialLink, PayloadAction } from '@websublime/ws-essential';

import { version } from './version';

/**
 * Environment link ID
 * @public
 */
export const EnvironmentLinkID = { key: Symbol('environment') };

type EnvironmentLinkState = {
  env: string;
  api: string | undefined;
  version: string;
};

/**
 * Environment dispatchers
 * @public
 */
export type EnvironmentDispatchers = {
  setApiUrl: (value: string) => void;
  setEnvironment: (value: string) => void;
  setOption: <AnyValue = Record<string, unknown>>(value: AnyValue) => void;
};

export class EnvironmentLink extends EssentialLink<EnvironmentLinkState> {
  get initialState() {
    return {
      api: undefined,
      env: 'production',
      version
    };
  }

  protected definedActions() {
    return {
      setApiUrl: this.setApiUrl,
      setEnvironment: this.setEnvironment,
      setOption: this.setOption
    };
  }

  private setEnvironment(
    state: EnvironmentLinkState,
    action: PayloadAction<string>
  ) {
    state.env = action.payload;
  }

  private setApiUrl(
    state: EnvironmentLinkState,
    action: PayloadAction<string>
  ) {
    state.api = action.payload;
  }

  private setOption(
    state: EnvironmentLinkState,
    payload: PayloadAction<Record<string, unknown>>
  ) {
    state = {
      ...state,
      ...payload
    };
  }
}
