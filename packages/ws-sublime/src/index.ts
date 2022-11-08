/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import {
  Change,
  ChangeArgs as ChangeArguments,
  Plugin,
  PluginID,
  SublimeContext
} from './types';
import { version } from './version';

declare global {
  interface Window {
    Sublime: SublimeContext;
  }

  var Sublime: SublimeContext;
}

const isWindow = () => typeof window !== 'undefined';
const ChangesID = { key: Symbol('CHANGES') };

const globalContext = () => {
  const context = new Map();

  const plugins = new WeakMap();

  const listeners = new WeakMap([[ChangesID, [] as Array<Change>]]);

  const emitChange = (arguments_: ChangeArguments) => {
    const subscription = listeners.get(ChangesID);

    if (subscription)
      for (const function_ of subscription) function_(arguments_);
  };

  return {
    get: (key: PluginID | string) => {
      return typeof key === 'object' ? plugins.get(key) : context.get(key);
    },
    has: (key: PluginID | string) => {
      return typeof key === 'object' ? plugins.has(key) : context.has(key);
    },
    onChange: (function_: Change) => {
      const subscription = listeners.get(ChangesID);

      subscription?.push(function_);
    },
    plugin: function (id: PluginID, plugin: Plugin, options = {}) {
      const self = new Proxy(this, {
        get(target, propertyKey, receiver) {
          const targetValue = Reflect.get(target, propertyKey, receiver);

          return typeof targetValue === 'function'
            ? function (...arguments_) {
                return targetValue.apply(target, arguments_);
              }
            : targetValue;
        },
        // eslint-disable-next-line max-params
        set(target, p, newValue, receiver) {
          emitChange({ action: 'set', property: p as string, value: newValue });
          return Reflect.set(target, p, newValue, receiver);
        }
      });

      plugin.install.call(self, options);

      plugins.set(id, plugin);

      emitChange({ action: 'plugin', property: id, value: plugin });
    },
    remove: (id: PluginID | string) => {
      let result = false;

      result = typeof id === 'object' ? plugins.delete(id) : context.delete(id);

      emitChange({ action: 'remove', property: id, value: result });
    },
    set: (key: string, value: unknown) => {
      context.set(key, value);

      emitChange({ action: 'set', property: key, value });
    },
    version
  } as SublimeContext;
};

const createPluginID = (key: string): PluginID => ({ key: Symbol(key) });

const useSublime = (): SublimeContext => {
  if (!globalThis.Sublime) {
    globalThis.Sublime = globalContext();
  }

  globalThis.Sublime.set('isWindow', isWindow());

  return globalThis.Sublime;
};

export { createPluginID, useSublime };

export { type SublimeContext } from './types';
