/* eslint-disable camelcase */
import stringify from 'json-stable-stringify'
import type { crypto_sign_verify_detached, crypto_sign_detached } from 'libsodium-wrappers'
import { keyStores } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
import { base_decode as baseDecode } from 'near-api-js/lib/utils/serialize'

import { getNearConfig } from './config'
import { uint8ArrayToHexString } from './helpers'

export interface LibsodiumInterface {
	signContent: <T>(content: T) => Promise<{ sig: Uint8Array; publicKey: string }>
	verifyContent: <T>(content: T, signature: Uint8Array, publicKey: Uint8Array) => Promise<boolean>
	initResult: Promise<void>
}

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

async function loadAndInitLibSodium() {
	const { default: res } = await import(`libsodium-wrappers`)

	await res.ready

	const { crypto_sign_verify_detached, crypto_sign_detached } = res
	// @ts-ignore
	return { crypto_sign_verify_detached, crypto_sign_detached, ready: res.ready }
}

function createLibSodium() {
	let libSodiumInitialised = false
	let cryptoSignVerify: typeof crypto_sign_verify_detached | null = null
	let cryptoSign: typeof crypto_sign_detached | null = null

	const promise = loadAndInitLibSodium()

	const promiseCache: Array<{
		func: (...args: any[]) => Promise<any>
		args: any[]
		resolver: (value: any) => void
	}> = []

	function _resolveCachedPromises() {
		for (const v of promiseCache) {
			const { resolver, func, args } = v
			resolver(func(...args))
		}

		// Clear the array
		promiseCache.splice(0, promiseCache.length)
	}

	function _promiseWrapper<T>(func: (...funcArgs: any[]) => Promise<T>, ...args: any[]) {
		if (libSodiumInitialised) {
			return func(...args)
		}

		let resolver: (value: T) => void = () => null
		const promise = new Promise<T>((resolve) => {
			resolver = resolve
		})

		promiseCache.push({ func, args, resolver })

		return promise
	}

	const signContent = async <T>(content: T) => {
		if (cryptoSign === null) {
			throw new Error(`Not initialised!`)
		}
		const { sk, pk } = await getNearPrivateKey()
		const ec = new TextEncoder()
		const message = ec.encode(stringify(content))
		return { sig: cryptoSign(message, sk), publicKey: pk }
	}

	const verifyContent = <T>(content: T, signature: Uint8Array, publicKey: Uint8Array) => {
		if (cryptoSignVerify === null) {
			throw new Error(`Not initialised!`)
		}
		const ec = new TextEncoder()
		const message = ec.encode(stringify(content))
		const res = cryptoSignVerify(signature, message, publicKey)
		return Promise.resolve(res)
	}

	const initResult = promise.then(({ crypto_sign_verify_detached, crypto_sign_detached }) => {
		cryptoSignVerify = crypto_sign_verify_detached
		cryptoSign = crypto_sign_detached
		libSodiumInitialised = true
		_resolveCachedPromises()
	})

	return {
		signContent: <T>(content: T) => _promiseWrapper<{ sig: Uint8Array; publicKey: string }>(signContent, content),
		verifyContent: <T>(content: T, signature: Uint8Array, publicKey: Uint8Array) =>
			_promiseWrapper<boolean>(verifyContent, content, signature, publicKey),
		initResult,
	}
}

let _libsodium: LibsodiumInterface | null = null

export function initLibSodium() {
	if (_libsodium) {
		return _libsodium
	}

	_libsodium = createLibSodium()
	return _libsodium
}

function libsodium() {
	if (!_libsodium) {
		throw new Error(`Libsodium isn't initiated!`)
	}
	return _libsodium
}

export default libsodium
