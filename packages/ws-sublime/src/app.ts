import { useSublime, createPluginID } from './index';

/*
declare module 'app' {
    interface SublimeContext {
        dummy: string;
    }
}
*/

function app() {
  const sublime = useSublime();

  sublime.onChange((changes) => console.dir(changes));

  sublime.use(createPluginID('DUMMY'), {
    install() {
      this.dummy = 'Hello World';
    }
  });
}

app();