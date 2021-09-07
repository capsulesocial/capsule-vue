import nacl from 'tweetnacl'
import { Post } from '~/interfaces/Post'

function getSignKeyPair(username: string) {
	const secretKeyHex = window.localStorage.getItem(`content_signing_key_${username}`)
	if (secretKeyHex) {
		const secretKey = new Uint8Array(Buffer.from(secretKeyHex, `hex`))
		const keypair = nacl.sign.keyPair.fromSecretKey(secretKey)
		return keypair
	}
	return null
}

function removeSigningKey(username: string) {
	// Remove signing key from localStorage
	window.localStorage.removeItem(`content_signing_key_${username}`)
}

function signContent(content: Post, username: string) {
	const ec = new TextEncoder()
	const keypair = getSignKeyPair(username)
	if (keypair) {
		const message = ec.encode(JSON.stringify(content))
		return nacl.sign.detached(message, keypair.secretKey)
	}
	return null
}

function verifyContent(content: Post, signature: Uint8Array, publicKey: Uint8Array) {
	const ec = new TextEncoder()
	const message = ec.encode(JSON.stringify(content))
	return nacl.sign.detached.verify(message, signature, publicKey)
}

function getSigningKey(username: string) {
	const keypair = getSignKeyPair(username)
	if (keypair) {
		return keypair.secretKey
	}
	return null
}

function getPublicKey(username: string) {
	const keypair = getSignKeyPair(username)
	if (keypair) {
		return keypair.publicKey
	}
	return null
}

function genAndSetSigningKey(username: string) {
	// Generate an Ed25519 keypair and
	// store it in localStorage
	const keypair = nacl.sign.keyPair()
	setSigningKey(username, keypair.secretKey)
	return keypair.publicKey
}

function setSigningKey(username: string, privateKey: Uint8Array) {
	// Store hex-encoded private key in localStorage
	const encodedPrivateKey = Buffer.from(privateKey).toString(`hex`)
	window.localStorage.setItem(`content_signing_key_${username}`, encodedPrivateKey)
}

export { genAndSetSigningKey, setSigningKey, getPublicKey, getSigningKey, signContent, verifyContent, removeSigningKey }
