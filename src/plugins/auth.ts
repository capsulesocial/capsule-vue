import type { Plugin } from '@nuxt/types'
import { Authentication } from '../interfaces/Authentication'
import { getEncryptedPeerIDPrivateKey, hkdf, scrypt, decryptData } from './crypto'
import { sendAuthentication, getAuthentication } from './server'
import { setProfileNEAR, getProfileNEAR } from './profile'
import { getWalletConnection, getNearPrivateKey, setNearPrivateKey, initContract } from './near'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$register: (id: string, password: string, profileCID: string) => Promise<boolean>
		$login: (username: string, password: string) => Promise<{ success: boolean; profileCID: string }>
	}
}

// POST newly created account to IPFS
async function register(id: string, password: string, profileCID: string): Promise<boolean> {
	const privateKeyBytes = await getNearPrivateKey()

	const [encPrivateKey, profileSet] = await Promise.all([
		getEncryptedPeerIDPrivateKey(id, password, privateKeyBytes),
		setProfileNEAR(profileCID),
	])

	if (profileSet) {
		const walletConnection = getWalletConnection()

		const authObj: Authentication = {
			privateKey: encPrivateKey,
			id,
			nearAccountId: walletConnection.getAccountId() as string,
		}
		const authstatus = await sendAuthentication(authObj)

		return authstatus
	}

	return false
}

async function login(username: string, password: string): Promise<{ success: boolean; profileCID: string }> {
	const ec = new TextEncoder()

	// HKDF(key: userPassword, info: "CapsuleBlogchainAuth", salt: username)
	const { hp0, hp1 } = await hkdf(ec.encode(password), ec.encode(username))

	// peerIDEncryptionKey = SCRYPT (pw: hp0, salt: "CapsuleBlogchainAuth-${username}", N=2^15, r=8, p=1)
	const peerIDEncryptionKey = await scrypt(hp0, ec.encode(`CapsuleBlogchainAuth-${username}`))

	// Authenticate with server to get encrypted PeerIDPrivateKey
	const { success, auth } = await getAuthentication(username, hp1)

	// Check if authentication was successful
	if (success === true) {
		const [privateKeyBytes, profile] = await Promise.all([
			decryptData(peerIDEncryptionKey, auth.privateKey.encryptedPeerIDPrivateKey, auth.privateKey.nonce),
			getProfileNEAR(username),
		])
		if (profile.success) {
			const isKeySet = await setNearPrivateKey(privateKeyBytes, auth.nearAccountId)
			if (isKeySet) {
				const value = {
					accountId: auth.nearAccountId,
					allKeys: [],
				}
				window.localStorage.setItem(`null_wallet_auth_key`, JSON.stringify(value))
				// Reinitialise Smart Contract API
				await initContract()
				return { success, profileCID: profile.profileCID }
			}
		}
	}
	return { success: false, profileCID: `` }
}

const authPlugin: Plugin = (_context, inject) => {
	inject(`register`, register)
	inject(`login`, login)
}

export default authPlugin
