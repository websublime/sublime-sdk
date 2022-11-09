/* eslint-disable max-len */
import fs from 'node:fs';
import path from 'node:path';

const isBare = (value: string) => {
  if (value.startsWith('/') || value.startsWith('./') || value.startsWith('../') || value.slice(0, 7) === 'http://' || value.slice(0, 8) === 'https://') {
    return false;
  }
  return true;
};

const isString = (value: any) => typeof value === 'string';

const validate = (map: any, options: any) =>
  Object.keys(map.imports).map(key => {
    const value = map.imports[key];

    if (isBare(value)) {
      throw new Error(`Import specifier can NOT be mapped to a bare import statement. Import specifier "${key}" is being wrongly mapped to "${value}"`);
    }

    if (typeof options.external === 'function' && options.external(key)) {
      throw new Error('Import specifier must NOT be present in the Rollup external config. Please remove specifier from the Rollup external config.');
    }
       

    if (Array.isArray(options.external) && options.external.includes(key)) {
      throw new Error('Import specifier must NOT be present in the Rollup external config. Please remove specifier from the Rollup external config.');
    }

    return { key, value };
  }
);

const fileReader = (pathname = '', options = {}) =>
  new Promise((resolve, reject) => {
    const filepath = path.normalize(pathname);
    fs.promises
      .readFile(filepath)
      .then(file => {
        try {
          const object = JSON.parse(file as any);
          resolve(validate(object, options));
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });

export function rollupImportMapPlugin(importMaps = []) {
  const cache = new Map();
  const maps = Array.isArray(importMaps) ? importMaps : [importMaps];

  return {
    name: 'vite-plugin-import-map',
    config: (userConfig: Record<string, any>) => {
      const { alias = {} } = userConfig.resolve || {};
      const imports: Record<string, string> = {};

      maps.forEach((item: any) => {
        Object.entries<string>(item.imports).forEach(([key, value]) => {
          Object.defineProperty(imports, key, {
            value,
            enumerable: true
          });
        });
      });

      const modifiedConfig = {
        ...userConfig,
        resolve: {
          alias: {
            ...alias,
            ...imports
          }
        }
      };

      return modifiedConfig
    },
    async buildStart(options: any) {
      const mappings = maps.map(item => {
        if (isString(item)) {
          return fileReader(item, options);
        }
        return validate(item, options);
      });

      await Promise.all(mappings).then(items => {
        for (const item of items) {
          for (const object of item as any) {
            cache.set(object.key, object.value);
          }
        }
      });
    },

    resolveId(importee: string) {
      const url = cache.get(importee);
      if (url) {
        return {
          id: url,
          external: true
        };
      }
      return null;
    }
  };
}
