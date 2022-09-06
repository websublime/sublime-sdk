/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

/**
 * Check if is browser env
 *
 * @public
 */
export const isSsr = () => typeof window === 'undefined';
