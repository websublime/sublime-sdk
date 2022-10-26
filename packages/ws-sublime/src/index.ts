/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { PluginID, SublimeContext, Plugin } from "./types";
import { version } from './version';

declare global {
  interface Window {
    Sublime: SublimeContext; //TODO: to be typed
  }
}

const isWindow = () => typeof window !== 'undefined';

const globalContext = () => {
  const context = new Map();
  const plugins = new WeakMap();

  let emitChange = (..._args: any[]) => {};

  return {
    use: function (id: PluginID, plugin: Plugin, options = {}) {
      plugin.install.call(this, options); //Call or bind?

      plugins.set(id, plugin);
      
      emitChange({ property: id, value: plugin });
    },
    get: () => { },
    set: (key: string, value: unknown) => {
      context.set(key, value);
      //TODO: should call plugins behavior?
      emitChange({ property: key, value });
    },
    has: (key: string) => {
      return context.has(key);
    },
    onChange: (fn: (args: { property: string|PluginID, value: any }) => void) => {
      emitChange = fn;
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

export { createPluginID, useSublime };