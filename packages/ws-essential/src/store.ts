import { ConfigureStoreOptions, createReducer } from '@reduxjs/toolkit';
import { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';

import { EssentialLink } from './link';
import { setOptions } from './redux';
import { Class, SymbolID } from './types';

type LinkEntries = {
  link: InstanceType<Class<EssentialLink>>;
  reducer: ReducerWithInitialState<any>;
};

export class EssentialStore {
  private links = new WeakMap<SymbolID, LinkEntries>();

  constructor(options: Partial<ConfigureStoreOptions>) {
    setOptions(options);
  }

  addLink<Link extends EssentialLink>(link: InstanceType<Class<Link>>) {
    if (!this.links.has(link.namespace)) {
      const reducers = link.getReducers();

      const reducer = createReducer(link.initial, builder => {
        if (reducers) {
          for (const item of reducers) {
            builder.addCase(item.action, item.reducer);
          }
        }

        builder.addDefaultCase(state => state);
      });

      this.links.set(link.namespace, { link, reducer });
    }
  }
}
