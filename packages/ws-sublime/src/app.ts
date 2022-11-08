/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { createPluginID, useSublime } from './index';

// Augmenting example
declare module './types' {
  interface SublimeContext {
    dummy?: string;
  }
}

function app() {
  const sublime = useSublime();

  sublime.plugin(createPluginID('DUMMY'), {
    install() {
      this.onChange((changes) => {
        console.info('Plugin internal', changes);
      });

      this.dummy = 'Hello World';
    }
  });

  sublime.set('environment', {
    api: 'localhost',
    env: 'dev',
    origin: 'http://www.localhost.com'
  });

  console.info(sublime.dummy);
}

app();
