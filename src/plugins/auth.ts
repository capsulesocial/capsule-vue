import type { Plugin } from '@nuxt/types'
import { Profile } from '../interfaces/Profile'
import { Authentication } from '../interfaces/Authentication'
import { getEncryptedPeerIDPrivateKey } from './crypto'
import { sendAuthentication } from './server'

const multibase = require(`multibase`)

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$register: (payload: Profile, peerIDPrivateKey: string) => Promise<boolean>
	}
}

// POST newly created account to IPFS
async function register(payload: Profile, peerIDPrivateKey: string): Promise<boolean> {
	const base64 = multibase.names.base64
	// peerIDPrivateKey is base64 encoded using js-multibase
	const peerIDPrivateKeyBytes = base64.decode(peerIDPrivateKey)

	const encPrivateKey = await getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKeyBytes)

	const AuthObj: Authentication = { privateKey: encPrivateKey, id: payload.id }
	const authstatus = await sendAuthentication(AuthObj)
	return authstatus
}

const authPlugin: Plugin = (_context, inject) => {
	inject(`register`, register)
}

export default authPlugin
