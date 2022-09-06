# Essential

<p align="center">
  <img style="display: inline; margin: 0 6px" alt="GitHub issues" src="https://img.shields.io/github/issues/websublime/sublime-sdk?style=flat-square">
  <img style="display: inline; margin: 0 6px" alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/websublime/sublime-sdk?style=flat-square">
  <img style="display: inline; margin: 0 6px" alt="GitHub" src="https://img.shields.io/github/license/websublime/sublime-sdk?style=flat-square">
  <img style="display: inline; margin: 0 6px" alt="PRS" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square">
  <img style="display: inline; margin: 0 6px" alt="CI" src="https://github.com/websublime/sublime-sdk/actions/workflows/release.yml/badge.svg?branch=main">
</p>

<p align="center">
  <img style="display: inline; margin: 0 6px" alt="OSS" src="https://forthebadge.com/images/badges/open-source.svg">
</p>

Essential is a redux toolkit for window or node. Essential as a diferent approach to use redux, the concept is OOP. 

# Table of contents

- [Usage](#usage)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

# Usage

The concept is to create a "Link" that will operate your redux actions/reducers. Every entry on the root state is connected to this link and the link instance is the responsable to produce changes on that slice state. Let's go by example. Let's took an example of publish messages. Let's create the Link first:

```
import { PayloadAction, EssentialLink } from '@websublime/ws-essential';

const BarLinkID = { key: Symbol('NAMESPACE-MESSAGES') };

type BarState = { message: string };
type BarDispatchers = {
  publish: (payload: string) => void;
};

class BarLink extends EssentialLink<BarState> {
  get initialState() {
    return { message: '' };
  }

  protected definedActions() {
    return {
      publish: this.publish
    };
  }

  private publish(state: BarState, action: PayloadAction<string>) {
    state.message = action.payload;
  }
}
```

Every link should have a unique and singleton id as seen on ```BarLinkID```, this will be used to identify your link, also your entry on root state redux. Also we type the state of our link and the dispatchers that will be public available. The ```get initialState()``` getter defines your initail/default state. Mutations to state are only allowed inside the reducer. The ```definedActions``` method is an hook where you should define your actions mapping the internal method that will be used as reducer/trigger. Like we see it on the above class, example:

```
protected definedActions() {
  return {
    publish: this.publish
  };
}

private publish(state: BarState, action) {
  state.message = action.payload;
}
```

It means, action ```publish``` will be created and the reducer ```this.publish``` will be used to change state. Also the typing ```<string>``` in action means that ```action.payload``` will be string type. Now our Link class is ready to be part of the store.

```
import { useStore, PayloadAction } from '@websublime/ws-essential';

const store = useStore();

store.addLink(new BarLink(BarLinkID));

store.subscribe(BarLinkID, (state: BarState, action: PayloadAction<string>) => {
  console.log(state.message);
});

const dispacther = store.getDispatchers<BarDispatchers>(BarLinkID);

dispacther.publish('Hello World');
```

The ```store``` is a empty redux store, ready to accept links on it. Add your new slice state to the store by adding a link like: ```store.addLink(new BarLink(BarLinkID))```, now you can subscribe to changes that happen on that namespace and also get the dispatchers to make changes on the namespace state.



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