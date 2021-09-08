import axios from 'axios'
import { PrivateKey } from './interfaces'
import { hexStringToUint8Array, uint8ArrayToHexString } from './helpers'

import { Profile } from '~/interfaces/Profile'
export interface Authentication {
	privateKey: PrivateKey
	signingKey: PrivateKey
	id: string
	nearAccountId: string | null
}

const serverURL = process.env.SERVER_URL || `https://test-node.capsule.social/server`
const baseUrl = process.env.ORBIT_URL || `https://test-node.capsule.social/orbit`

async function sendAuthentication(data: Authentication): Promise<boolean> {
	// Encoding all values to hex
	const encryptedPrivateKeyNonce = uint8ArrayToHexString(data.privateKey.nonce)
	const encryptedPrivateKey = uint8ArrayToHexString(data.privateKey.encryptedPeerIDPrivateKey)
	const hp1 = uint8ArrayToHexString(data.privateKey.hp1)
	const hp1Content = uint8ArrayToHexString(data.signingKey.hp1)
	const encryptedSigningKey = uint8ArrayToHexString(data.signingKey.encryptedPeerIDPrivateKey)
	const encryptedSigningKeyNonce = uint8ArrayToHexString(data.signingKey.nonce)

	try {
		// Request body data
		const reqData = {
			hp1,
			username: data.id,
			encryptedPrivateKey,
			encryptedPrivateKeyNonce,
			hp1Content,
			encryptedSigningKey,
			encryptedSigningKeyNonce,
			accountId: data.nearAccountId,
		}
		const response = await axios.post(`${serverURL}/write`, reqData)
		return response.data.status === `OK`
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
	const hp1Hex = uint8ArrayToHexString(hp1Send)

	// Initialise empty Authentication object to be used as a default return value
	const defaultprivKey: PrivateKey = {
		encryptedPeerIDPrivateKey: new Uint8Array(),
		hp1: new Uint8Array(),
		nonce: new Uint8Array(),
	}
	const defaultAuth: Authentication = {
		privateKey: defaultprivKey,
		signingKey: defaultprivKey,
		id: username,
		nearAccountId: null,
	}

	// Request body data
	const reqData = { hp1: hp1Hex, username }
	try {
		const response = await axios.post(`${serverURL}/read`, reqData)
		if (response.data.status === `OK`) {
			const encryptedPeerIDPrivateKey = hexStringToUint8Array(response.data.encryptedPrivateKey)
			const hp1 = hexStringToUint8Array(response.data.hp1)
			const nonce = hexStringToUint8Array(response.data.encryptedPrivateKeyNonce)

			const encryptedSigningKey = hexStringToUint8Array(response.data.encryptedSigningKey)
			const hp1Content = hexStringToUint8Array(response.data.hp1Content)
			const encryptedSigningKeyNonce = hexStringToUint8Array(response.data.encryptedSigningKeyNonce)

			const signKey: PrivateKey = {
				encryptedPeerIDPrivateKey: encryptedSigningKey,
				hp1: hp1Content,
				nonce: encryptedSigningKeyNonce,
			}
			const privKey: PrivateKey = { encryptedPeerIDPrivateKey, hp1, nonce }

			const auth: Authentication = {
				privateKey: privKey,
				signingKey: signKey,
				id: username,
				nearAccountId: response.data.accountId,
			}
			return { success: true, auth }
		}
	} catch {
		// Unable to send a request!
	}
	return { success: false, auth: defaultAuth }
}

async function resolveUsername(username: string): Promise<{ success: boolean; accountId: string }> {
	// Get NEAR AccountId corresponding to a capsule username
	const requestURL = new URL(`${serverURL}/resolve/${username}`)
	try {
		const response = await axios.get(requestURL.toString())
		if (response.data.status === `OK`) {
			const _accountId = response.data.accountId
			return { success: true, accountId: _accountId }
		}
		throw new Error(`Failed to find accountId`)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error)
	}
	return { success: false, accountId: `` }
}

async function sendProfileServer(cid: string, data: Profile): Promise<{ success: boolean; cid: string }> {
	try {
		const response = await axios.post(`${baseUrl}/profile`, { cid, data })
		if (response.data.success) {
			return { success: true, cid: response.data.cid }
		}
		throw new Error(`Failed to send Profile`)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error)
	}
	return { success: false, cid: `` }
}

export { sendAuthentication, getAuthentication, resolveUsername, sendProfileServer }
