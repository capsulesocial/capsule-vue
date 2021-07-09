import type { Plugin } from '@nuxt/types'
import { Profile } from "../interfaces/Profile"
import { PrivateKey } from "../interfaces/PrivateKey"
import { getEncryptedPeerIDPrivateKey } from "./crypto"

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$register: (payload: Profile, peerIDPrivateKey: string, peerIDPublicKey: string) => Promise<PrivateKey>,
	}
}

// POST newly created account to IPFS
async function register (payload: Profile, peerIDPrivateKey: string, peerIDPublicKey: string) {
	const privateKey = await getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKey, peerIDPublicKey)

	return privateKey
}

const authPlugin: Plugin = (_context, inject) => {
	inject(`register`, register)
}

export default authPlugin
