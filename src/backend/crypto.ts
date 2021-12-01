import { hexStringToUint8Array, uint8ArrayToHexString } from './utilities/helpers'
import { Post } from './post'
import { signContent, verifyContent } from './utilities/keys'
import { getUserInfoNEAR } from './near'

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

export async function encryptAndSignData(data: Post) {
	// 32-byte key for AES-256
	const key = window.crypto.getRandomValues(new Uint8Array(32))
	// 16-byte counter block for AES-256
	const counter = window.crypto.getRandomValues(new Uint8Array(16))

	const ec = new TextEncoder()
	const byteData = ec.encode(data.content)

	const encryptedData = await _encryptData(byteData, counter, key)
	const encryptedPost = { ...data, content: uint8ArrayToHexString(encryptedData) } as Post

	const signature = await signContent(encryptedPost)
	if (!signature) {
		throw new Error(`Data signing failed!`)
	}

	return {
		post: encryptedPost,
		key: uint8ArrayToHexString(key),
		counter: uint8ArrayToHexString(counter),
		sig: uint8ArrayToHexString(signature),
	}
}

export async function verifyAndDecryptData(data: Post, key: string, counter: string, sig: string) {
	const { publicKey } = await getUserInfoNEAR(data.authorID)
	const verified = verifyContent(data, hexStringToUint8Array(sig), publicKey)
	if (!verified) {
		throw new Error(`Signature not verified!`)
	}

	const dec = new TextDecoder()

	const decryptedData = await _decryptData(
		hexStringToUint8Array(data.content),
		hexStringToUint8Array(counter),
		hexStringToUint8Array(key),
	)
	const decryptedPost = { ...data, content: dec.decode(decryptedData) }
	return decryptedPost
}
