import { Profile } from '../interfaces/Profile'
import { PrivateKey } from '../interfaces/PrivateKey'
// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$getEncryptedPeerIDPrivateKey: PrivateKey
	}
}

async function hkdf(password: Uint8Array, salt: Uint8Array) {
	const ec = new TextEncoder()
	const key = await window.crypto.subtle.importKey(`raw`, password, `HKDF`, false, [`deriveBits`, `deriveKey`])

	const derivedKey = await window.crypto.subtle.deriveBits(
		{
			name: `HKDF`,
			hash: `SHA-256`,
			info: ec.encode(`CapsuleBlogchainAuth`),
			salt,
		},
		key,
		512,
	)

	const derivedKeyBytes = new Uint8Array(derivedKey)
	return {
		hp0: derivedKeyBytes.slice(0, 32),
		hp1: derivedKeyBytes.slice(32),
	}
}

async function encryptData(key: Uint8Array, data: Uint8Array, nonce: Uint8Array) {
	const derivedKey = await window.crypto.subtle.importKey(`raw`, key, { name: `AES-GCM` }, false, [
		`encrypt`,
		`decrypt`,
	])
	const encryptedData = await window.crypto.subtle.encrypt(
		{
			name: `AES-GCM`,
			iv: nonce,
			tagLength: 128,
		},
		derivedKey,
		data,
	)

	const encryptedDataBytes = new Uint8Array(encryptedData)
	return encryptedDataBytes
}

async function scrypt(passphrase: Uint8Array, salt: Uint8Array) {
	const wasm = await import(`scrypt-wasm`)

	const hexSalt = Buffer.from(salt).toString(`hex`)
	const hexPassphrase = Buffer.from(passphrase).toString(`hex`)

	const derivedKeyHex = wasm.scrypt(hexPassphrase, hexSalt, 32768, 8, 1, 16)

	const derivedKey = new Uint8Array(Buffer.from(derivedKeyHex, `hex`))
	return derivedKey
}

async function getEncryptedPeerIDPrivateKey(payload: Profile, peerIDPrivateKey: Uint8Array) {
	const ec = new TextEncoder()

	// HKDF(key: userPassword, info: "CapsuleBlogchainAuth", salt: username)
	const { hp0, hp1 } = await hkdf(ec.encode(payload.password), ec.encode(payload.id))

	// peerIDEncryptionKey = SCRYPT (pw: hp0, salt: "CapsuleBlogchainAuth-${username}", N=2^15, r=8, p=1)
	const peerIDEncryptionKey = await scrypt(hp0, ec.encode(`CapsuleBlogchainAuth-${payload.id}`))

	// encryptedPeerIDPrivateKey = AES-GCM(key: peerIDEncryptionKey, plaintext: peerIDPrivateKey, nonce: nonce)
	const nonce = window.crypto.getRandomValues(new Uint8Array(12))
	const encryptedPeerIDPrivateKey = await encryptData(peerIDEncryptionKey, peerIDPrivateKey, nonce)

	const privKey: PrivateKey = { encryptedPeerIDPrivateKey, hp1, nonce }
	return privKey
}

export { getEncryptedPeerIDPrivateKey }
