import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import { EssentialLink } from './link';
import { setOptions } from './redux';
import { Abstract, Class, SymbolID } from './types';

export class EssentialStore {
  /**
   * Redux and store options.
   *
   * @private
   */
  private options: Partial<ConfigureStoreOptions>;

  private links = new WeakMap<
    SymbolID,
    InstanceType<Abstract<EssentialLink>>
  >();

  constructor(options: Partial<ConfigureStoreOptions>) {
    this.options = setOptions(options);
  }

  addLink<Link extends EssentialLink>(link: InstanceType<Class<Link>>) {
    this.links.set(link.namespace, link);
  }
}
