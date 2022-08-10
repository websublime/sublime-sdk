import { AnyAction } from '@reduxjs/toolkit';

import { useRedux } from './redux';
import { SymbolID } from './types';

export abstract class EssentialLink<
  State = unknown,
  Actions = Record<string, unknown>
> {
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

  constructor(key: SymbolID) {
    this.namespace = key;
  }

  protected dispatch(action: AnyAction) {
    const { store } = useRedux();

    return store.dispatch(action);
  }
}
