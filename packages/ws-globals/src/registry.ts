/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { EssentialLink, PayloadAction } from '@websublime/ws-essential';

export const RegistryLinkID = { key: Symbol('registry') };

type RegistryLinkState = {
  [key: string]: {
    id: string;
  };
};

export type RegistryDispatchers = {
  add: (value: Record<string, { id: string }>) => void;
};

export class RegistryLink extends EssentialLink<RegistryLinkState> {
  get initialState() {
    return {};
  }

  protected definedActions() {
    return {
      add: this.add
    };
  }

  private add(
    state: RegistryLinkState,
    action: PayloadAction<Record<string, { id: string }>>
  ) {
    state = {
      ...state,
      ...action.payload
    };
  }
}
