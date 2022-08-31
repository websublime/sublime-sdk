/* eslint-disable prettier/prettier */
/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { isSsr } from './helpers';
import { useStore, } from './main';

export { EssentialLink } from './link';
export type { Environment, SymbolID } from './types';
export { nanoid } from '@reduxjs/toolkit';
export type { AnyAction } from '@reduxjs/toolkit';

if (!isSsr()) {
  const environment = process.env.NODE_ENV || 'production';
  useStore({
    devTools: environment !== 'production'
  });
}

export { useStore } from './main';
