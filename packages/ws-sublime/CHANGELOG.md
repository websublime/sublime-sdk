# @websublime/ws-sublime

## 0.1.0

### Minor Changes

- [#25](https://github.com/websublime/sublime-sdk/pull/25) [`1671a3b`](https://github.com/websublime/sublime-sdk/commit/1671a3b689c6afbbcc89cf5d8ac7b02cecaa0d80) Thanks [@miguelramos](https://github.com/miguelramos)! - Sublime global context

  Instead of using window as reference for some shared features, was created a global close context under
  the name Sublime. So any setting or instance can now be shared thru the Sublime global API.
