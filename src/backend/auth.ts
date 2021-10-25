import { sendAuthentication, getAuthentication, Authentication } from './server'

import { getWalletConnection, getNearPrivateKey, setNearPrivateKey, initContract, setUserInfoNEAR } from './near'
import { getEncryptedPeerIDPrivateKey, hkdf, scrypt, decryptData } from './crypto'
import { addProfileToIPFS, getProfile, Profile, setProfile } from './profile'

// POST newly created account to IPFS
export async function register(
	id: string,
	password: string,
	name: string,
	email: string,
): Promise<{ cid: string; profile: Profile }> {
	const profile: Profile = {
		id,
		name,
		email,
		bio: ``,
		location: ``,
		avatar: ``,
		socials: [],
	}

	const privateKeyBytes = await getNearPrivateKey()

	const [encPrivateKey, cid, userSetStatus] = await Promise.all([
		getEncryptedPeerIDPrivateKey(id, password, `CapsuleBlogchainAuth-${id}`, `CapsuleBlogchainAuth`, privateKeyBytes),
		setProfile(profile),
		setUserInfoNEAR(id),
	])

	if (!userSetStatus.success) {
		throw new Error(userSetStatus.error)
	}

	const walletConnection = getWalletConnection()

	const authObj: Authentication = {
		privateKey: encPrivateKey,
		id,
		nearAccountId: walletConnection.getAccountId() as string,
	}
	const authstatus = await sendAuthentication(authObj)
	if (!authstatus) {
		throw new Error(`Error on sendAuthentication`)
	}

	return { cid, profile }
}

export async function login(
	username: string,
	password: string,
): Promise<{ success: boolean; profile: Profile; profileCID: string }> {
	const ec = new TextEncoder()

	// HKDF(key: userPassword, salt: username, info: "CapsuleBlogchainAuth")
	const nearKey = await hkdf(ec.encode(password), ec.encode(username), ec.encode(`CapsuleBlogchainAuth`))

	// peerIDEncryptionKey = SCRYPT (pw: hp0, salt: "CapsuleBlogchainAuth-${username}", N=2^15, r=8, p=1)
	const peerIDEncryptionKey = await scrypt(nearKey.hp0, ec.encode(`CapsuleBlogchainAuth-${username}`))

	// Authenticate with server to get encrypted PeerIDPrivateKey
	const { success, auth } = await getAuthentication(username, nearKey.hp1)
	if (!success || !auth.nearAccountId) {
		throw new Error(`Authentication failed!`)
	}

	// Check if authentication was successful
	const [privateKeyBytes, profile] = await Promise.all([
		decryptData(peerIDEncryptionKey, auth.privateKey.encryptedPeerIDPrivateKey, auth.privateKey.nonce),
		getProfile(username),
	])

	const isKeySet = await setNearPrivateKey(privateKeyBytes, auth.nearAccountId)
	if (!isKeySet) {
		throw new Error(`Error on setNearPrivateKey`)
	}
	const value = {
		accountId: auth.nearAccountId,
		allKeys: [],
	}
	window.localStorage.setItem(`null_wallet_auth_key`, JSON.stringify(value))
	// Reinitialise Smart Contract API
	await initContract()
	const profileCID = await addProfileToIPFS(profile)
	console.log(success, profile, profileCID)
	return { success, profile, profileCID }
}
