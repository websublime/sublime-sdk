/* eslint-disable unicorn/no-array-reduce */
import { AnyAction, createAction } from '@reduxjs/toolkit';

import { useRedux } from './redux';
import { Action, Dispatcher, Reducer, SymbolID } from './types';

export abstract class EssentialLink<State = any> {
  /**
   * Initial is the default or initial state that should be applied
   * when creating link or to use it to restore/reset state to initial form
   *
   * @public
   */
  abstract readonly initial: State;

  /**
   * Unique namespace to identify on state tree the
   * reducer state. Be aware that this should be unique string.
   *
   * @public
   */
  public namespace: SymbolID;

  private properties = new WeakMap<
    SymbolID,
    Array<{
      action: Action;
      reducer: Reducer<State>;
      dispatcher: Dispatcher;
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
    this.properties.set(this.namespace, []);

    if (this.bootstrap) {
      this.bootstrap();
    }
  }

  public getProperties() {
    return this.properties.get(this.namespace) || [];
  }

  protected createAction<A = undefined>(
    action: string,
    callback: (...arguments_: any[]) => Reducer<State>
  ) {
    const namespace = this.namespace.key.toString();
    const actionCall = createAction<A>(`@${namespace}/${action}`);
    const properties = this.properties.get(this.namespace);
    const reducer = callback.call(this);
    const dispatcher = (payload?: A) => this.dispatch(actionCall(payload));

    const isPushed = properties?.some(
      property => property.action.type === actionCall.type
    );

    if (properties && !isPushed) {
      properties.push({
        action: actionCall,
        dispatcher: { [callback.name]: dispatcher },
        reducer
      });
    }

    return dispatcher;
  }

  protected dispatch(action: AnyAction) {
    const { store } = useRedux();

    store.dispatch(action);
  }
}
