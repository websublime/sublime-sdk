# Sublime

Sublime context is and global api to add plugins and data to share across windows/contexts.

# Table of contents

- [Usage](#usage)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

# Usage

Sublime context offer a api to plugin objects and to add values to it.

```ts
export type AnyRecord = Record<string, any>;

export type PluginID = {
  key: symbol;
};

export type ChangeArgs = {
  property: string | PluginID;
  value: any;
  action: keyof SublimeContext;
};
export type Change = (arguments_: ChangeArgs) => void;

export interface Plugin {
  // TODO: describe this to have access to context and plugin
  install: <Opt = AnyRecord>(this: SublimeContext, options?: Opt) => void;
}

export interface SublimeContext {
  get: <T = any>(key: PluginID | string) => T;
  has: (key: PluginID | string) => boolean;
  onChange: (function_: (argument: ChangeArgs) => void) => void;
  plugin: (id: PluginID, plugin: Plugin, options?: AnyRecord) => void;
  remove: (id: PluginID | string) => void;
  set: <T = any>(key: string, value: T) => void;
  version: string;
}
```

Two functions are exported to use/create the global context and create pluginIDs to register on context:

```ts
Function: createPluginID(key: string): PluginID => ({ key: Symbol(key) });
Function: useSublime() => SublimeContext;
```

You can the add plugins or just set key/value to the context.

```ts
import { createPluginID, useSublime } from '@websublime/ws-sublime';

// Augmenting example
declare module './types' {
  interface SublimeContext {
    dummy?: string;
  }
}

const sublime = useSublime();

sublime.plugin(createPluginID('DUMMY'), {
  install() {
    this.onChange((changes) => {
      console.info('Plugin internal', changes);
    });

    this.dummy = 'Hello World';
  }
});

sublime.set('environment', {
  api: 'localhost',
  env: 'dev',
  origin: 'http://www.localhost.com'
});

console.info(sublime.dummy);
```


[(Back to top)](#table-of-contents)

# Installation

[(Back to top)](#table-of-contents)

**Mandatory dependencies: NodeJS >= 16 and Yarn**

# Contributing

[(Back to top)](#table-of-contents)

Your contributions are always welcome! Please have a look at the [contribution guidelines](CONTRIBUTING.md) first. :tada:

Create branch, work on it and before submit run:
  - git add .
  - git commit -m "feat: title" -m "Description"
  - git add .
  - git commit --amend
  - git push origin feat/... -f

# License

[(Back to top)](#table-of-contents)


The MIT License (MIT) 2022 - [websublime](https://github.com/websublime/). Please have a look at the [LICENSE.md](LICENSE.md) for more details.