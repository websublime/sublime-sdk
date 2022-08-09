import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import { EssentialLink } from './link';
import { setOptions } from './redux';
import { EssentialSymbol } from './types';

export class EssentialStore {
  /**
   * Redux and store options.
   *
   * @private
   */
  private options: Partial<ConfigureStoreOptions>;

  private links = new WeakMap<EssentialSymbol, unknown>();

  constructor(options: Partial<ConfigureStoreOptions>) {
    this.options = setOptions(options);
  }

  addLink<Link extends EssentialLink>(link: Link) {
    this.links.set(link.symbol, link);
  }
}
