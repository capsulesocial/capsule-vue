import { sendAuthentication, getAuthentication, Authentication } from './server'

import { getWalletConnection, getNearPrivateKey, setNearPrivateKey, initContract } from './near'
import { getEncryptedPeerIDPrivateKey, hkdf, scrypt, decryptData } from './crypto'
import { genAndSetSigningKey, getSigningKey, setSigningKey } from './keys'
import { getProfileNEAR, loadProfileFromIPFS, Profile, setProfile } from './profile'
import { uint8ArrayToHexString } from './utilities/helpers'

// POST newly created account to IPFS
async function register(
	id: string,
	password: string,
	name: string,
	email: string,
): Promise<{ cid: string; profile: Profile }> {
	// Generate a new keypair for content-signing when a user registers
	// and store it in localStorage
	const pubkey = genAndSetSigningKey(id)
	const profile: Profile = {
		id,
		name,
		email,
		bio: ``,
		location: ``,
		avatar: ``,
		socials: [],
		publicKey: uint8ArrayToHexString(pubkey),
	}

	const privateKeyBytes = await getNearPrivateKey()
	const signingKeyBytes = getSigningKey(id)

	if (!signingKeyBytes) {
		throw new Error(`Error on getSigningKey`)
	}

	const [encPrivateKey, encSigningKey, cid] = await Promise.all([
		getEncryptedPeerIDPrivateKey(id, password, `CapsuleBlogchainAuth-${id}`, `CapsuleBlogchainAuth`, privateKeyBytes),
		getEncryptedPeerIDPrivateKey(id, password, `CapsuleBlogchainSign-${id}`, `CapsuleBlogchainSign`, signingKeyBytes),
		setProfile(profile),
	])

	const walletConnection = getWalletConnection()

	const authObj: Authentication = {
		privateKey: encPrivateKey,
		signingKey: encSigningKey,
		id,
		nearAccountId: walletConnection.getAccountId() as string,
	}
	const authstatus = await sendAuthentication(authObj)
	if (!authstatus) {
		throw new Error(`Error on sendAuthentication`)
	}

	return { cid, profile }
}

async function login(
	username: string,
	password: string,
): Promise<{ success: boolean; profile: Profile; profileCID: string }> {
	const ec = new TextEncoder()

	// HKDF(key: userPassword, salt: username, info: "CapsuleBlogchainAuth")
	const [nearKey, contentKey] = await Promise.all([
		hkdf(ec.encode(password), ec.encode(username), ec.encode(`CapsuleBlogchainAuth`)),
		hkdf(ec.encode(password), ec.encode(username), ec.encode(`CapsuleBlogchainSign`)),
	])

	// peerIDEncryptionKey = SCRYPT (pw: hp0, salt: "CapsuleBlogchainAuth-${username}", N=2^15, r=8, p=1)
	const [peerIDEncryptionKey, encryptionKey] = await Promise.all([
		scrypt(nearKey.hp0, ec.encode(`CapsuleBlogchainAuth-${username}`)),
		scrypt(contentKey.hp0, ec.encode(`CapsuleBlogchainSign-${username}`)),
	])

	// Authenticate with server to get encrypted PeerIDPrivateKey
	const { success, auth } = await getAuthentication(username, nearKey.hp1)

	// Check if authentication was successful
	if (
		success &&
		uint8ArrayToHexString(auth.signingKey.hp1) === uint8ArrayToHexString(contentKey.hp1) &&
		auth.nearAccountId
	) {
		const [privateKeyBytes, nearProfile, signingKeyBytes] = await Promise.all([
			decryptData(peerIDEncryptionKey, auth.privateKey.encryptedPeerIDPrivateKey, auth.privateKey.nonce),
			getProfileNEAR(username),
			decryptData(encryptionKey, auth.signingKey.encryptedPeerIDPrivateKey, auth.signingKey.nonce),
		])
		if (nearProfile.success) {
			// Set Signing Key in localStorage
			setSigningKey(username, signingKeyBytes)
			const isKeySet = await setNearPrivateKey(privateKeyBytes, auth.nearAccountId)
			if (isKeySet) {
				const value = {
					accountId: auth.nearAccountId,
					allKeys: [],
				}
				window.localStorage.setItem(`null_wallet_auth_key`, JSON.stringify(value))
				// Reinitialise Smart Contract API
				await initContract()
				const profile = await loadProfileFromIPFS(nearProfile.profileCID)
				return { success, profile, profileCID: nearProfile.profileCID }
			}
		}
	}

	throw new Error(`Authentication failed!`)
}

export { register, login }
