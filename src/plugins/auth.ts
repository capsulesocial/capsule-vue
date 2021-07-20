import type { Plugin } from '@nuxt/types'
import { Profile } from "../interfaces/Profile"
import { PrivateKey } from "../interfaces/PrivateKey"
import { getEncryptedPeerIDPrivateKey } from "./crypto"
const multibase = require(`multibase`)

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$register: (payload: Profile, peerIDPrivateKey: string) => Promise<PrivateKey>,
	}
}

// POST newly created account to IPFS
async function register (payload: Profile, peerIDPrivateKey: string) {
	const base64 = multibase.names.base64
	// peerIDPrivateKey is base64 encoded using js-multibase
	const peerIDPrivateKeyBytes = base64.decode(peerIDPrivateKey)

	const privateKey = await getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKeyBytes)
	return privateKey
}

const authPlugin: Plugin = (_context, inject) => {
	inject(`register`, register)
}

export default authPlugin
