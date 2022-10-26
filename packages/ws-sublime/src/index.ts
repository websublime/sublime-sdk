/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { PluginID, SublimeContext, Plugin, Change, ChangeArgs, AnyRecord } from './types';
import { version } from './version';

declare global {
  interface Window {
    Sublime: SublimeContext;
  }
}

const isWindow = () => typeof window !== 'undefined';
const ChangesID = {key: Symbol('CHANGES')};

//TODO: Poc for plugin
abstract class Plug implements Plugin {
  constructor() {
    return new Proxy(this, {
      get(target, propKey, receiver) {
        const targetValue = Reflect.get(target, propKey, receiver);

        //TODO: access to globalContext

        if (typeof targetValue === 'function') {
          return function(...args) {
            console.log('CALL', propKey, args);
            return targetValue.apply(target, args); //this
          }
        } else {
          return targetValue;
        }
      }
    });
  }

  abstract install<Option = AnyRecord>(options?: Option): void;
}

const globalContext = () => {
  const context = new Map();

  const plugins = new WeakMap();

  const listeners = new WeakMap([[ChangesID, [] as Array<Change>]])

  const emitChange = (args: ChangeArgs) => {
    const subscription = listeners.get(ChangesID);

    subscription?.forEach(fn => fn(args))
  };

  return {
    remove: (id: PluginID) => {
      const plugin = plugins.get(id);
      plugins.delete(id);
      emitChange({ property: id, value: plugin, action: 'remove' });
    },
    use: function (id: PluginID, plugin: Plugin, options = {}) {
      plugin.install.call(this, options); //Call or bind?
      
      plugins.set(id, plugin);
      
      emitChange({ property: id, value: plugin, action: 'use' });
    },
    get: (key: string) => {
      return context.get(key);
    },
    set: (key: string, value: unknown) => {
      context.set(key, value);
      
      emitChange({ property: key, value, action: 'set' });
    },
    has: (key: string) => {
      return context.has(key);
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

  return globalThis.Sublime;
};

if (isWindow()) {
  useSublime();
}

export { createPluginID, useSublime, Plug };