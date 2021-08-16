import type { Plugin } from '@nuxt/types'
import { Profile } from '../interfaces/Profile'
import { Authentication } from '../interfaces/Authentication'
import { getEncryptedPeerIDPrivateKey, hkdf, scrypt, decryptData } from './crypto'
import { sendAuthentication, getAuthentication } from './server'
import { setProfileNEAR, getProfileNEAR } from './profile'
import { getWalletConnection } from './near'

const multibase = require(`multibase`)

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$register: (payload: Profile, peerIDPrivateKey: string, profileCID: string) => Promise<boolean>
		$login: (
			username: string,
			password: string,
		) => Promise<{ success: boolean; peerIDPrivateKey: string; profileCID: string }>
	}
}

// POST newly created account to IPFS
async function register(payload: Profile, peerIDPrivateKey: string, profileCID: string): Promise<boolean> {
	const base64 = multibase.names.base64
	// peerIDPrivateKey is base64 encoded using js-multibase
	const peerIDPrivateKeyBytes = base64.decode(peerIDPrivateKey)

	const [encPrivateKey, profileSet] = await Promise.all([
		getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKeyBytes),
		setProfileNEAR(profileCID),
	])

	if (profileSet === true) {
		const _walletConnection = getWalletConnection()
		const _accountId: string = _walletConnection.getAccountId()

		const AuthObj: Authentication = { privateKey: encPrivateKey, id: payload.id, nearAccountId: _accountId }
		const authstatus = await sendAuthentication(AuthObj)

		return authstatus
	}

	return false
}

async function login(
	username: string,
	password: string,
): Promise<{ success: boolean; peerIDPrivateKey: string; profileCID: string }> {
	const ec = new TextEncoder()

	// HKDF(key: userPassword, info: "CapsuleBlogchainAuth", salt: username)
	const { hp0, hp1 } = await hkdf(ec.encode(password), ec.encode(username))

	// peerIDEncryptionKey = SCRYPT (pw: hp0, salt: "CapsuleBlogchainAuth-${username}", N=2^15, r=8, p=1)
	const peerIDEncryptionKey = await scrypt(hp0, ec.encode(`CapsuleBlogchainAuth-${username}`))

	// Authenticate with server to get encrypted PeerIDPrivateKey
	const { success, auth } = await getAuthentication(username, hp1)

	// Check if authentication was successful
	if (success === true) {
		const [peerIDPrivateKeyBytes, profile] = await Promise.all([
			decryptData(peerIDEncryptionKey, auth.privateKey.encryptedPeerIDPrivateKey, auth.privateKey.nonce),
			getProfileNEAR(username),
		])
		const base64 = multibase.names.base64
		const peerIDPrivateKey = base64.encode(peerIDPrivateKeyBytes)
		if (profile.success === true) {
			return { success, peerIDPrivateKey, profileCID: profile.profileCID }
		}
	}
	return { success: false, peerIDPrivateKey: ``, profileCID: `` }
}

const authPlugin: Plugin = (_context, inject) => {
	inject(`register`, register)
	inject(`login`, login)
}

export default authPlugin
