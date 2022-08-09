import { AnyAction } from '@reduxjs/toolkit';

import { uniqueID } from './helpers';
import { useRedux } from './redux';
import { EssentialSymbol } from './types';

export abstract class EssentialLink {
  /**
   * Unique namespace to identify on state tree the
   * reducer state. Be aware that this should be unique string.
   *
   * @public
   */
  public namespace: symbol | string = Symbol(uniqueID());

  public symbol: EssentialSymbol;

  /**
   * Redux toolkit reference
   *
   * @private
   */
  private get redux() {
    return useRedux();
  }

  constructor(key?: symbol | string) {
    if (key) {
      this.namespace = key;
    }

    this.symbol = Object.seal({
      key: this.namespace.toString()
    });
  }

  protected dispatch(action: AnyAction) {
    const { store } = this.redux;

    return store.dispatch(action);
  }
}
