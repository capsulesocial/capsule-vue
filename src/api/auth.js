import { getEncryptedPeerIDPrivateKey } from "../plugins/crypto.js"

export default ({ app: _app }, node) => ({
	// POST newly created account to IPFS
	async register (payload) {
		const peerIDPrivateKey = await node.key.export(`self`, `password`)
		const peerID = await node.id()
		const peerIDPublicKey = peerID.publicKey
		const _res = await getEncryptedPeerIDPrivateKey(payload, peerIDPrivateKey, peerIDPublicKey)
		console.log(_res)
		return payload
		// Returns newly created user object
	},
	// Verify login attempt
	login (_email, _password) {
		const _res = null
		// Returns user object if successful
		return _res
	},
	// Ends user session
	async logout () {
		// Set currentUser to null
		await node.stop()
	},
	forgotPassword (email) {
		return email
	},
	resetPassword (_password, _passwordConfirmation, _resetToken) {
		alert(`password reset!`)
	},
})
