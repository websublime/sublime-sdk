export type PluginID = {
  key: symbol;
};

export interface Plugin {
  // TODO: describe this to have access to context and plugin
  install: (this: SublimeContext, options?: Record<string, any>) => void;
}

export type SublimeContext = {
  get: <T = any>(key: string) => T;
  set: <T = any>(key: string, value: T) => void;
  has: (key: string) => boolean;
  use: (id: PluginID, plugin: Plugin) => void;
  onChange: (fn: (arg: { property: string|PluginID, value: any }) => void) => void;
  version: string;
};