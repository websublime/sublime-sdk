/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { PluginID, SublimeContext, Plugin, Change, ChangeArgs } from './types';
import { version } from './version';

declare global {
  interface Window {
    Sublime: SublimeContext;
  }

  var Sublime: SublimeContext;
}

const isWindow = () => typeof window !== 'undefined';
const ChangesID = {key: Symbol('CHANGES')};

const globalContext = () => {
  const context = new Map();

  const plugins = new WeakMap();

  const listeners = new WeakMap([[ChangesID, [] as Array<Change>]])

  const emitChange = (args: ChangeArgs) => {
    const subscription = listeners.get(ChangesID);

    subscription?.forEach(fn => fn(args))
  };

  return {
    use: function (id: PluginID, plugin: Plugin, options = {}) {
      const self = new Proxy(this, {
        get(target, propKey, receiver) {
          const targetValue = Reflect.get(target, propKey, receiver);
  
          if (typeof targetValue === 'function') {
            return function(...args) {
              return targetValue.apply(target, args);
            }
          } else {
            return targetValue;
          }
        },
        set(target, p, newValue, receiver) {
          emitChange({ property: p as string, value: newValue, action: 'set' });
          return Reflect.set(target, p, newValue, receiver);
        },
      });

      plugin.install.call(self, options);
      
      plugins.set(id, plugin);
      
      emitChange({ property: id, value: plugin, action: 'use' });
    },
    get: (key: PluginID|string) => {
      return typeof key === 'object' ? plugins.get(key) : context.get(key);
    },
    set: (key: string, value: unknown) => {
      context.set(key, value);
      
      emitChange({ property: key, value, action: 'set' });
    },
    has: (key: PluginID|string) => {
      return typeof key === 'object' ? plugins.has(key) : context.has(key);
    },
    remove: (id: PluginID|string) => {
      let result = false;

      if (typeof id === 'object') {
        result = plugins.delete(id);
      } else {
        result = context.delete(id);
      }
      
      emitChange({ property: id, value: result, action: 'remove' });
    },
    onChange: (fn: Change) => {
      const subscription = listeners.get(ChangesID);

      subscription?.push(fn);
    },
    version
  } as SublimeContext
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
export type { SublimeContext };