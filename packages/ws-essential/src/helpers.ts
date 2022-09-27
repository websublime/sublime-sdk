/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { SymbolID } from './types';

/**
 * Check if is browser env
 *
 * @public
 */
export const isSsr = () => typeof window === 'undefined';

/**
 * Create a unique symbol namespace
 *
 * @public
 */
export const createSymbolID = (key: string): SymbolID => ({ key: Symbol(key) });
