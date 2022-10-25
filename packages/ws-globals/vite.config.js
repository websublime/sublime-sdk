/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-import-module-exports */
import path from 'node:path';

import replace from '@rollup/plugin-replace';
//import { workspacesAlias } from '@websublime/vite';
import postcss from 'rollup-plugin-postcss';
import { defineConfig } from 'vite';

import { version } from './package.json';

module.exports = defineConfig({
  esbuild: {
    minifyIdentifiers: false,
    minifyWhitespace: true,
    minifySyntax: true
  },
  define: {
    Version: JSON.stringify(version),
    global: 'globalThis'
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `ws-globals.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
      name: 'ws-globals'
    },
    polyfillDynamicImport: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@websublime/ws-essential',
        'unstorage',
        'unstorage/drivers/localstorage',
        'unstorage/drivers/memory'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {}
      }
    },
    sourcemap: true,
    target: 'modules'
  },
  css: {
    preprocessorOptions: {
      sass: {
        includePaths: ['node_modules']
      },
      scss: {
        includePaths: ['node_modules']
      }
    }
  },
  plugins: [
    replace({
      'process.env.NODE_ENV':
        process.env.NODE_ENV === 'production'
          ? JSON.stringify('production')
          : JSON.stringify('development')
    }),
    postcss({
      inject: false
    })
    //workspacesAlias(['../../'], ['vite', '@websublime/ws-essential'])
  ],
  resolve: {
    alias: {
      '@reduxjs/toolkit':
        'https://esm.sh/v96/@reduxjs/toolkit@1.8.5/es2022/toolkit.js',
      unstorage: 'https://esm.sh/v94/unstorage@0.5.6/es2022/unstorage.js',
      '@websublime/ws-essential': 'https://cdn.websublime.dev/g/@websublime/ws-essential@0.4.1/dist/ws-essential.es.js'
    }
  },
});
