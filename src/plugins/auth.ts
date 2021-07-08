import type { Plugin } from '@nuxt/types'
import { Profile, PrivateKey } from '../interfaces/Profile'

import { getEncryptedPeerIDPrivateKey } from "./crypto.ts"

declare module 'vue/types/vue' {
	interface Vue {
		$register: PrivateKey
	}
}

	// POST newly created account to IPFS
	async function register (payload: Profile) {
		const peerIDPrivateKey = await node.key.export(`self`, `password`)
		const peerID = await node.id()
		const peerIDPublicKey = peerID.publicKey
		const privateKey = await getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKey, peerIDPublicKey)

		return privateKey
		// Returns newly created user object
	},
	// Verify login attempt
	function login (email: string, password: string) {
		const res = null
		// Returns user object if successful
		return res
	},
	// Ends user session
	async function logout () {
		// Set currentUser to null
		await node.stop()
	},
	function forgotPassword (email) {
		return email
	},
	function resetPassword (password, passwordConfirmation, resetToken) {
		alert(`password reset!`)
	},
})
