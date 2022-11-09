/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-import-module-exports */
import path from 'node:path';

import replace from '@rollup/plugin-replace';
import { rollupImportMapPlugin } from '@websublime/import-map';
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
      external: [],
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
    }),
    rollupImportMapPlugin({
      imports: {
        '@websublime/ws-essential':
        'https://cdn.websublime.dev/g/@websublime/ws-essential@0.6.0-SNAPSHOT-8a1a9be/dist/ws-essential.es.js',
        '@websublime/ws-sublime':
          'https://cdn.websublime.dev/g/@websublime/ws-sublime@0.1.1/dist/ws-sublime.es.js'
      }
    })
  ]
});
