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

type Environment = {
  apiUrl: string;
  env: string;
};

declare global {
  var environment: Environment;
}

const initializeEnvironment = async (environment: Environment) => {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const { apiUrl, env = 'production' } = {
    ...global.environment,
    ...environment
  };

  const store = useStore({
    devTools: env !== 'production'
  });

  await store.addLink(new EnvironmentLink(EnvironmentLinkID));

  const { setApiUrl, setEnvironment } =
    store.getDispatchers<EnvironmentDispatchers>(EnvironmentLinkID);

  setApiUrl(apiUrl);
  setEnvironment(env);
};

const initializeRegistry = async () => {
  const store = useStore();

  store.addLink(new RegistryLink(RegistryLinkID));
};

export const bootGlobals = async (
  environment: Environment = {} as Environment
) => {
  return initializeEnvironment(environment).then(() => initializeRegistry());
};

export { RegistryLinkID } from './registry';
export { EnvironmentLinkID } from './environment';

export type { RegistryDispatchers } from './registry';
export type { EnvironmentDispatchers } from './environment';
