/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
export type AnyRecord = Record<string, any>;

export type PluginID = {
  key: symbol;
};

export type ChangeArgs = { property: string|PluginID, value: any, action: keyof SublimeContext };
export type Change = (args: ChangeArgs) => void;

export interface Plugin {
  // TODO: describe this to have access to context and plugin
  install: <Opt = AnyRecord>(this: SublimeContext, options?: Opt) => void;
}

export interface SublimeContext {
  get: <T = any>(key: string) => T;
  set: <T = any>(key: string, value: T) => void;
  has: (key: string) => boolean;
  use: (id: PluginID, plugin: Plugin, options?: AnyRecord) => void;
  remove: (id: PluginID) => void;
  onChange: (fn: (arg: ChangeArgs) => void) => void;
  version: string;
};