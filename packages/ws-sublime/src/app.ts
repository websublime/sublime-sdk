/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */
import { useSublime, createPluginID } from './index';

// Augmenting example
declare module './types' {
  interface SublimeContext {
    dummy?: string;
  }
}

function app() {
  const sublime = useSublime();

  sublime.use(createPluginID('DUMMY'), {
    install() {
      this.onChange((changes) => {
        console.log('Plugin internal', changes);
      });

      this.dummy = 'Hello World';
    }
  });

  sublime.set('environment', {
    env: 'dev',
    api: 'localhost',
    origin: 'http://www.localhost.com'
  });

  console.dir(sublime.dummy);
}

app();