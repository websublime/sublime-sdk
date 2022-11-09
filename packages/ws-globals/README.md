# Globals

Globals create and initiate essential redux, register environement on store and creates a registry for packages/components.

# Table of contents

- [Usage](#usage)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

# Usage

Two main entries are added to the essential store: Environment and Registry. The links IDS are:

```
Environment: EnvironmentLinkID
Registry: RegistryLinkID
```

They are export on package to be consumed as npm if you need to subscribe. Environment is initiated on global scope (Sublime) for the entries:

```ts
type Environment = {
  apiUrl: string;
  env: string;
};
```

Globals are intiated calling the function:

```ts
import { bootGlobals } from '@websublime/ws-globals';

bootGlobals({
  apiUrl: 'http://localhost',
  env: import.meta.env.MODE
  // or any new things you want on the environment link and sublime context
});
```

Provide this values if you want or defaults will be used.


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