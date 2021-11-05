import { sign } from 'tweetnacl'

import { Post } from './post'
import { getNearPrivateKey } from './near'

async function getSignKeyPair() {
	const secretKey = await getNearPrivateKey()
	const keypair = sign.keyPair.fromSecretKey(secretKey)
	return keypair
}

export async function signContent<T>(content: T) {
	const ec = new TextEncoder()
	const keypair = await getSignKeyPair()
	if (keypair) {
		const message = ec.encode(JSON.stringify(stableOrderObj(content)))
		return sign.detached(message, keypair.secretKey)
	}
	return null
}

export function verifyContent(content: Post, signature: Uint8Array, publicKey: Uint8Array) {
	const ec = new TextEncoder()
	const message = ec.encode(JSON.stringify(content))
	return sign.detached.verify(message, signature, publicKey)
}

export async function getSigningKey() {
	const keypair = await getSignKeyPair()
	if (keypair) {
		return keypair.secretKey
	}
	return null
}

// function getPublicKey(username: string) {
// 	const keypair = getSignKeyPair(username)
// 	if (keypair) {
// 		return keypair.publicKey
// 	}
// 	return null
// }

function stableOrderObj<T extends Record<string, any>>(obj: T): T {
	const keys = Object.keys(obj)
	keys.sort()

	const newObj: any = {}
	for (const key of keys) {
		newObj[key] = obj[key]
	}

	return newObj as T
}
