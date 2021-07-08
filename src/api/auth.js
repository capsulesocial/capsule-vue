import { getEncryptedPeerIDPrivateKey } from "../plugins/crypto.js"
export default ({ app }, node) => ({
	// POST newly created account to IPFS
	async register (payload) {
		const peerIDPrivateKey = await node.key.export(`self`, `password`)
		const peerID = await node.id()
		const peerIDPublicKey = peerID.publicKey
		const res = await getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKey, peerIDPublicKey)

		return payload
		// Returns newly created user object
	},
	// Verify login attempt
	login (email, password) {
		const res = null
		// Returns user object if successful
		return res
	},
	// Ends user session
	async logout () {
		// Set currentUser to null
		await node.stop()
	},
	forgotPassword (email) {
		return email
	},
	resetPassword (password, passwordConfirmation, resetToken) {
		alert(`password reset!`)
	},
})
