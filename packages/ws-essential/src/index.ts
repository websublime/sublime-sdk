/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import { isSsr } from './helpers';
import { EssentialStore } from './store';
import { version } from './version';

declare global {
  interface EssentialStoreObject {
    store: EssentialStore;
    isStoreAvailable: () => boolean;
    version: string;
  }

  interface Window {
    essential: EssentialStoreObject;
  }
}

const context: { essential: EssentialStoreObject } = isSsr()
  ? ({} as any)
  : window.top || window;

const isStoreAvailable = () => {
  return !!context.essential.store;
};

/**
 * It shares the same instance (singleton) of our store.
 * @param storeOptions - Optional Redux ConfigureStoreOptions
 * @public
 */
export const useStore = (storeOptions: Partial<ConfigureStoreOptions> = {}) => {
  if (!context.essential) {
    const options = {
      devTools: import.meta.env.DEV,
      ...storeOptions
    };

    context.essential = Object.seal({
      isStoreAvailable: isStoreAvailable,
      store: new EssentialStore(options),
      version
    });
  }

  return context.essential.store;
};

export { nanoid } from '@reduxjs/toolkit';
export { EssentialLink } from './link';
export { EssentialLinkStorage } from './storage';
export { EssentialStorage } from './types';
export { createSymbolID } from './helpers';
// eslint-disable-next-line prettier/prettier
export type { PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line prettier/prettier
export type { SymbolID, Essential, EssentialStorageType } from './types';
