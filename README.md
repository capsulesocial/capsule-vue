<div align="center">

<h1>Capsule-Vue</h1>

Capsule-Vue is the Front-End powering Capsule Social's platform interface.

</div>

## Requirements

- NodeJS v14.5.0 or higher.

## Getting started

#### .env Setup

```bash
CONTRACT_NAME=blogchain.near
DOMAIN="https://blogchain.app"
CAPSULE_SERVER="https://blogchain.app/server"
ORBIT_URL="https://node1.blogchain.app"
TORUS_GOOGLE_VERIFIER="blogchain-app-production"
TORUS_GOOGLE_CLIENTID="367906518235-1gh9efo0518u43fnaj3qfgob64fv1o8p.apps.googleusercontent.com"
TORUS_DISCORD_VERIFIER="blogchain-app-discord-production"
TORUS_DISCORD_CLIENTID="947888768269033512"
TORUS_NETWORK=mainnet
STRIPE_PUBLISHABLE_KEY=pk_live_51I81pBCPCJ3FaYLGK7rT7mqLsvvFCAOOxdN2RDLt868Oc2Tvrp6MYuyOoPyT6GkZNXvbGY02T5q6IsB8Z6HpE1PN00aopEjYBi
HCAPTCHA_SITE_KEY="4c2a59d5-cedc-4e81-a646-b769bf50e52c"
NEAR_NETWORK=mainnet
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


## License 

[GNU GENERAL PUBLIC LICENSE 3](./LICENSE)
