# capsule-vue

Capsule Vue.js front-end, to be integrated into main client codebase.

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload on Electron App
$ yarn dev

# build production electron app, delivered to /dist
# MacOS
$ yarn build:mac:dmg
$ yarn build:mac:store
# Windows
$ yarn build:win:32
$ yarn build:win:64
```

### Folder Structure

- `/build` stores icon and additional scripts for Electron builder
- `/mainprocess` includes JS for Electron main process
- `src` includes Nuxt.js project

### Dependencies:

- [Nuxt.js docs](https://nuxtjs.org) - Vue Framework
- [TailwindCSS](https://tailwindcss.com) - CSS Framework
- [Marked.js](https://marked.js.org/) - markdown parsing
- [DOMPurify](https://github.com/cure53/DOMPurify) - sanitize HTML output
- [electron-nuxt](https://github.com/webspaceteam/electron-nuxt) - Electron scripts
