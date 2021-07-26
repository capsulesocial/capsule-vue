import type { Plugin } from '@nuxt/types'
import { Profile } from '../interfaces/Profile'
import { Authentication } from '../interfaces/Authentication'
import { getEncryptedPeerIDPrivateKey, hkdf, scrypt, decryptData } from './crypto'
import { sendAuthentication, getAuthentication } from './server'

const multibase = require(`multibase`)

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$register: (payload: Profile, peerIDPrivateKey: string) => Promise<boolean>
		$login: (username: string, password: string) => Promise<boolean>
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

async function login(username: string, password: string): Promise<boolean> {
	const ec = new TextEncoder()

	// HKDF(key: userPassword, info: "CapsuleBlogchainAuth", salt: username)
	const { hp0, hp1 } = await hkdf(ec.encode(password), ec.encode(username))

	// peerIDEncryptionKey = SCRYPT (pw: hp0, salt: "CapsuleBlogchainAuth-${username}", N=2^15, r=8, p=1)
	const peerIDEncryptionKey = await scrypt(hp0, ec.encode(`CapsuleBlogchainAuth-${username}`))

	// Authenticate with server to get encrypted PeerIDPrivateKey
	const { success, auth } = await getAuthentication(username, hp1)

	// Check if authentication was successful
	if (success === true) {
		const peerIDPrivateKeyBytes = await decryptData(
			peerIDEncryptionKey,
			auth.privateKey.encryptedPeerIDPrivateKey,
			auth.privateKey.nonce,
		)
		const base64 = multibase.names.base64
		const peerIDPrivateKey = base64.encode(peerIDPrivateKeyBytes)
		console.log(peerIDPrivateKey)
		return success
	}
	return false
}

const authPlugin: Plugin = (_context, inject) => {
	inject(`register`, register)
	inject(`login`, login)
}

export default authPlugin
