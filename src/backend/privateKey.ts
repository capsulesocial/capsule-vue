import { scrypt } from 'scrypt-js'
import { base_decode as baseDecode, base_encode as baseEncode } from 'near-api-js/lib/utils/serialize'
import { getNearPrivateKey } from './near'
import { hexStringToUint8Array, uint8ArrayToHexString } from './utilities/helpers'
import { ValidationError } from '@/errors'

export async function getEncryptedPrivateKey(password: string) {
	const accountId = window.localStorage.getItem(`accountId`)
	if (!accountId) {
		throw new ValidationError(`Account not found, are you signed in?`)
	}
	const key = await scrypt(
		new Uint8Array(Buffer.from(password)),
		new Uint8Array(Buffer.from(`CapsuleBlogchain-${accountId}`)),
		32768,
		8,
		1,
		32,
	)
	const encryptionKey = key.slice(0, 16)
	const iv = key.slice(16, 32)

	const derivedEncryptionKey = await window.crypto.subtle.importKey(`raw`, encryptionKey, { name: `AES-GCM` }, false, [
		`encrypt`,
		`decrypt`,
	])
	const privateKeyEncoded = await getNearPrivateKey(accountId)
	if (!privateKeyEncoded) {
		throw new ValidationError(`Private key not found`)
	}
	const privateKey = baseDecode(privateKeyEncoded)

	const encryptedPrivateKey = await window.crypto.subtle.encrypt(
		{ name: `AES-GCM`, iv, tagLength: 96 },
		derivedEncryptionKey,
		privateKey,
	)

	const encodedEncPrivateKey = `encrypted:${uint8ArrayToHexString(new Uint8Array(encryptedPrivateKey))}`
	return encodedEncPrivateKey
}

export async function getDecryptedPrivateKey(password: string, accountId: string, encodedEncPrivateKey: string) {
	const encryptionPrefix = `encrypted:`
	if (!encodedEncPrivateKey.startsWith(encryptionPrefix)) {
		throw new ValidationError(`Private key not encrypted`)
	}

	const encryptedPrivateKey = hexStringToUint8Array(encodedEncPrivateKey.slice(encryptionPrefix.length))
	const key = await scrypt(
		new Uint8Array(Buffer.from(password)),
		new Uint8Array(Buffer.from(`CapsuleBlogchain-${accountId}`)),
		32768,
		8,
		1,
		32,
	)
	const decryptionKey = key.slice(0, 16)
	const iv = key.slice(16, 32)

	const derivedDecryptionKey = await window.crypto.subtle.importKey(`raw`, decryptionKey, { name: `AES-GCM` }, false, [
		`encrypt`,
		`decrypt`,
	])
	const decryptedPrivateKey = await window.crypto.subtle.decrypt(
		{ name: `AES-GCM`, iv, tagLength: 96 },
		derivedDecryptionKey,
		encryptedPrivateKey,
	)

	const encodedPrivateKey = baseEncode(new Uint8Array(decryptedPrivateKey))
	return encodedPrivateKey
}
