# @websublime/ws-globals

## 0.4.0

### Minor Changes

- [#27](https://github.com/websublime/sublime-sdk/pull/27) [`16125ac`](https://github.com/websublime/sublime-sdk/commit/16125acc9b3a36e5668a403a76cd3df67171b2a1) Thanks [@miguelramos](https://github.com/miguelramos)! - Packages ws-essential and ws-globals will now use Sublime context as global entry point. Sublime context documented

### Patch Changes

- Updated dependencies [[`16125ac`](https://github.com/websublime/sublime-sdk/commit/16125acc9b3a36e5668a403a76cd3df67171b2a1)]:
  - @websublime/ws-essential@0.5.0
  - @websublime/ws-sublime@0.1.1

## 0.3.1

### Patch Changes

- [#25](https://github.com/websublime/sublime-sdk/pull/25) [`1671a3b`](https://github.com/websublime/sublime-sdk/commit/1671a3b689c6afbbcc89cf5d8ac7b02cecaa0d80) Thanks [@miguelramos](https://github.com/miguelramos)! - Sublime global context

  Instead of using window as reference for some shared features, was created a global close context under
  the name Sublime. So any setting or instance can now be shared thru the Sublime global API.

## 0.3.0

### Minor Changes

- [#10](https://github.com/websublime/sublime-sdk/pull/10) [`4865444`](https://github.com/websublime/sublime-sdk/commit/48654448043cda1586a21980ae390b1cdd2aed1f) Thanks [@miguelramos](https://github.com/miguelramos)! - Persistence link and asyn initializations

## 0.2.0

### Minor Changes

- [#5](https://github.com/websublime/sublime-sdk/pull/5) [`aa0ce9a`](https://github.com/websublime/sublime-sdk/commit/aa0ce9a3a533a3a23e76ad156ce615ffae9b249f) Thanks [@miguelramos](https://github.com/miguelramos)! - Globals

  Globals are two essential store links Environment and Registry. Environment to provide config/options and registry for particular components data.

## 0.1.0

### Minor Changes

- [#3](https://github.com/websublime/sublime-sdk/pull/3) [`4469fe9`](https://github.com/websublime/sublime-sdk/commit/4469fe94ae97a40105fb3e913e630a731876056f) Thanks [@miguelramos](https://github.com/miguelramos)! - Globals and links registry creation
