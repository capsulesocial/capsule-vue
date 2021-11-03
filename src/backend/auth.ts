import { initContract, setUserInfoNEAR, getUserInfoNEAR, getNearPublicKey } from './near'
import { addProfileToIPFS, createDefaultProfile, getProfile, Profile } from './profile'
import { uint8ArrayToHexString } from './utilities/helpers'

// POST newly created account to IPFS
export async function register(
	id: string,
	_password: string,
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

	const [cid, userSetStatus] = await Promise.all([addProfileToIPFS(profile), setUserInfoNEAR(id)])

	if (!userSetStatus.success) {
		throw new Error(userSetStatus.error)
	}

	return { cid, profile }
}

export async function login(
	username: string,
	_password: string,
): Promise<{ success: boolean; profile: Profile; profileCID: string }> {
	const { accountId, publicKey } = await getUserInfoNEAR(username)
	const pubKey = await getNearPublicKey(accountId)
	if (!pubKey) {
		throw new Error(`NEAR Key not found!`)
	}

	if (uint8ArrayToHexString(publicKey) !== uint8ArrayToHexString(pubKey)) {
		throw new Error(`Public key on NEAR and localStorage do not match!`)
	}

	const value = {
		accountId,
		allKeys: [],
	}
	window.localStorage.setItem(`null_wallet_auth_key`, JSON.stringify(value))

	// Reinitialise Smart Contract API
	await initContract()

	let profile = createDefaultProfile(username)
	const fetchedProfile = await getProfile(username)
	if (fetchedProfile) {
		profile = fetchedProfile
	}

	const profileCID = await addProfileToIPFS(profile)
	return { success: true, profile, profileCID }
}
