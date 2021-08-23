# capsule-vue

Capsule Vue.js front-end, to be integrated into main client codebase.

## Build Setup

#### To deploy a Web app

```bash
# install dependencies
$ yarn install

# Development: Serve with hot reload on http://localhost:3000
$ yarn web

# Production: Build
$ yarn build:web

#Production: Launch Server
$ yarn start
```

#### To deploy an Electron App (Mac/Windows)

```bash
# install dependencies
$ yarn install

# serve with hot reload on Electron App
$ yarn dev

# build production electron app, delivered to /dist
# MacOS
$ yarn build:mac
# Windows
$ yarn build:win
```

### Folder Structure

- `/build` stores icon and additional scripts for Electron builder
- `/mainprocess` includes JS for Electron main process
- `src` includes Nuxt.js project

### Dependencies:

- [Nuxt.js docs](https://nuxtjs.org) - Vue Framework
- [Vuex persisted state](https://www.npmjs.com/package/vuex-persistedstate) - Rehydrates Vuex state between page reloads.
- [TailwindCSS](https://tailwindcss.com) - CSS Framework
- [Marked.js](https://marked.js.org/) - markdown parsing
- [Medium Editor](https://github.com/yabwe/medium-editor) - WYSIWYG editor
- [DOMPurify](https://github.com/cure53/DOMPurify) - sanitize HTML output
- [electron-nuxt](https://github.com/webspaceteam/electron-nuxt) - Electron scripts
