/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { useStore } from '@websublime/ws-essential';
import { useSublime } from '@websublime/ws-sublime';

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

const initializeEnvironment = async () => {
  const context = useSublime();

  const environment: Environment = context.has('environment')
    ? context.get('environment')
    : { apiUrl: 'http://localhost', env: 'production' };

  const store = useStore({
    devTools: environment.env !== 'production'
  });

  await store.addLink(new EnvironmentLink(EnvironmentLinkID));

  const { add } =
    store.getDispatchers<EnvironmentDispatchers>(EnvironmentLinkID);

  return add({ api: environment.apiUrl, env: environment.env });
};

const initializeRegistry = async () => {
  const store = useStore();

  return await store.addLink(new RegistryLink(RegistryLinkID));
};

export const bootGlobals = async (
  environment: Environment = {} as Environment
) => {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const { apiUrl = 'http://localhost', env = 'production' } = environment;
  const context = useSublime();

  context.set('environment', { apiUrl, env });

  return initializeEnvironment().then(() => initializeRegistry());
};

export { RegistryLinkID } from './registry';
export { EnvironmentLinkID } from './environment';

export type { RegistryDispatchers } from './registry';
export type { EnvironmentDispatchers } from './environment';
