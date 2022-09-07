/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { useStore } from '@websublime/ws-essential';

import {
  EnvironmentDispatchers,
  EnvironmentLink,
  EnvironmentLinkID
} from './environment';
import { RegistryLink, RegistryLinkID } from './registry';

declare global {
  interface Window {
    environment: {
      apiUrl: string;
      env: string;
    };
  }
}

const initializeRegistry = () => {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const { apiUrl, env = 'production' } = window.environment || {};

  const store = useStore({
    devTools: env !== 'production'
  });

  store.addLink(new EnvironmentLink(EnvironmentLinkID));
  store.addLink(new RegistryLink(RegistryLinkID));

  const { setApiUrl, setEnvironment } =
    store.getDispatchers<EnvironmentDispatchers>(EnvironmentLinkID);

  setApiUrl(apiUrl);
  setEnvironment(env);
};

initializeRegistry();

export { RegistryLinkID } from './registry';
