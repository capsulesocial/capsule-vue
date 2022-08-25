/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import { hexStringToUint8Array, uint8ArrayToHexString } from './utilities/helpers'
import { IEncryptedPost } from './post'
import libsodium from './utilities/keys'
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

export async function encryptAndSignData(data: IEncryptedPost) {
	// 32-byte key for AES-256
	const key = window.crypto.getRandomValues(new Uint8Array(32))
	// 16-byte counter block for AES-256
	const counter = window.crypto.getRandomValues(new Uint8Array(16))

	const ec = new TextEncoder()
	const byteData = ec.encode(data.content)

	const encryptedData = await _encryptData(byteData, counter, key)
	const encryptedPost: IEncryptedPost = { ...data, content: uint8ArrayToHexString(encryptedData) }

	const { sig, publicKey } = await libsodium().signContent(encryptedPost)

	return {
		data: encryptedPost,
		key: uint8ArrayToHexString(key),
		counter: uint8ArrayToHexString(counter),
		sig: uint8ArrayToHexString(sig),
		publicKey,
	}
}

export async function verifyAndDecryptData(data: IEncryptedPost, key: string, counter: string, sig: string) {
	const { publicKey } = await getUserInfoNEAR(data.authorID)
	const verified = await libsodium().verifyContent(data, hexStringToUint8Array(sig), publicKey)
	if (!verified) {
		throw new Error(`Signature not verified!`)
	}

	const dec = new TextDecoder()

	const decryptedData = await _decryptData(
		hexStringToUint8Array(data.content),
		hexStringToUint8Array(counter),
		hexStringToUint8Array(key),
	)
	const decryptedPost: IEncryptedPost = { ...data, content: dec.decode(decryptedData) }
	return decryptedPost
}

export async function encryptData(data: string) {
	// 32-byte key for AES-256
	const key = window.crypto.getRandomValues(new Uint8Array(32))
	// 16-byte counter block for AES-256
	const counter = window.crypto.getRandomValues(new Uint8Array(16))
	const ec = new TextEncoder()
	const byteData = ec.encode(data)

	const encryptedData = await _encryptData(byteData, counter, key)

	return {
		data: uint8ArrayToHexString(encryptedData),
		key: uint8ArrayToHexString(key),
		counter: uint8ArrayToHexString(counter),
	}
}

export async function decryptData(data: string, key: string, counter: string) {
	const dec = new TextDecoder()

	const decryptedData = await _decryptData(
		hexStringToUint8Array(data),
		hexStringToUint8Array(counter),
		hexStringToUint8Array(key),
	)

	return dec.decode(decryptedData)
}
