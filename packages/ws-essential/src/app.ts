import { EssentialLink } from './link';
import { useStore } from './main';

document.addEventListener('readystatechange', function() {
  const state = document.readyState;

  if (state == 'interactive') {
    // eslint-disable-next-line no-console
    console.log('INTERATIVE');
  } else if (state == 'complete') {
    init();
  }
});

function init() {
  const store = useStore({
    devTools: true
  });

  const FooLinkID = { key: Symbol('FOO-NAMESPACE') };
  const BarLinkID = { key: Symbol('BAR-NAMESPACE') };

  type FooState = { count: number };
  type FooDispatchers = {
    increment: (payload: number) => void;
    decrement: (payload: number) => void;
  };

  type BarState = { message: string };
  type BarDispatchers = {
    publish: (payload: string) => void;
  };

  // FOOLINK
  class FooLink extends EssentialLink<FooState> {
    get initial() {
      return { count: 0 };
    }

    bootstrap() {
      this.createAction<number>('INCREMENT', this.increment);
      this.createAction<number>('DECREMENT', this.decrement);
    }

    private increment() {
      return (state: FooState, action) => {
        state.count = state.count + action.payload;
      };
    }

    private decrement() {
      return (state: FooState, action) => {
        state.count = state.count - action.payload;
      };
    }
  }

  // BARLINK
  class BarLink extends EssentialLink<BarState> {
    get initial() {
      return { message: '' };
    }

    bootstrap() {
      this.createAction<string>('PUBLISH', this.publish);
    }

    private publish() {
      return (state: BarState, action) => {
        state.message = action.payload;
      };
    }
  }

  store.addLink(new FooLink(FooLinkID));
  store.addLink(new BarLink(BarLinkID));

  const { decrement, increment } = store.getDispatchers<FooDispatchers>(
    FooLinkID
  );
  const { publish } = store.getDispatchers<BarDispatchers>(BarLinkID);

  store.subscribe(FooLinkID, state => {
    const element = document.querySelector('#example') as HTMLDivElement;

    element.innerHTML = `<span>${state.count}</span>`;
  });

  store.subscribe(BarLinkID, state => {
    const element = document.querySelector('#messages') as HTMLDivElement;
    const message = document.createElement('p');
    message.textContent = state.message;

    element.append(message);
  });

  const buttonIncrement = document.querySelector(
    '#increment'
  ) as HTMLButtonElement;
  const buttonDecrement = document.querySelector(
    '#decrement'
  ) as HTMLButtonElement;
  const buttonPublish = document.querySelector('#publish') as HTMLButtonElement;

  buttonIncrement.addEventListener('click', () => {
    increment(1);
  });

  buttonDecrement.addEventListener('click', () => {
    decrement(1);
  });

  buttonPublish.addEventListener('click', () => {
    const input = document.querySelector('#message') as HTMLInputElement;

    if (input.value?.length) {
      publish(input.value);
      input.value = '';
    }
  });
}
