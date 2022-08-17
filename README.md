<div align="center">

<h1>Capsule-Vue</h1>

Capsule-Vue is the Front-End powering Capsule Social's platform interface.

</div>

## Requirements

- NodeJS v14.5.0 or higher.

## Getting started

#### .env Setup

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

#### Commands

```bash
# install dependencies
$ `yarn install`

# Server with hot reload on http://localhost:3000
$ `yarn web`

# Production build
$ yarn build:web

# Serve production build
$ yarn start
