import { keyStores } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
import { base_decode as baseDecode } from 'near-api-js/lib/utils/serialize'
import { sign } from 'tweetnacl'

import { Post } from '../post'
import { getNearConfig } from './config'
import { stableOrderObj } from './helpers'

const nearConfig = getNearConfig()

async function getNearPrivateKey() {
	const accountId = window.localStorage.getItem(`accountId`)
	if (!accountId) {
		throw new Error(`Account ID not found in local storage`)
	}

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	const keypair = (await keystore.getKey(nearConfig.networkId, accountId)) as KeyPairEd25519

	const privateKey = keypair.secretKey
	const privateKeyBytes = new Uint8Array(baseDecode(privateKey))

	return privateKeyBytes
}

async function getSignKeyPair() {
	const secretKey = await getNearPrivateKey()
	return sign.keyPair.fromSecretKey(secretKey)
}

export async function signContent<T>(content: T) {
	const keypair = await getSignKeyPair()
	if (!keypair) {
		return null
	}

	const ec = new TextEncoder()
	const message = ec.encode(JSON.stringify(stableOrderObj(content)))
	return sign.detached(message, keypair.secretKey)
}

export function verifyContent(content: Post, signature: Uint8Array, publicKey: Uint8Array) {
	const ec = new TextEncoder()
	const message = ec.encode(JSON.stringify(stableOrderObj(content)))
	return sign.detached.verify(message, signature, publicKey)
}

export async function getSigningKey() {
	const keypair = await getSignKeyPair()
	if (!keypair) {
		return null
	}
	return keypair.secretKey
}
