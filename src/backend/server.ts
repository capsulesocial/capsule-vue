import axios from 'axios'
import { PrivateKey } from './utilities/interfaces'
import { hexStringToUint8Array, uint8ArrayToHexString } from './utilities/helpers'

import { capsuleServer } from './utilities/config'
export interface Authentication {
	privateKey: PrivateKey
	id: string
	nearAccountId: string | null
}

export async function sendAuthentication(data: Authentication): Promise<boolean> {
	// Encoding all values to hex
	const encryptedPrivateKeyNonce = uint8ArrayToHexString(data.privateKey.nonce)
	const encryptedPrivateKey = uint8ArrayToHexString(data.privateKey.encryptedPeerIDPrivateKey)
	const hp1 = uint8ArrayToHexString(data.privateKey.hp1)

	try {
		// Request body data
		const reqData = {
			hp1,
			username: data.id,
			encryptedPrivateKey,
			encryptedPrivateKeyNonce,
			accountId: data.nearAccountId,
		}
		const response = await axios.post(`${capsuleServer}/write`, reqData)
		return response.data.status === `OK`
	} catch {
		// Unable to send a request!
	}
	return false
}

export async function getAuthentication(
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
		id: username,
		nearAccountId: null,
	}

	// Request body data
	const reqData = { hp1: hp1Hex, username }
	try {
		const response = await axios.post(`${capsuleServer}/read`, reqData)
		if (response.data.status === `OK`) {
			const encryptedPeerIDPrivateKey = hexStringToUint8Array(response.data.encryptedPrivateKey)
			const hp1 = hexStringToUint8Array(response.data.hp1)
			const nonce = hexStringToUint8Array(response.data.encryptedPrivateKeyNonce)

			const privKey: PrivateKey = { encryptedPeerIDPrivateKey, hp1, nonce }

			const auth: Authentication = {
				privateKey: privKey,
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

export async function resolveUsername(username: string): Promise<{ success: boolean; accountId: string }> {
	// Get NEAR AccountId corresponding to a capsule username
	const requestURL = new URL(`${capsuleServer}/resolve/${username}`)
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
