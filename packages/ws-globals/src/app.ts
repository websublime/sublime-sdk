import { bootGlobals } from './index';

bootGlobals({
  apiUrl: 'http://localhost',
  env: import.meta.env.MODE
});
