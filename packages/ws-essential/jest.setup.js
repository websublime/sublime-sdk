global.window = Object.create(window);

const storageMock = (function () {
  const store = {};

  return {
    clear: function () {
      store = {};
    },
    getItem: function (key) {
      return store[key];
    },
    removeItem: function (key) {
      delete store[key];
    },
    setItem: function (key, value) {
      store[key] = JSON.stringify(value);
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: storageMock });
Object.defineProperty(window, 'sessionStorage', { value: storageMock });
