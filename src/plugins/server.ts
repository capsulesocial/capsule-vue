import { Authentication } from '~/interfaces/Authentication'
import { PrivateKey } from '~/interfaces/PrivateKey'
import { Profile } from '~/interfaces/Profile'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$sendAuthentication: (data: Authentication) => Promise<boolean>
		$getAuthentication: (username: string, hp1: Uint8Array) => Promise<{ success: boolean; auth: Authentication }>
	}
}

const axios = require(`axios`).default
const serverURL = process.env.SERVER_URL || `http://test-node.capsule.social:4000`
// const serverURL = `http://localhost:8080`

async function sendAuthentication(data: Authentication): Promise<boolean> {
	// Encoding all values to hex
	const nonce = Buffer.from(data.privateKey.nonce).toString(`hex`)
	const encPrivateKey = Buffer.from(data.privateKey.encryptedPeerIDPrivateKey).toString(`hex`)
	const hp1 = Buffer.from(data.privateKey.hp1).toString(`hex`)

	const requestURL = new URL(`/write`, serverURL)
	try {
		// Request body data
		const reqData = {
			hp1,
			username: data.id,
			encryptedPrivateKey: encPrivateKey,
			encryptedPrivateKeyNonce: nonce,
			accountId: data.nearAccountId,
			cid: data.nearAccountId,
		}
		const response = await axios.post(requestURL.toString(), reqData)
		if (response.data.status === `OK`) {
			// Registration successful!
			return true
		} else {
			// Registration failed!
		}
	} catch {
		// Unable to send a request!
	}
	return false
}

async function getAuthentication(
	username: string,
	hp1Send: Uint8Array,
): Promise<{ success: boolean; auth: Authentication }> {
	// Encoding hp1 to hex
	const hp1Hex = Buffer.from(hp1Send).toString(`hex`)

	// Initialise empty Authentication object to be used as a default return value
	const defaultprivKey: PrivateKey = {
		encryptedPeerIDPrivateKey: new Uint8Array(),
		hp1: new Uint8Array(),
		nonce: new Uint8Array(),
	}
	const defaultAuth: Authentication = { privateKey: defaultprivKey, id: username, nearAccountId: `` }

	const requestURL = new URL(`/read`, serverURL)
	// Request body data
	const reqData = { hp1: hp1Hex, username }
	try {
		const response = await axios.post(requestURL.toString(), reqData)
		if (response.data.status === `OK`) {
			const encryptedPeerIDPrivateKey = new Uint8Array(Buffer.from(response.data.encryptedPrivateKey, `hex`))
			const hp1 = new Uint8Array(Buffer.from(response.data.hp1, `hex`))
			const nonce = new Uint8Array(Buffer.from(response.data.encryptedPrivateKeyNonce, `hex`))
			const privKey: PrivateKey = { encryptedPeerIDPrivateKey, hp1, nonce }
			const auth: Authentication = { privateKey: privKey, id: username, nearAccountId: response.data.accountId }
			return { success: true, auth }
		}
	} catch {
		// Unable to send a request!
	}
	return { success: false, auth: defaultAuth }
}

async function resolveUsername(username: string): Promise<{ success: boolean; accountId: string }> {
	// Get NEAR AccountId corresponding to a capsule username
	const requestURL = new URL(`/resolve/${username}`, serverURL)
	try {
		const response = await axios.get(requestURL.toString())
		if (response.data.status === `OK`) {
			const _accountId = response.data.accountId
			return { success: true, accountId: _accountId }
		} else {
			throw new Error(`Failed to find accountId`)
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error)
	}
	return { success: false, accountId: `` }
}

async function sendProfileServer(cid: string, data: Profile): Promise<{ success: boolean; cid: string }> {
	const baseUrl = `http://localhost:3001`
	const requestURL = new URL(`/profile`, baseUrl)
	try {
		const response = await axios.post(requestURL.toString(), { cid, data })
		if (response.data.success === true) {
			const _cid = response.data.cid
			return { success: true, cid: _cid }
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error)
	}
	return { success: false, cid: `` }
}

export { sendAuthentication, getAuthentication, resolveUsername, sendProfileServer }
