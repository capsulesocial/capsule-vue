import { keyStores } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
import { base_decode as baseDecode } from 'near-api-js/lib/utils/serialize'
import { sign } from 'tweetnacl'
import {
	crypto_sign_verify_detached as cryptoSignVerifyDetached,
	crypto_sign_detached as cryptoSignDetached,
} from 'libsodium-wrappers'

import { getNearConfig } from './config'
import { stableOrderObj, uint8ArrayToHexString } from './helpers'

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

	return { sk: privateKeyBytes, pk: uint8ArrayToHexString(keypair.publicKey.data) }
}

export async function signContent<T>(content: T) {
	const { sk, pk } = await getNearPrivateKey()
	const keypair = sign.keyPair.fromSecretKey(sk)
	if (!keypair) {
		throw new Error(`Post signing failed`)
	}

	const ec = new TextEncoder()
	const message = ec.encode(JSON.stringify(stableOrderObj(content)))
	return { sig: cryptoSignDetached(message, sk), publicKey: pk }
}

export function verifyContent<T>(content: T, signature: Uint8Array, publicKey: Uint8Array) {
	const ec = new TextEncoder()
	const message = ec.encode(JSON.stringify(stableOrderObj(content)))
	return cryptoSignVerifyDetached(signature, message, publicKey)
}

export async function getSigningKey() {
	const { sk } = await getNearPrivateKey()
	const keypair = sign.keyPair.fromSecretKey(sk)
	if (!keypair) {
		return null
	}
	return keypair.secretKey
}
