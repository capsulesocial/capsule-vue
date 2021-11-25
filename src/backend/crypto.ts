import { sign } from 'tweetnacl'
import { getUserInfoNEAR } from './near'
import { stableOrderObj } from './utilities/helpers'
import { getSigningKey } from './utilities/keys'

async function _encryptData(data: Uint8Array, counter: Uint8Array, key: Uint8Array) {
	const derivedKey = await window.crypto.subtle.importKey(`raw`, key, { name: `AES-CTR` }, false, [
		`encrypt`,
		`decrypt`,
	])
	const encryptedData = await window.crypto.subtle.encrypt({ name: `AES-CTR`, counter, length: 64 }, derivedKey, data)
	return new Uint8Array(encryptedData)
}

async function _decryptData(data: Uint8Array, counter: Uint8Array, key: Uint8Array) {
	const derivedKey = await window.crypto.subtle.importKey(`raw`, key, { name: `AES-CTR` }, false, [
		`encrypt`,
		`decrypt`,
	])
	const decryptedData = await window.crypto.subtle.decrypt({ name: `AES-CTR`, counter, length: 64 }, derivedKey, data)
	return new Uint8Array(decryptedData)
}

export async function encryptAndSignData<T>(data: T) {
	const signingKey = await getSigningKey()
	if (!signingKey) {
		throw new Error(`Signing key not found in localStorage`)
	}

	// 32-byte key for AES-256
	const key = window.crypto.getRandomValues(new Uint8Array(32))
	// 16-byte counter block for AES-256
	const counter = window.crypto.getRandomValues(new Uint8Array(16))

	const ec = new TextEncoder()
	const byteData = ec.encode(JSON.stringify(stableOrderObj(data)))

	const encryptedData = await _encryptData(byteData, counter, key)
	const signature = sign.detached(encryptedData, signingKey)

	return { ciphertext: encryptedData, signature, key, counter }
}

export async function verifyAndDecryptData(
	authorID: string,
	ciphertext: Uint8Array,
	signature: Uint8Array,
	key: Uint8Array,
	counter: Uint8Array,
) {
	const { publicKey } = await getUserInfoNEAR(authorID)

	const verified = sign.detached.verify(ciphertext, signature, publicKey)
	if (!verified) {
		throw new Error(`Signature not verified!`)
	}

	const decryptedData = await _decryptData(ciphertext, counter, key)
	// TODO: transform this into an object
	return Buffer.from(decryptedData).toString()
}
