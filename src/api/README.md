# API

The files in this _/api_ directory are injected into the root instance in _/plugins/api.js_ and are available globally using the following syntax:

export default ({ app }, node) => ({
- `app` is the Vue root instance
- `node` is the IPFS node


```
// syntax
this.$api.file.method()

// example
this.$api.settings.verifySocial()
```
