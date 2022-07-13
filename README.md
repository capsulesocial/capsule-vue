<div align="center">

<h1>Capsule-Vue</h1>

Capsule-Vue is the Front-End powering Capsule Social's platform interface.

</div>

## Requirements

- NodeJS v14.5.0 or higher.

## Getting started

### .env Setup

```bash
CONTRACT_NAME=dev-1657702549987-47675900699610
DOMAIN=http://localhost:3000

# ORBIT_URL=https://test-node.capsule.social/orbit
# ORBIT_URL=http://localhost:3001
# CAPSULE_SERVER=http://localhost:3500
CAPSULE_SERVER=https://alpha.capsule.social/server
ORBIT_URL=https://alpha.capsule.social/orbit

# Google
TORUS_GOOGLE_VERIFIER="capsule-social-google-tester"
TORUS_GOOGLE_CLIENTID="653379121360-j8t9ua763vfvd86d1qjguonhrgqvkigo.apps.googleusercontent.com"

# Discord
TORUS_DISCORD_VERIFIER="capsule-social-test-v2-discord"
TORUS_DISCORD_CLIENTID="906210984396468275"

```

### Deploy Web App

```bash
# install dependencies
$ `yarn install`

# Server with hot reload on http://localhost:3000
$ `yarn web`

# Production build
$ yarn build:web

# Launch production Server
$ yarn start

```
### Deploy an Electron App (Mac/Windows)

```bash
# install dependencies
$ `yarn install`

# Server with hot reload on Electron App
$ `yarn dev`

# Production build of electron app, delivered to /dist
# MacOS
$ yarn build:mac

# Windows
$ yarn build:win

```

## Folder Structure

- `/build` - stores icon and additional scripts for Electron builder
- `/mainprocess` - includes JS for Electron main process
- `/src` - includes Nuxt.js project

## Dependencies/Packages:

- [Nuxt.js docs](https://nuxtjs.org) - Vue.js Framework.
- [Vuex persisted state](https://www.npmjs.com/package/vuex-persistedstate) - Rehydrates Vuex state between page reloads.
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework.
- [Marked.js](https://marked.js.org/) - markdown parsing.
- [DOMPurify](https://github.com/cure53/DOMPurify) - sanitize HTML output.
- [electron-nuxt](https://github.com/webspaceteam/electron-nuxt) - Electron scripts.
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) - image compression.
- [toastify-js](https://github.com/apvarun/toastify-js) - toast messages.
- [Quill editor](https://quilljs.com/) - Text Editor.
- [Quill markdown](https://www.npmjs.com/package/quilljs-markdown) - Markdown for editor.


For detailed explanation on how to setup your development environment, check out [Setting up Capsule-Vue/Capsule-Orbit](https://www.notion.so/capsulesocial/Setting-up-Capsule-Vue-Capsule-Orbit-dfb4c81bc9b342c5a45559f78c5d9b47).