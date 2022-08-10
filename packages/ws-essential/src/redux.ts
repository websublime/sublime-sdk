/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import {
  ConfigureStoreOptions,
  Store,
  configureStore,
  createListenerMiddleware,
  createReducer
} from '@reduxjs/toolkit';

type StoreProvider = {
  options: Partial<ConfigureStoreOptions>;
  redux: Store | undefined;
  listenerMiddleware: ReturnType<typeof createListenerMiddleware>;
};

const initConfigureStore = () => {
  const scope: StoreProvider = {
    listenerMiddleware: createListenerMiddleware(),
    options: {},
    redux: undefined
  };

  const rootReducer = createReducer<Record<string, unknown>>({}, builder => {
    builder.addDefaultCase(state => {
      return state;
    });
  });

  const provider = {
    setOptions(options: Partial<ConfigureStoreOptions>) {
      return (scope.options = { ...scope.options, ...options });
    },
    useRedux() {
      if (!scope.redux) {
        scope.redux = configureStore({
          middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
              serializableCheck: false
            }).prepend(scope.listenerMiddleware.middleware),
          reducer: rootReducer,
          ...scope.options
        });
      }

      return {
        middleware: scope.listenerMiddleware,
        options: scope.options,
        root: rootReducer,
        store: scope.redux
      };
    }
  };

  return Object.seal(provider);
};

export const { setOptions, useRedux } = initConfigureStore();

// export type RootState = ReturnType<typeof store.getState>
