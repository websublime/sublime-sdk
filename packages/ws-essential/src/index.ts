/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { ConfigureStoreOptions } from '@reduxjs/toolkit';
import { createPluginID, useSublime } from '@websublime/ws-sublime';

import { EssentialStore } from './store';
import { version } from './version';

declare module '@websublime/ws-sublime' {
  interface EssentialStoreObject {
    store: EssentialStore;
    isStoreAvailable: () => boolean;
    version: string;
  }

  interface SublimeContext {
    essential: EssentialStoreObject;
  }
}

export const EssentialSublimePlugin = createPluginID('EssentialSublimePlugin');

/**
 * It shares the same instance (singleton) of our store.
 * @param storeOptions - Optional Redux ConfigureStoreOptions
 * @public
 */
export const useStore = (storeOptions: Partial<ConfigureStoreOptions> = {}) => {
  const context = useSublime();
  const isStoreAvailable = () => context.has(EssentialSublimePlugin);

  if (!context.essential) {
    const environment = process.env.NODE_ENV || 'production';

    const options = {
      devTools: environment !== 'production',
      ...storeOptions
    };

    context.plugin(EssentialSublimePlugin, {
      install() {
        this.essential = Object.seal({
          isStoreAvailable: isStoreAvailable,
          store: new EssentialStore(options),
          version
        });
      }
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
