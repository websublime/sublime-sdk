/* eslint-disable unicorn/no-array-reduce */
import {
  AnyAction,
  Draft,
  ListenerMiddlewareInstance,
  createAction,
  createReducer,
  isAnyOf
} from '@reduxjs/toolkit';
import { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';

import { useRedux } from './redux';
import { Action, SymbolID } from './types';

export abstract class EssentialLink<State = any, Actions = unknown> {
  /**
   * Initial is the default or initial state that should be applied
   * when creating link or to use it to restore/reset state to initial form
   *
   * @public
   */
  abstract readonly initial: State;

  abstract readonly actions: Actions;

  /**
   * Unique namespace to identify on state tree the
   * reducer state. Be aware that this should be unique string.
   *
   * @public
   */
  public namespace: SymbolID;

  private reducers = new WeakMap<
    SymbolID,
    Array<{
      action: Action;
      //reducer: (parameters: { state: State; payload: any }) => State;
      reducer: (state: State) => State | void;
    }>
  >();

  /**
   * Hook function to customize construct lifecycle
   *
   * @public
   */
  protected bootstrap?(): void;

  constructor(key: SymbolID) {
    this.namespace = key;
    this.reducers.set(this.namespace, []);

    if (this.bootstrap) {
      this.bootstrap();
    }
  }

  public getReducers() {
    return this.actions ? this.reducers.get(this.namespace) : [];
  }

  protected createAction<Action = undefined>(
    action: string,
    callback: (...arguments_: any[]) => (state: State) => State | void
  ) {
    const namespace = this.namespace.key.toString();
    const actionCall = createAction<Action>(`@${namespace}/${action}`);
    const reducers = this.reducers.get(this.namespace);
    const reducer = callback.call(this);

    const isPushed = reducers?.some(
      reducer => reducer.action.type === actionCall.type
    );

    if (reducers && !isPushed) {
      reducers.push({ action: actionCall, reducer });
    }

    return actionCall;
  }

  /*
  protected registerReducer(
    action: Action,
    reduce: (parameters: { state: State; payload: any }) => State
  ) {
    const reducers = this.reducers.get(this.namespace);

    if (reducers) {
      reducers.push({ action, reducer: reduce });
    }
  }

  protected createAction<Action = undefined>(action: string) {
    const namespace = this.namespace.key.toString();

    return createAction<Action>(`@${namespace}/${action}`);
  }

  protected createReducer(
    action: Action,
    reduce: (parameters: { state: Draft<State>; payload: any }) => State
  ) {
    const reducer = createReducer(this.initial, {
      [action.type]: (state, action) =>
        reduce({ payload: action.payload, state })
    });

    const defaultReducer = createReducer(this.initial, builder =>
      builder.addDefaultCase(state => state)
    );

    const reducers = this.reducers.get(this.namespace) as Array<{
      action: Action;
      reducer: ReducerWithInitialState<State>;
    }>;

    reducers.push(
      { action, reducer },
      {
        action: createAction(`@${this.namespace.key.toString()}/DEFAULT`),
        reducer: defaultReducer
      }
    );

    this.reducers.set(this.namespace, reducers);

    return reducer;
  }

  protected dispatch(action: AnyAction) {
    const { store } = useRedux();

    return store.dispatch(action);
  }

  private initMiddleware(listenerMiddleware: ListenerMiddlewareInstance) {
    const reducers = this.reducers.get(this.namespace) as Array<{
      action: Action;
      reducer: ReducerWithInitialState<State>;
    }>;

    const actions = reducers.reduce(
      (accumulator, item) => [...accumulator, item.action],
      [] as Array<Action>
    );

    listenerMiddleware.startListening({
      effect: async action => {
        // eslint-disable-next-line no-console
        console.dir(action);
      },
      matcher: isAnyOf(createAction('@INIT_REDUCER'), ...actions)
    });
  }*/
}
