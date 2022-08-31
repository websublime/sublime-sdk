/* eslint-disable unicorn/no-array-reduce */
import { AnyAction, Store, createAction } from '@reduxjs/toolkit';

//import { useRedux } from './redux';
import { Action, Dispatcher, Reducer, SymbolID } from './types';

/**
 * This class is to be extended to create new links that
 * can be added to the essential store.
 *
 * @public
 */
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

  /**
   * Properties metadata to create action, reducer and dispatcher.
   *
   * @private
   */
  private properties = new WeakMap<
    SymbolID,
    Array<{
      action: Action;
      reducer: Reducer<State>;
      dispatcher: Dispatcher;
    }>
  >();

  private store!: Store;

  /**
   * Hook function to customize construct lifecycle
   * and use it to create your actions map of reducers.
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

  /**
   * Get Link properties for current defined link.
   *
   * @public
   */
  public getProperties() {
    return this.properties.get(this.namespace) || [];
  }

  /**
   * Creates action based on namespace,
   * also creates a reducer based on the name of the callback
   *
   * @protected
   */
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

  public setStore(store: Store) {
    this.store = store;
  }

  /**
   * Dispatch the action on redux store.
   *
   * @protected
   */
  protected dispatch(action: AnyAction) {
    // const { store } = useRedux();

    this.store.dispatch(action);
  }
}
