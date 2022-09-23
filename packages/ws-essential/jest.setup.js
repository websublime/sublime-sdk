const localStorageMock = (function () {
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
      store[key] = value.toString();
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
