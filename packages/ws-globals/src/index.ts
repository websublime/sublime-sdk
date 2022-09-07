/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { useStore } from '@websublime/ws-essential';

import { RegistryLink, RegistryLinkID } from './registry';

declare global {
  interface Window {
    process: any;
  }
}

window.process = {
  env: {
    NODE_ENV: 'production'
  }
};

const initializeRegistry = () => {
  const store = useStore();

  store.addLink(new RegistryLink(RegistryLinkID));
};

initializeRegistry();

export { RegistryLinkID } from './registry';
