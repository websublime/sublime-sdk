# Essential

Essential is a redux toolkit for window or node. Essential as a diferent approach to use redux, the concept is OOP. 

# Table of contents

- [Usage](#usage)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

# Usage

The concept is to create a "Link" that will operate your redux actions/reducers. Every entry on the root state is connected to this link and the link instance is the responsable to produce changes on that slice state. Let's go by example. Let's took an example of publish messages. Let's create the Link first:

```
import { PayloadAction, EssentialLink, createSymbolID } from '@websublime/ws-essential';

const FooLinkID = createSymbolID('FOO-LINK');
const ACTION_DECREMENT = 'ACTION_DECREMENT';
const ACTION_INCREMENT = 'ACTION_INCREMENT';

type FooState = { count: number };

type FooDispatchers = {
  increment: (value: number) => void;
  decrement: (value: number) => void;
};

class FooLink extends EssentialLink {
  get initialState(): FooState {
    return {
      count: 0
    };
  }

  getDispatchers() {
    return {
      decrement: (value: number) => {
        this.dispatch<number>(this.getActionType(ACTION_DECREMENT), value);
      },
      increment: (value: number) => {
        this.dispatch<number>(this.getActionType(ACTION_INCREMENT), value);
      }
    };
  }

  protected getReducers() {
    return {
      [ACTION_DECREMENT]: (
        state: FooState,
        action: PayloadAction<number>
      ) => {
        state.count = state.count - action.payload;
      },
      [ACTION_INCREMENT]: (
        state: FooState,
        action: PayloadAction<number>
      ) => {
        state.count = state.count + action.payload;
      }
    };
  }
}
````

Every link should have a unique and singleton id as seen on ```FooLinkID```, this will be used to identify your link, also your entry on root state redux. Also we type the state of our link and the dispatchers that will be public available. The ```initialState()``` getter defines your initail/default state. Mutations to state are only allowed inside the reducer. The ```getReducers``` method is an hook where you should define your actions mapping the internal method that will be used as reducer/trigger. Like we see it on the above class, example:

```
getDispatchers() {
  return {
    decrement: (value: number) => {
      this.dispatch<number>(this.getActionType(ACTION_DECREMENT), value);
    },
    increment: (value: number) => {
      this.dispatch<number>(this.getActionType(ACTION_INCREMENT), value);
    }
  };
}

protected getReducers() {
  return {
    [ACTION_DECREMENT]: (
      state: FooState,
      action: PayloadAction<number>
    ) => {
      state.count = state.count - action.payload;
    },
    [ACTION_INCREMENT]: (
      state: FooState,
      action: PayloadAction<number>
    ) => {
      state.count = state.count + action.payload;
    }
  };
}
```

It means, dispatchers ```getDispatchers``` will be your public methods to the reducers ```getReducers``` will be used to change state. Also the typing ```<number>``` in dispatchers means that ```action.payload``` will be number type. Now our Link class is ready to be part of the store.

```
import { useStore, PayloadAction } from '@websublime/ws-essential';

const store = useStore();

store.addLink(new FooLink(FooLinkID));

store.subscribe(FooLinkID, (state: FooState, action: PayloadAction<number>) => {
  console.log(state.count);
});

const dispacther = store.getDispatchers<FooDispatchers>(FooLinkID);

dispacther.increment(5);
```

The ```store``` is a empty redux store, ready to accept links on it. Add your new slice state to the store by adding a link like: ```store.addLink(new FooLink(FooLinkID))```, now you can subscribe to changes that happen on that namespace and also get the dispatchers to make changes on the namespace state. Store ```store.addLink(new FooLink(FooLinkID), true)``` second argument is for emit initial action when added to the store, so you can have a subscription reacting on adding a new link to the store if needed.

If you need to persist your state, just use class `EssentialLinkStorage` as the extender class.

```
import { EssentialLinkStorage, EssentialStorage } from '@websublime/ws-essential';

const FooLinkID = createSymbolID('FOO-LINK');
const ACTION_DECREMENT = 'ACTION_DECREMENT';
const ACTION_INCREMENT = 'ACTION_INCREMENT';

type FooState = { count: number };
type FooDispatchers = {
  increment: (value: number) => void;
  decrement: (value: number) => void;
};

class FooLink extends EssentialLinkStorage {
  get initialState(): FooState {
    return {
      count: 0
    };
  }

  get storage() {
    return EssentialStorage.LOCAL;
  }

  getDispatchers() {
    return {
      decrement: (value: number) => {
        this.dispatch(this.getActionType(ACTION_DECREMENT), value);
      },
      increment: (value: number) => {
        this.dispatch(this.getActionType(ACTION_INCREMENT), value);
      }
      };
  }

  protected getReducers() {
    return {
      [ACTION_DECREMENT]: (
        state: FooState,
        action: PayloadAction<number>
      ) => {
        state.count = state.count - action.payload;
      },
      [ACTION_INCREMENT]: (
        state: FooState,
        action: PayloadAction<number>
      ) => {
        state.count = state.count + action.payload;
      }
    };
  }
}
```

Storage can be local(localStorage), session(sessionStorage) or memory(Object). State will be initialized with default persisted object if present in one of the storage.

You also have a ```pipe``` method that works on the same as subscribe, but the behavior is that you will need to have a public
selectors definition ```getSelectors```. The intention is you can delivery computed object for your state with the result of the selectors.

```
const FooLinkID = createSymbolID('FOO-LINK');
  const ACTION_DECREMENT = 'ACTION_DECREMENT';
  const ACTION_INCREMENT = 'ACTION_INCREMENT';

  type FooState = { count: number };
  type FooDispatchers = {
    increment: (value: number) => void;
    decrement: (value: number) => void;
  };
  type Result = {
    isPositive: boolean;
    isNegative: boolean;
    isNeutral: boolean;
  }

  class FooLink extends EssentialLink {
    get initialState(): FooState {
      return {
        count: 0
      };
    }

    getDispatchers() {
      return {
        decrement: (value: number) => {
          this.dispatch(this.getActionType(ACTION_DECREMENT), value);
        },
        increment: (value: number) => {
          this.dispatch(this.getActionType(ACTION_INCREMENT), value);
        }
      };
    }

    getSelectors() {
      return {
        isPositive: (state: FooState) => state.count > 0,
        isNegative: (state: FooState) => state.count < 0,
        isNeutral: async (state: FooState) => state.count === 0
      };
    }

    protected getReducers() {
      return {
        [ACTION_DECREMENT]: (
          state: FooState,
          action: PayloadAction<number>
        ) => {
          state.count = state.count - action.payload;
        },
        [ACTION_INCREMENT]: (
          state: FooState,
          action: PayloadAction<number>
        ) => {
          state.count = state.count + action.payload;
        }
      };
    }
  }

  const fooLink = new FooLink(FooLinkID);

  await store.addLink(fooLink, true);

  const { decrement, increment } =
    store.getDispatchers<FooDispatchers>(FooLinkID);

  store.pipe(FooLinkID, (results: Result) => {
    results.isNeutral;
  });

  increment(2);
  decrement(3);
  increment(1);
});
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